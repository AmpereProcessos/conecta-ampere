import { NextResponse } from 'next/server';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import type { TRewardOption } from '@/schemas/reward-option.schema';

async function getRewardOptions() {
	const currentDateString = new Date().toISOString();
	await getValidCurrentSessionUncached();

	const crmDb = await connectToCRMDatabase();
	const rewardsOptionsCollection = crmDb.collection<TRewardOption>(DATABASE_COLLECTION_NAMES.REWARDS_OPTIONS);

	const rewardOptions = await rewardsOptionsCollection
		.find({ dataExclusao: { $exists: false }, $or: [{ dataExpiracao: { $gte: currentDateString } }, { dataExpiracao: { $exists: false } }] })
		.toArray();

	return NextResponse.json({
		message: 'Recompensas encontradas com sucesso.',
		data: {
			default: rewardOptions.map((rewardOption) => ({
				_id: rewardOption._id.toString(),
				titulo: rewardOption.titulo,
				descricao: rewardOption.descricao,
				imagemCapaUrl: rewardOption.imagemCapaUrl,
				chamada: rewardOption.chamada,
				creditosNecessarios: rewardOption.creditosNecessarios,
			})),
		},
	});
}

export type TGetRewardOptionsRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof getRewardOptions>>>;

export const GET = apiHandler({ GET: getRewardOptions });
