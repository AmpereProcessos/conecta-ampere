"use server";
import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import connectToCRMDatabase from "../services/mongodb/crm-db-connection";
import { ObjectId } from "mongodb";
import type { TInvite } from "@/schemas/invites.schema";
import type { TClient } from "@/schemas/client.schema";

export async function getInviteById(id: string) {
	try {
		const crmDb = await connectToCRMDatabase();
		const indicationsCollection = crmDb.collection<TInvite>(DATABASE_COLLECTION_NAMES.INVITES);

		const invite = await indicationsCollection.findOne({
			_id: new ObjectId(id),
		});
		if (!invite) return null;

		const isExpired = new Date().getTime() > new Date(invite.dataExpiracao).getTime();

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

export async function getInvitesPromoterById(id: string) {
	try {
		const crmDb = await connectToCRMDatabase();
		const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);

		const client = await clientsCollection.findOne({
			_id: new ObjectId(id),
		});

		if (!client) throw new Error("Oops, promotor não encontrado.");

		return {
			id: client._id.toString(),
			nome: client.nome,
			avatarUrl: client.conecta?.avatar_url,
			telefone: client.telefonePrimario,
			email: client.email,
		};
	} catch (error) {
		console.log("Error running getPromoterById", error);
		throw error;
	}
}
export type TGetInvitesPromoterById = Awaited<ReturnType<typeof getInvitesPromoterById>>;
