import dayjs from 'dayjs';
import { NextResponse } from 'next/server';
import { CONECTA_AMPERE_CRM_USER_DATA, DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import type { TIndication } from '@/schemas/indication.schema';

const currentMonthStart = dayjs().startOf('month').toISOString();
const currentMonthEnd = dayjs().endOf('month').toISOString();
async function getOwnIndicationsRanking() {
	const { user } = await getValidCurrentSessionUncached();
	const userId = user.id;

	console.log('[INFO] Getting own indications ranking:', {
		userId,
		currentMonthStart,
		currentMonthEnd,
	});

	const crmDb = await connectToCRMDatabase();
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);

	const totalIndicationsByAuthor = (await indicationsCollection
		.aggregate([
			{
				$match: {
					dataInsercao: {
						$gte: currentMonthStart,
						$lte: currentMonthEnd,
					},
					'autor.id': { $ne: CONECTA_AMPERE_CRM_USER_DATA.id },
				},
			},
			{
				$group: {
					_id: '$autor.id',
					totalIndications: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ['$dataInsercao', currentMonthStart],
										},
										{
											$lte: ['$dataInsercao', currentMonthEnd],
										},
									],
								},
								1,
								0,
							],
						},
					},
					totalIndicationsWon: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ['$dataInsercao', currentMonthStart],
										},
										{
											$lte: ['$dataInsercao', currentMonthEnd],
										},
										{ $ne: [{ $ifNull: ['$oportunidade.dataGanho', null] }, null] },
									],
								},
								1,
								0,
							],
						},
					},
				},
			},
			{
				$sort: {
					totalIndicationsWon: -1,
				},
			},
		])
		.toArray()) as { _id: string; totalIndications: number; totalIndicationsWon: number }[];

	console.log('[INFO] Aggregation result:', totalIndicationsByAuthor);
	const totalIndicationsByAuthorWithStandings = totalIndicationsByAuthor.map((s, index) => ({ ...s, posicao: index + 1 }));

	const userRanking = totalIndicationsByAuthorWithStandings.find((s) => s._id === userId)?.posicao;

	return NextResponse.json(
		{
			data: {
				userRanking: userRanking || null,
			},
		},
		{
			status: 200,
		}
	);
}

export type TGetOwnIndicationsRankingRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof getOwnIndicationsRanking>>>;
export const GET = apiHandler({ GET: getOwnIndicationsRanking });
