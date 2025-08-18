import createHttpError from 'http-errors';
import { type Filter, ObjectId } from 'mongodb';
import { type NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import { RewardOptionSchema, type TRewardOption } from '@/schemas/reward-option.schema';

const CreateRewardOptionRouteInput = RewardOptionSchema.omit({
	autor: true,
	dataInsercao: true,
});
export type TAdminCreateRewardOptionRouteInput = z.infer<typeof CreateRewardOptionRouteInput>;

async function handleCreateRewardOption(req: NextRequest) {
	const { user } = await getValidCurrentSessionUncached();

	if (!user.admin) {
		throw new createHttpError.Forbidden('Você não tem permissão para criar recompensas.');
	}

	const payload = await req.json();
	const rewardOption = CreateRewardOptionRouteInput.parse(payload);

	const crmDb = await connectToCRMDatabase();
	const rewardsOptionsCollection = crmDb.collection<TRewardOption>(DATABASE_COLLECTION_NAMES.REWARDS_OPTIONS);

	const insertedRewardOption = await rewardsOptionsCollection.insertOne({
		...rewardOption,
		autor: { id: user.id, nome: user.nome, avatarUrl: user.avatar_url },
		dataInsercao: new Date().toISOString(),
	});

	if (!insertedRewardOption.acknowledged) {
		throw new createHttpError.InternalServerError('Oops, não foi possível criar a recompensa.');
	}

	return NextResponse.json({
		message: 'Recompensa criada com sucesso.',
		data: {
			insertedId: insertedRewardOption.insertedId.toString(),
		},
	});
}

export type TAdminCreateRewardOptionRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleCreateRewardOption>>>;

export const POST = apiHandler({ POST: handleCreateRewardOption });

const GetRewardOptionsByIdRouteInput = z.object({
	id: z.string({ invalid_type_error: 'Tipo não válido para ID da recompensa.' }).refine((val) => ObjectId.isValid(val), { message: 'ID da recompensa inválido.' }),
});
export type TAdminGetRewardOptionsRouteByIdInput = z.infer<typeof GetRewardOptionsByIdRouteInput>;
const GetRewardOptionsRouteDefaultInput = z.object({
	activeOnly: z.string({ invalid_type_error: 'Tipo não válido para filtro de recompensas ativas.' }).transform((val) => val === 'true'),
});
export type TAdminGetRewardOptionsRouteDefaultInput = z.infer<typeof GetRewardOptionsRouteDefaultInput>;

const GetRewardOptionsRouteInput = z.union([GetRewardOptionsByIdRouteInput, GetRewardOptionsRouteDefaultInput]);
export type TAdminGetRewardOptionsRouteInput = z.infer<typeof GetRewardOptionsRouteInput>;

async function handleGetRewardOptions(req: NextRequest) {
	const { user } = await getValidCurrentSessionUncached();
	if (!user.admin) {
		throw new createHttpError.Forbidden('Você não tem permissão para visualizar recompensas.');
	}
	const searchParams = req.nextUrl.searchParams;
	const params = GetRewardOptionsRouteInput.parse({
		id: searchParams.get('id'),
		activeOnly: searchParams.get('activeOnly'),
	});

	const crmDb = await connectToCRMDatabase();
	const rewardsOptionsCollection = crmDb.collection<TRewardOption>(DATABASE_COLLECTION_NAMES.REWARDS_OPTIONS);

	if ('id' in params) {
		const rewardOption = await rewardsOptionsCollection.findOne({ _id: new ObjectId(params.id) });

		if (!rewardOption) {
			throw new createHttpError.NotFound('Recompensa não encontrada.');
		}

		return NextResponse.json({
			message: 'Recompensa encontrada com sucesso.',
			data: {
				default: undefined,
				byId: { ...rewardOption, _id: rewardOption._id.toString() },
			},
		});
	}

	const currentDateString = new Date().toISOString();
	const activeOnlyQuery: Filter<TRewardOption> = params.activeOnly
		? { dataExclusao: { $exists: false }, $or: [{ dataExpiracao: { $gte: currentDateString } }, { dataExpiracao: { $exists: false } }] }
		: {};

	const query: Filter<TRewardOption> = { ...activeOnlyQuery };
	const rewardOptions = await rewardsOptionsCollection.find(query).toArray();

	return NextResponse.json({
		message: 'Recompensas encontradas com sucesso.',
		data: { default: rewardOptions.map((rewardOption) => ({ ...rewardOption, _id: rewardOption._id.toString() })), byId: undefined },
	});
}

export type TAdminGetRewardOptionsRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleGetRewardOptions>>>;

export const GET = apiHandler({ GET: handleGetRewardOptions });

const EditRewardOptionRouteInput = z.object({
	id: z.string({ invalid_type_error: 'Tipo não válido para ID da recompensa.' }).refine((val) => ObjectId.isValid(val), { message: 'ID da recompensa inválido.' }),
	changes: RewardOptionSchema.partial(),
});
export type TAdminEditRewardOptionRouteInput = z.infer<typeof EditRewardOptionRouteInput>;

async function handleEditRewardOption(req: NextRequest) {
	const { user } = await getValidCurrentSessionUncached();
	if (!user.admin) {
		throw new createHttpError.Forbidden('Você não tem permissão para editar recompensas.');
	}

	const payload = await req.json();
	const { id, changes } = EditRewardOptionRouteInput.parse(payload);

	const crmDb = await connectToCRMDatabase();
	const rewardsOptionsCollection = crmDb.collection<TRewardOption>(DATABASE_COLLECTION_NAMES.REWARDS_OPTIONS);

	const updatedRewardOptionResponse = await rewardsOptionsCollection.updateOne({ _id: new ObjectId(id) }, { $set: changes });

	if (!updatedRewardOptionResponse.acknowledged) {
		throw new createHttpError.InternalServerError('Oops, não foi possível editar a recompensa.');
	}

	if (updatedRewardOptionResponse.matchedCount === 0) {
		throw new createHttpError.NotFound('Recompensa não encontrada.');
	}

	return NextResponse.json({
		message: 'Recompensa editada com sucesso.',
		data: { updatedId: id },
	});
}
export type TAdminEditRewardOptionRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleEditRewardOption>>>;

export const PUT = apiHandler({ PUT: handleEditRewardOption });

const DeleteRewardOptionRouteInput = z.object({
	id: z.string({ invalid_type_error: 'Tipo não válido para ID da recompensa.' }).refine((val) => ObjectId.isValid(val), { message: 'ID da recompensa inválido.' }),
});
export type TAdminDeleteRewardOptionRouteInput = z.infer<typeof DeleteRewardOptionRouteInput>;

async function handleDeleteRewardOption(req: NextRequest) {
	const { user } = await getValidCurrentSessionUncached();
	if (!user.admin) {
		throw new createHttpError.Forbidden('Você não tem permissão para deletar recompensas.');
	}

	const searchParams = req.nextUrl.searchParams;
	const params = DeleteRewardOptionRouteInput.parse({
		id: searchParams.get('id'),
	});

	const crmDb = await connectToCRMDatabase();
	const rewardsOptionsCollection = crmDb.collection<TRewardOption>(DATABASE_COLLECTION_NAMES.REWARDS_OPTIONS);

	const deletedRewardOptionResponse = await rewardsOptionsCollection.updateOne({ _id: new ObjectId(params.id) }, { $set: { dataExclusao: new Date().toISOString() } });

	if (!deletedRewardOptionResponse.acknowledged) {
		throw new createHttpError.InternalServerError('Oops, não foi possível deletar a recompensa.');
	}

	if (deletedRewardOptionResponse.matchedCount === 0) {
		throw new createHttpError.NotFound('Recompensa não encontrada.');
	}

	return NextResponse.json({
		message: 'Recompensa deletada com sucesso.',
		data: { deletedId: params.id },
	});
}

export type TAdminDeleteRewardOptionRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleDeleteRewardOption>>>;

export const DELETE = apiHandler({ DELETE: handleDeleteRewardOption });
