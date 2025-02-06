import { NextRequest, NextResponse } from "next/server";
import type {
	NextRequest as NextRequestType,
	NextResponse as NextResponseType,
} from "next/server";
import createHttpError from "http-errors";

import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import type { TIndication } from "@/schemas/indication.schema";
import { apiHandler, type UnwrapNextResponse } from "@/lib/api/handler";
import { getCurrentSessionUncached } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";

async function handleGetIndicationStats(req: NextRequestType) {
	const { session, user } = await getCurrentSessionUncached();

	if (!session || !user)
		throw new createHttpError.Unauthorized("Você não está autenticado.");

	const userId = user.id;
	console.log(session, user);
	const crmDb = await connectToCRMDatabase();
	const indicationsCollection = crmDb.collection<TIndication>(
		DATABASE_COLLECTION_NAMES.INDICATIONS,
	);

	// Main stats to obtain:
	// * indications that led to sales
	// * indications that led to opportunity losses
	// * indications that are ongoing opportunities

	const indicationsWonSales = await indicationsCollection.countDocuments({
		"oportunidade.dataGanho": { $ne: null },
		"autor.id": userId,
	});

	const indicationsLostSales = await indicationsCollection.countDocuments({
		"oportunidade.dataPerda": { $ne: null },
		"autor.id": userId,
	});

	const indicationsOnGoingOpportunities =
		await indicationsCollection.countDocuments({
			"oportunidade.dataGanho": null,
			"oportunidade.dataPerda": null,
			"oportunidade.dataInteracao": { $ne: null },
			"autor.id": userId,
		});

	const indicationStats = {
		indicationsWonSales,
		indicationsLostSales,
		indicationsOnGoingOpportunities,
	};
	return NextResponse.json(
		{
			data: indicationStats,
			message: "Resultados de indicações buscada com sucesso !",
		},
		{
			status: 200,
		},
	);
}
export type TGetIndicationStatsRouteOutput = UnwrapNextResponse<
	Awaited<ReturnType<typeof handleGetIndicationStats>>
>;

export const GET = apiHandler({ GET: handleGetIndicationStats });
