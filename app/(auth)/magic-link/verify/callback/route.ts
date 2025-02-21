import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { createSession, generateSessionToken, setSetSessionCookie } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TAuthVerificationToken } from "@/schemas/auth-verification-token.schema";
import type { TClient } from "@/schemas/client.schema";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const token = searchParams.get("token");

	if (!token || typeof token !== "string") {
		const error = "Token inválido.";
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/magic-link/verify?error=${encodeURIComponent(error)}`,
			},
		});
	}

	console.log(token);
	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const authVerificationTokensCollection = crmDb.collection<TAuthVerificationToken>(DATABASE_COLLECTION_NAMES.VERIFICATION_TOKENS);

	const authVerificationToken = await authVerificationTokensCollection.findOne({
		token: token,
	});
	if (!authVerificationToken) {
		console.log("NO AUTH VERIFICATION FOUND");
		const error = "Token inválido.";
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/magic-link/verify?error=${encodeURIComponent(error)}`,
			},
		});
	}
	console.log("AUTH VERIFICATION TOKEN FOUND", authVerificationToken);

	const client = await clientsCollection.findOne({
		_id: new ObjectId(authVerificationToken.usuarioId),
	});

	if (!client) {
		console.log("CLIENT NOT FOUND");
		const error = "Token inválido.";
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/magic-link/verify?error=${encodeURIComponent(error)}`,
			},
		});
	}

	console.log("CLIENT FOUND", client);
	await authVerificationTokensCollection.deleteOne({
		_id: new ObjectId(authVerificationToken._id),
	});

	console.log("Magic-link validation passed.");
	// In case the opportunity creation succedded, redirecting the user
	const sessionToken = await generateSessionToken();
	const session = await createSession({
		token: sessionToken,
		userId: client?._id.toString(),
	});
	console.log("SESSION CREATED", session);
	try {
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
	} catch (error) {
		console.log("ERROR", error);
		const errorMsg = "Um erro desconhecido ocorreu.";
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/magic-link/verify?error=${encodeURIComponent(errorMsg)}`,
			},
		});
	}

	console.log("SESSION SET");
	return redirect("/");
	// query is "hello" for /api/search?query=hello
}
