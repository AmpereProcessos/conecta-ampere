import ErrorComponent from '@/components/layout/ErrorComponent';
import { getCurrentSession } from '@/lib/authentication/session';
import { getSellerPublicProfileById } from '@/lib/queries-server/sellers';
import { SellerByIdPage } from './seller-by-id-page';

export default async function SellerById({ params }: { params: Promise<{ id: string }> }) {
	const paramsValues = await params;
	const id = paramsValues.id;
	if (!id) return <ErrorComponent fullScreen={true} msg="ID do vendedor não específicado." />;
	const seller = await getSellerPublicProfileById(id);
	if (!seller) return <ErrorComponent fullScreen={true} msg="Oops, vendedor não encontrado." />;
	const { user } = await getCurrentSession();
	return <SellerByIdPage seller={seller} sessionUser={user} />;
}
