import dayjs from 'dayjs';
import createHttpError from 'http-errors';
import { ObjectId, type WithId } from 'mongodb';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CONECTA_AMPERE_CRM_USER_DATA, DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import { getBestNumberOfPointsBetweenDates, getDateBuckets, getEvenlySpacedDates } from '@/lib/methods/dates';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import type { TClient } from '@/schemas/client.schema';
import type { TIndication } from '@/schemas/indication.schema';

const GetProgramStatsRouteInput = z.object({
	after: z.string({
		required_error: 'Data de início não informada.',
		invalid_type_error: 'Tipo não válido para data de início.',
	}),
	before: z.string({
		required_error: 'Data de fim não informada.',
		invalid_type_error: 'Tipo não válido para data de fim.',
	}),
});
export type TGetProgramStatsRouteInput = z.infer<typeof GetProgramStatsRouteInput>;
async function getProgramStats(req: NextRequest) {
	const { user } = await getValidCurrentSessionUncached();

	if (!user.admin) throw new createHttpError.Forbidden('Usuário não autorizado.');

	const searchParamsAfter = req.nextUrl.searchParams.get('after');
	const searchParamsBefore = req.nextUrl.searchParams.get('before');

	const { after, before } = GetProgramStatsRouteInput.parse({
		after: searchParamsAfter,
		before: searchParamsBefore,
	});
	console.log('[INFO] Getting program stats:', {
		userId: user.id,
		after,
		before,
	});
	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);

	const totalParticipants = await clientsCollection.countDocuments({ 'conecta.dataInscricao': { $ne: null } });
	const totalIndications = await indicationsCollection.countDocuments({});
	const totalIndicationsWon = await indicationsCollection.countDocuments({ 'oportunidade.dataGanho': { $ne: null } });

	const totalParticipantsInPeriod = await clientsCollection.countDocuments({
		'conecta.dataInscricao': {
			$gte: after,
			$lte: before,
		},
	});
	const totalIndicationsByTypeInPeriodAggregated = (await indicationsCollection
		.aggregate([
			{
				$group: {
					_id: '$tipo.titulo',
					totalIndications: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ['$dataInsercao', after],
										},
										{
											$lte: ['$dataInsercao', before],
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
											$gte: ['$dataInsercao', after],
										},
										{
											$lte: ['$dataInsercao', before],
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
				},
			},
		])
		.toArray()) as {
		_id: string;
		totalIndications: number;
		totalIndicationsWon: number;
	}[];

	const totalIndicationsInPeriod = totalIndicationsByTypeInPeriodAggregated.reduce((acc, curr) => acc + curr.totalIndications, 0);
	const totalIndicationsWonInPeriod = totalIndicationsByTypeInPeriodAggregated.reduce((acc, curr) => acc + curr.totalIndicationsWon, 0);

	const totalIndicationsByTypeInPeriod = totalIndicationsByTypeInPeriodAggregated.map((item) => ({
		type: item._id,
		totalIndications: item.totalIndications,
		totalIndicationsWon: item.totalIndicationsWon,
	}));

	const totalIndicationsBySellerCodeInPeriodAggregated = (await indicationsCollection
		.aggregate([
			{
				$match: {
					codigoIndicacaoVendedor: { $nin: ['', null] },
				},
			},
			{
				$group: {
					_id: '$codigoIndicacaoVendedor',
					totalIndications: {
						$sum: {
							$cond: [
								{
									$and: [
										{
											$gte: ['$dataInsercao', after],
										},
										{
											$lte: ['$dataInsercao', before],
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
											$gte: ['$dataInsercao', after],
										},
										{
											$lte: ['$dataInsercao', before],
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
				},
			},
		])
		.toArray()) as {
		_id: string;
		totalIndications: number;
		totalIndicationsWon: number;
	}[];

	const totalIndicationsBySellerCodeInPeriod = totalIndicationsBySellerCodeInPeriodAggregated.map((item) => ({
		code: item._id,
		totalIndications: item.totalIndications,
		totalIndicationsWon: item.totalIndicationsWon,
	}));

	const totalIndicationsByAuthorInPeriodAggregated = (await indicationsCollection
		.aggregate([
			{
				$match: {
					dataInsercao: {
						$gte: after,
						$lte: before,
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
											$gte: ['$dataInsercao', after],
										},
										{
											$lte: ['$dataInsercao', before],
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
											$gte: ['$dataInsercao', after],
										},
										{
											$lte: ['$dataInsercao', before],
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
			{
				$limit: 10,
			},
		])
		.toArray()) as { _id: string; totalIndications: number; totalIndicationsWon: number }[];

	// Getting the authors data
	const authorsIds = totalIndicationsByAuthorInPeriodAggregated.map((item) => new ObjectId(item._id));
	const authors = (await clientsCollection
		.find(
			{
				_id: {
					$in: authorsIds,
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
	// Enriching the indications by author with the author data
	const totalIndicationsByAuthorInPeriod = totalIndicationsByAuthorInPeriodAggregated.map((item) => {
		const author = authors.find((a) => a._id.toString() === item._id);
		return {
			author,
			totalIndications: item.totalIndications,
			totalIndicationsWon: item.totalIndicationsWon,
		};
	});

	// Getting the graph data for indications
	const { points: bestNumberOfPointsForPeriodsDates, groupingFormat } = getBestNumberOfPointsBetweenDates({
		startDate: new Date(after),
		endDate: new Date(before),
	});
	const periodDatesStrings = getEvenlySpacedDates({
		startDate: new Date(after),
		endDate: new Date(before),
		points: bestNumberOfPointsForPeriodsDates,
	});
	const currentPeriodDateBuckets = getDateBuckets(periodDatesStrings);

	const initialIndicationsGraphData = Object.fromEntries(periodDatesStrings.map((date) => [dayjs(date).format(groupingFormat), { indications: 0, indicationsWon: 0 }]));
	const indidications = (await indicationsCollection
		.find(
			{
				$or: [
					{
						dataInsercao: {
							$gte: after,
							$lte: before,
						},
					},
					{
						'oportunidade.dataGanho': {
							$gte: after,
							$lte: before,
						},
					},
				],
			},
			{
				projection: {
					_id: 1,
					dataInsercao: 1,
					'oportunidade.dataGanho': 1,
				},
			}
		)
		.toArray()) as WithId<{ dataInsercao: TIndication['dataInsercao']; oportunidade: { dataGanho: TIndication['oportunidade']['dataGanho'] } }>[];

	const indicationsGraphDataReduced = indidications.reduce((acc, current) => {
		const insertDate = new Date(current.dataInsercao);
		const insertTime = insertDate.getTime();
		const wonDate = current.oportunidade.dataGanho ? new Date(current.oportunidade.dataGanho) : null;
		const wonTime = wonDate ? wonDate.getTime() : null;
		// Finding the correct - O(1) in average
		const insertBucket = currentPeriodDateBuckets.find((b) => insertTime >= b.start && insertTime <= b.end);
		const wonBucket = wonTime ? currentPeriodDateBuckets.find((b) => wonTime >= b.start && wonTime <= b.end) : null;
		if (!(insertBucket || wonBucket)) return acc;

		// updating statistics
		const insertKey = insertBucket ? dayjs(insertBucket.key).format(groupingFormat) : null;
		const wonKey = wonBucket ? dayjs(wonBucket.key).format(groupingFormat) : null;
		if (insertKey && acc[insertKey]) acc[insertKey].indications += 1;
		if (wonKey && acc[wonKey]) acc[wonKey].indicationsWon += 1;

		return acc;
	}, initialIndicationsGraphData);
	const indicationsGraphData = Object.entries(indicationsGraphDataReduced).map(([key, value]) => ({
		key,
		indications: value.indications,
		indicationsWon: value.indicationsWon,
	}));
	return NextResponse.json({
		data: {
			totalParticipants,
			totalParticipantsInPeriod,
			totalIndications,
			totalIndicationsWon,
			totalIndicationsByTypeInPeriod,
			totalIndicationsInPeriod,
			totalIndicationsWonInPeriod,
			totalIndicationsBySellerCodeInPeriod,
			totalIndicationsByAuthorInPeriod,
			indicationsGraphData,
		},
	});
}

export type TGetProgramStatsRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof getProgramStats>>>;

export const GET = apiHandler({ GET: getProgramStats });
