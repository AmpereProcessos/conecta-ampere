import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { apiHandler, type UnwrapNextResponse } from "@/lib/api/handler";
import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TUser } from "@/schemas/users.schema";
import createHttpError from "http-errors";
import { NextResponse, type NextRequest } from "next/server";

async function handleGetSellers(req: NextRequest) {
	const { session, user } = await getValidCurrentSessionUncached();

	const crmDb = await connectToCRMDatabase();
	const usersCollection = crmDb.collection<TUser>(DATABASE_COLLECTION_NAMES.USERS);

	const searchParams = req.nextUrl.searchParams;
	const indicationCode = searchParams.get("indicationCode");

	if (indicationCode) {
		const seller = await usersCollection.findOne(
			{
				ativo: true,
				codigoIndicacaoConecta: indicationCode,
			},
			{
				projection: {
					nome: 1,
					telefone: 1,
					email: 1,
					avatar_url: 1,
				},
			},
		);
		if (!seller) throw new createHttpError.NotFound("Nenhum vendedor encontrado com esse código.");

		return NextResponse.json({
			data: {
				default: undefined,
				byIndicationCode: {
					nome: seller.nome,
					telefone: seller.telefone,
					email: seller.email,
					avatar_url: seller.avatar_url,
				},
			},
			message: "Vendedor encontrado com sucesso.",
		});
	}

	throw new createHttpError.BadRequest("Código de indicação não informado.");
}
export type TGetSellersRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleGetSellers>>>;
export type TGetSellersRouteOutputDataByIndicationCode = TGetSellersRouteOutput["data"]["byIndicationCode"];
export const GET = apiHandler({ GET: handleGetSellers });
