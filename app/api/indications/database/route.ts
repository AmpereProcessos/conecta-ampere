import createHttpError from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import { isValidNumber } from '@/lib/methods/validation';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import type { TIndication } from '@/schemas/indication.schema';

async function getIndicationsDatabase(request: NextRequest) {
	const PAGE_SIZE = 50;
	const { user } = await getValidCurrentSessionUncached();
	const userId = user.id;

	const searchParams = request.nextUrl.searchParams;
	const page = searchParams.get('page');

	console.log('PAGE NUMBER', Number(page));
	if (!isValidNumber(Number(page)) || Number(page) < 0) throw new createHttpError.BadRequest('Parâmetro de paginação não informado ou inválido.');
	const crmDb = await connectToCRMDatabase();
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);

	const skip = PAGE_SIZE * (Number(page) - 1);
	const limit = PAGE_SIZE;
	const indicationsMatched = await indicationsCollection.countDocuments({
		'autor.id': userId,
	});
	const indications = await indicationsCollection
		.find(
			{ 'autor.id': userId },
			{
				sort: {
					_id: -1,
				},
				skip,
				limit,
			}
		)
		.toArray();
	const totalPages = Math.ceil(indicationsMatched / PAGE_SIZE);

	return NextResponse.json(
		{
			data: {
				indications: indications.map((indication) => ({
					...indication,
					_id: indication._id.toString(),
				})),
				indicationsMatched,
				totalPages,
			},
			message: 'Indicações buscadas com sucesso !',
		},
		{
			status: 200,
		}
	);
}
export type TGetIndicationsDatabaseRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof getIndicationsDatabase>>>;
export const GET = apiHandler({ GET: getIndicationsDatabase });
