"use server";
import {
	encodeBase32LowerCaseNoPadding,
	encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { TSession } from "@/schemas/session.schema";
import dayjs from "dayjs";
import connectToCRMDatabase from "../services/mongodb/crm-db-connection";
import { cookies } from "next/headers";
import {
	DATABASE_COLLECTION_NAMES,
	SESSION_COOKIE_NAME,
} from "@/configs/app-definitions";
import type { TClient } from "@/schemas/client.schema";
import { ObjectId } from "mongodb";
import type { TAuthSession } from "./types";
import { cache } from "react";
import createHttpError from "http-errors";

export async function generateSessionToken(): Promise<string> {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

type CreateSessionParams = {
	token: string;
	userId: string;
};
export async function createSession({ token, userId }: CreateSessionParams) {
	try {
		const sessionId = encodeHexLowerCase(
			sha256(new TextEncoder().encode(token)),
		);

		const session: TSession = {
			sessaoId: sessionId,
			usuarioId: userId,
			dataExpiracao: dayjs().add(1, "month").toISOString(),
		};

		const crmDb = await connectToCRMDatabase();
		const insertResult = await crmDb
			.collection<TSession>("conecta-sessions")
			.insertOne(session);
		return session;
	} catch (error) {
		console.log("Error running createSession", error);
		throw error;
	}
}

export async function validateSession(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// We gotta find the session and its respective user in the db
	const crmDb = await connectToCRMDatabase();
	const sessionsCollection = crmDb.collection<TSession>(
		DATABASE_COLLECTION_NAMES.SESSIONS,
	);
	const clientsCollection = crmDb.collection<TClient>(
		DATABASE_COLLECTION_NAMES.CLIENTS,
	);

	//
	const session = await sessionsCollection.findOne({ sessaoId: sessionId });
	if (!session) return { session: null, user: null };

	const user = await clientsCollection.findOne({
		_id: new ObjectId(session.usuarioId),
	});
	if (!user) {
		console.log("No user found running --validateSession-- method.");
		// // Deleting the session token cookie
		// await deleteSessionTokenCookie();
		return { session: null, user: null };
	}

	const authSession: TAuthSession = {
		session: {
			sessaoId: session.sessaoId,
			usuarioId: session.usuarioId,
			dataExpiracao: session.dataExpiracao,
		},
		user: {
			id: session.usuarioId,
			nome: user.nome,
			cpfCnpj: user.cpfCnpj,
			avatar_url: user.conecta?.avatar_url,
			email: user.conecta?.email,
		},
	};
	// Checking if the session is expired
	if (Date.now() > new Date(session.dataExpiracao).getTime()) {
		console.log("Session expired running --validateSession--");
		// If so, deleting the session
		await crmDb
			.collection<TSession>("conecta-sessions")
			.deleteOne({ sessaoId: session.sessaoId });

		// // Deleting the session token cookie
		// await deleteSessionTokenCookie();
		return { session: null, user: null };
	}
	// Checking if session expires in less 15 days
	if (dayjs().add(15, "days").isAfter(dayjs(session.dataExpiracao))) {
		// If so, extending the session to a month from now
		await sessionsCollection.updateOne(
			{ sessaoId: sessionId },
			{ $set: { dataExpiracao: dayjs().add(15, "days").toISOString() } },
		);
	}

	return authSession;
}

export const getCurrentSession = cache(async () => {
	const cookieStore = await cookies();

	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
	console.log("Token get from --getCurrentSession--", token);
	if (token === null) return { session: null, user: null };

	const sessionResult = await validateSession(token);
	return sessionResult;
});

export const getCurrentSessionUncached = async () => {
	const cookieStore = await cookies();

	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
	if (token === null) return { session: null, user: null };

	const sessionResult = await validateSession(token);
	return sessionResult;
};

export const getValidCurrentSessionUncached = async () => {
	const cookieStore = await cookies();

	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
	if (token === null)
		throw new createHttpError.Unauthorized("Você não está autenticado.");

	const sessionResult = await validateSession(token);

	if (!sessionResult.session || !sessionResult.user)
		throw new createHttpError.Unauthorized("Você não está autenticado.");

	return sessionResult;
};

type SetSessionCookieParams = {
	token: string;
	expiresAt: string;
};
export async function setSetSessionCookie({
	token,
	expiresAt,
}: SetSessionCookieParams) {
	try {
		const cookiesStore = await cookies();
		const resp = cookiesStore.set(SESSION_COOKIE_NAME, token, {
			httpOnly: true,
			path: "/",
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			expires: new Date(expiresAt),
		});
	} catch (error) {
		console.log("ERROR SETTING THE COOKIE", error);
		throw error;
	}
}

export async function deleteSession(sessionId: string) {
	const crmDb = await connectToCRMDatabase();
	const sessionsCollection = crmDb.collection<TSession>(
		DATABASE_COLLECTION_NAMES.SESSIONS,
	);

	return await sessionsCollection.deleteOne({ sessaoId: sessionId });
}

export async function deleteSessionTokenCookie() {
	const cookiesStore = await cookies();

	cookiesStore.set(SESSION_COOKIE_NAME, "", {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	return;
}
