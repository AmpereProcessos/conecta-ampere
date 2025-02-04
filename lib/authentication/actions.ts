"use server";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import { LoginSchema } from "./types";
import type { TClient } from "@/schemas/client.schema";
import {
	createSession,
	generateSessionToken,
	setSetSessionCookie,
} from "@/lib/authentication/session";
import { verifyPasswordHash } from "@/lib/authentication/passwords";
import { redirect } from "next/navigation";

type TLoginResult = {
	formError?: string;
	fieldError?: {
		username?: string;
		password?: string;
	};
};
export async function login(
	_: TLoginResult,
	formData: FormData,
): Promise<TLoginResult> {
	const information = Object.fromEntries(formData.entries());

	const validationParsed = LoginSchema.safeParse(information);
	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		return {
			fieldError: {
				username: err.fieldErrors.username?.[0],
				password: err.fieldErrors.password?.[0],
			},
		};
	}

	const { username, password } = validationParsed.data;

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>("clients");

	const user = await clientsCollection.findOne(
		{ "conecta.usuario": username },
		{ projection: { conecta: 1 } },
	);
	if (!user || !user.conecta) {
		return {
			formError: "Usuário ou senha incorretos.",
		};
	}

	const isValidPassword = await verifyPasswordHash(
		user.conecta.senha,
		password,
	);
	if (!isValidPassword) {
		return {
			formError: "Usuário ou senha incorretos.",
		};
	}

	console.log("USER", user);
	const sessionToken = await generateSessionToken();
	const session = await createSession({
		token: sessionToken,
		userId: user._id.toString(),
	});
	setSetSessionCookie({
		token: sessionToken,
		expiresAt: session.dataExpiracao,
	});
	return redirect("/dashboard");
}
