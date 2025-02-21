import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { createSession, generateSessionToken, setSetSessionCookie } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TClient } from "@/schemas/client.schema";
import type { TInvite } from "@/schemas/invites.schema";
import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const inviteId = searchParams.get("inviteId");

	console.log("INVITE ID", inviteId);
	if (!inviteId || typeof inviteId !== "string" || !ObjectId.isValid(inviteId)) {
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("ID do convite não específicado.")}`,
			},
		});
	}

	const crmDb = await connectToCRMDatabase();
	const invitesCollection = crmDb.collection<TInvite>(DATABASE_COLLECTION_NAMES.INVITES);
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const invite = await invitesCollection.findOne({
		_id: new ObjectId(inviteId),
	});
	console.log("INVITE", invite);
	if (!invite) {
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("Oops, convite não encontrado ou expirado.")}`,
			},
		});
	}
	const isExpired = new Date().getTime() > new Date(invite.dataExpiracao).getTime();
	if (isExpired) {
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("Oops, convite não encontrado ou expirado.")}`,
			},
		});
	}
	const isAccepted = invite.dataAceite;
	if (isAccepted) {
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("Oops, convite já foi aceito.")}`,
			},
		});
	}

	const clientId = invite.convidado.id;

	console.log("INVITE CLIENT ID", clientId);
	if (!clientId) {
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("Oops, convite não pode ser aceito.")}`,
			},
		});
	}

	const client = await clientsCollection.findOne({
		_id: new ObjectId(clientId),
	});
	console.log("CLIENT", client);
	if (!client || !client.email) {
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("Oops, convite não pode ser aceito.")}`,
			},
		});
	}

	// Updating the invite with the acceptance date
	await invitesCollection.updateOne(
		{
			_id: new ObjectId(inviteId),
		},
		{
			$set: {
				dataAceite: new Date().toISOString(),
			},
		},
	);
	// Updating the client
	await clientsCollection.updateOne(
		{
			_id: new ObjectId(clientId),
		},
		{
			$set: {
				conecta: {
					usuario: client.email,
					email: client.email,
					codigoIndicacaoVendedor: invite.promotor.tipo === "VENDEDOR" ? invite.promotor.codigoIndicacao : null,
					senha: "",
				},
			},
		},
	);
	const sessionToken = await generateSessionToken();
	const session = await createSession({
		token: sessionToken,
		userId: client?._id.toString(),
	});
	try {
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return new Response(null, {
			status: 302,
			headers: { Location: "/" },
		});
	} catch (error) {
		console.log("ERROR", error);
		return new Response(null, {
			status: 400,
			headers: {
				Location: `/invites/id?error=${encodeURIComponent("Um erro desconhecido ocorreu.")}`,
			},
		});
	}
}
