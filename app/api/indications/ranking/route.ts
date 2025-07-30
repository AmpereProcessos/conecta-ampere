import dayjs from 'dayjs';
import { ObjectId, type WithId } from 'mongodb';
import { NextResponse } from 'next/server';
import { CONECTA_AMPERE_CRM_USER_DATA, DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import type { TClient } from '@/schemas/client.schema';
import type { TIndication } from '@/schemas/indication.schema';

const currentMonthStart = dayjs().startOf('month').toISOString();
const currentMonthEnd = dayjs().endOf('month').toISOString();

async function getIndicationsRanking() {
	const { user } = await getValidCurrentSessionUncached();
	const userId = user.id;

	console.log('[INFO] Getting indications ranking:', {
		userId,
		currentMonthStart,
		currentMonthEnd,
	});

	const crmDb = await connectToCRMDatabase();
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);

	const totalIndicationsByAuthor = (await indicationsCollection
		.aggregate([
			{
				$match: {
					dataInsercao: {
						$gte: currentMonthStart,
						$lte: currentMonthEnd,
					},
					// Excluding the conecta ampere user from the ranking
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
					totalIndications: -1,
					_id: 1,
				},
			},
		])
		.toArray()) as { _id: string; totalIndications: number; totalIndicationsWon: number }[];

	console.log('[INFO] Aggregation result:', totalIndicationsByAuthor);

	if (totalIndicationsByAuthor.length === 0) {
		return NextResponse.json({
			data: {
				ranking: [],
				userRanking: null,
			},
		});
	}

	const authorIDs = totalIndicationsByAuthor.map((s) => new ObjectId(s._id));

	const authors = (await clientsCollection
		.find(
			{
				_id: {
					$in: authorIDs,
				},
			},
			{
				projection: {
					_id: 1,
					nome: 1,
					conecta: 1,
				},
			}
		)
		.toArray()) as WithId<{ nome: TClient['nome']; conecta: TClient['conecta'] }>[];

	const totalIndicationsByAuthorWithStandings = totalIndicationsByAuthor.map((s, index) => {
		const author = authors.find((a) => a._id.toString() === s._id);
		return {
			posicao: index + 1,
			autor: {
				id: s._id,
				nome: author?.nome,
				conecta: author?.conecta,
			},
			totalIndicacoes: s.totalIndications,
			totalIndicacoesGanhas: s.totalIndicationsWon,
		};
	});

	const userRanking = totalIndicationsByAuthorWithStandings.find((s) => s.autor.id === userId)?.posicao;

	return NextResponse.json(
		{
			data: {
				ranking: totalIndicationsByAuthorWithStandings.slice(0, 10), // Top
				userRanking: userRanking || null,
			},
		},
		{
			status: 200,
		}
	);
}

export type TGetIndicationsRankingRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof getIndicationsRanking>>>;

export const GET = apiHandler({ GET: getIndicationsRanking });
