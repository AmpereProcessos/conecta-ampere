import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { apiHandler, type UnwrapNextResponse } from "@/lib/api/handler";
import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TClient } from "@/schemas/client.schema";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

async function handleGetUserCreditsBalance() {
	const { session, user } = await getValidCurrentSessionUncached();

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(
		DATABASE_COLLECTION_NAMES.CLIENTS,
	);

	const client = await clientsCollection.findOne({
		_id: new ObjectId(user.id),
	});

	if (!client) throw new createHttpError.BadRequest("Usuário não encontrado.");

	return NextResponse.json(
		{
			data: {
				balance: client.conecta?.creditos || 0,
			},
			message: "Balanço de Créditos Ampère encontrados com sucesso !",
		},
		{
			status: 200,
		},
	);
}
export type TGetUserCreditsBalanceRouteOutput = UnwrapNextResponse<
	Awaited<ReturnType<typeof handleGetUserCreditsBalance>>
>;

export const GET = apiHandler({ GET: handleGetUserCreditsBalance });
