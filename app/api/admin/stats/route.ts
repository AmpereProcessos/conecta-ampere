import createHttpError from 'http-errors';
import { ObjectId, type WithId } from 'mongodb';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CONECTA_AMPERE_CRM_USER_DATA, DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
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

	const totalIndicationsByAuthorInPeriod = totalIndicationsByAuthorInPeriodAggregated.map((item) => {
		const author = authors.find((a) => a._id.toString() === item._id);
		return {
			author,
			totalIndications: item.totalIndications,
			totalIndicationsWon: item.totalIndicationsWon,
		};
	});

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
		},
	});
}

export type TGetProgramStatsRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof getProgramStats>>>;

export const GET = apiHandler({ GET: getProgramStats });
