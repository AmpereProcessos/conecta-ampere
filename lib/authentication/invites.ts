"use server";
import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import connectToCRMDatabase from "../services/mongodb/crm-db-connection";
import { ObjectId } from "mongodb";
import type { TInvite } from "@/schemas/invites.schema";

export async function getInviteById(id: string) {
	try {
		const crmDb = await connectToCRMDatabase();
		const indicationsCollection = crmDb.collection<TInvite>(DATABASE_COLLECTION_NAMES.INVITES);

		console.log("INVITE_ID", id);
		const invite = await indicationsCollection.findOne({
			_id: new ObjectId(id),
		});
		console.log("INVITE", invite);
		if (!invite) return null;

		const isExpired = new Date().getTime() > new Date(invite.dataExpiracao).getTime();

		console.log("IS_EXPIRED", isExpired);
		if (isExpired) return null;

		const isAccepted = invite.dataAceite;
		if (isAccepted) return null;
		return {
			id: invite._id.toString(),
			promotor: invite.promotor,
			convidadoId: invite.convidado.id,
		};
	} catch (error) {
		console.log("Error running getInviteById", error);
		throw error;
	}
}
export type TGetInviteById = Awaited<ReturnType<typeof getInviteById>>;
export type TGetValidInviteById = Exclude<TGetInviteById, null>;
