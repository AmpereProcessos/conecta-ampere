import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { EmailTemplate, sendEmailWithResend } from "@/lib/email";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TAuthVerificationToken } from "@/schemas/auth-verification-token.schema";
import type { TClient } from "@/schemas/client.schema";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const userId = searchParams.get("userId");

	if (!userId || typeof userId !== "string") {
		const error = "Parâmetros inválidos.";
		return new Response(null, {
			status: 400,
			headers: { Location: `/magic-link/verify?error=${error}` },
		});
	}

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(
		DATABASE_COLLECTION_NAMES.CLIENTS,
	);
	const authVerificationTokensCollection =
		crmDb.collection<TAuthVerificationToken>(
			DATABASE_COLLECTION_NAMES.VERIFICATION_TOKENS,
		);

	const client = await clientsCollection.findOne({ _id: new ObjectId(userId) });

	if (!client || !client.conecta?.email) {
		const error = "Parâmetros inválidos.";
		return new Response(null, {
			status: 400,
			headers: { Location: `/magic-link/verify?error=${error}` },
		});
	}

	const verificationToken = randomBytes(32).toString("hex");
	const verificationTokenExpiresInMinutes = 30;
	const newVerificationToken: TAuthVerificationToken = {
		token: verificationToken,
		usuarioId: client._id.toString(),
		usuarioEmail: client.conecta.email,
		dataExpiracao: dayjs()
			.add(verificationTokenExpiresInMinutes, "minute")
			.toISOString(),
		dataInsercao: new Date().toISOString(),
	};
	const insertAuthVerificationTokenResponse =
		await authVerificationTokensCollection.insertOne(newVerificationToken);

	if (!insertAuthVerificationTokenResponse.acknowledged) {
		const error = "Oops, um erro desconhecido ocorreu, tente novamente.";
		return new Response(null, {
			status: 400,
			headers: { Location: `/login?error=${error}` },
		});
	}

	const insertedAuthVerificationTokenId =
		insertAuthVerificationTokenResponse.insertedId.toString();

	const deleteAuthVerificationTokensResponse =
		await authVerificationTokensCollection.deleteMany({
			_id: { $ne: new ObjectId(insertedAuthVerificationTokenId) },
			usuarioId: userId,
		});

	await sendEmailWithResend(
		client.conecta?.email,
		EmailTemplate.AuthMagicLink,
		{
			magicLink: `${process.env.NEXT_PUBLIC_URL}/magic-link/verify/callback?token=${verificationToken}`,
			expiresInMinutes: verificationTokenExpiresInMinutes,
		},
	);

	const deleteAuthVerificationTokensCount =
		deleteAuthVerificationTokensResponse.deletedCount;
	const detailsMsg =
		deleteAuthVerificationTokensCount > 0
			? "Um novo link de acesso foi enviado !"
			: null;
	const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/magic-link/verify?id=${insertedAuthVerificationTokenId}${detailsMsg ? `&details=${detailsMsg}` : ""}`;
	return new Response(null, {
		status: 302,
		headers: {
			Location: redirectUrl,
		},
	});
}
