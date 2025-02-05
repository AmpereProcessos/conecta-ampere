"use server";
import type { TAuthVerificationToken } from "@/schemas/auth-verification-token.schema";
import connectToCRMDatabase from "../services/mongodb/crm-db-connection";
import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { ObjectId } from "mongodb";

export async function getVerificationTokenById(id: string) {
	try {
		const crmDb = await connectToCRMDatabase();
		const verificationTokensCollection =
			crmDb.collection<TAuthVerificationToken>(
				DATABASE_COLLECTION_NAMES.VERIFICATION_TOKENS,
			);

		const verificationToken = await verificationTokensCollection.findOne({
			_id: new ObjectId(id),
		});
		if (!verificationToken) return null;

		const isExpired =
			new Date().getTime() >
			new Date(verificationToken.dataExpiracao).getTime();

		if (isExpired) return null;

		return {
			id: verificationToken._id.toString(),
			usuarioId: verificationToken.usuarioId,
			usuarioEmail: verificationToken.usuarioEmail,
			dataExpiracao: verificationToken.dataExpiracao,
		};
	} catch (error) {
		console.log("Error getting the verification token by id", error);
		throw error;
	}
}
