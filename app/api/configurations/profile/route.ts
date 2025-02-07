import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TClient } from "@/schemas/client.schema";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import type { NextRequest } from "next/server";

async function handleGetProfile(req: NextRequest) {
	const { session, user } = await getValidCurrentSessionUncached();

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);

	const client = await clientsCollection.findOne({ _id: new ObjectId(user.id) });
	if (!client) throw new createHttpError.NotFound("Perfil não encontrado.");

	const profile = {
		nome: client.nome,
		cpfCnpj: client.cpfCnpj,
		email: client.conecta?.email,
		telefone: client.telefonePrimario,
	};
}
