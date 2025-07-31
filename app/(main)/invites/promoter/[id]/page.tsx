import InvitesPromoterPage from '@/components/invites/InvitesPromoterPage';
import ErrorComponent from '@/components/layout/ErrorComponent';
import { getInvitesPromoterById } from '@/lib/authentication/invites';

async function InvitesPromoterMainPage({ params }: { params: Promise<{ id: string }> }) {
	const paramsValues = await params;
	const id = paramsValues.id;
	if (!id) return <ErrorComponent fullScreen={true} msg="ID do convite não específicado." />;
	const promoter = await getInvitesPromoterById(id);
	if (!promoter) return <ErrorComponent fullScreen={true} msg="Oops, promotor não encontrado." />;
	return <InvitesPromoterPage promoter={promoter} />;
}

export default InvitesPromoterMainPage;
