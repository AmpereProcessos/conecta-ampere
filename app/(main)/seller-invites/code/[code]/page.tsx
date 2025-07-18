import { redirect } from 'next/navigation';
import SellerInvitePage from '@/components/invites/seller/SellerInvitePage';
import ErrorComponent from '@/components/layout/ErrorComponent';
import { getSellerInviteByCode } from '@/lib/authentication/invites';
import { getCurrentSession } from '@/lib/authentication/session';
import { createInteractionEvent } from '@/lib/mutations/interaction-events';

async function SellerInviteMainPage({ params }: { params: Promise<{ code: string }> }) {
	const paramsValues = await params;
	const code = paramsValues.code;
	if (!code) return <ErrorComponent msg="Código de vendedor não informado." />;
	const seller = await getSellerInviteByCode(code);
	if (!seller) return <ErrorComponent msg="Oops, vendedor não encontrado ou inválido." />;

	const { user } = await getCurrentSession();

	// Creating the interaction event
	await createInteractionEvent({
		tipo: 'VISUALIZACAO_PAGINA',
		vendedor: {
			id: seller.id,
			nome: seller.nome,
			avatar_url: seller.avatarUrl,
		},
		usuario: user ? { id: user.id, nome: user.nome, avatar_url: user.avatar_url } : undefined,
		codigoIndicacaoVendedor: seller.codigoIndicacaoConecta,
		localizacao: {},
		data: new Date().toISOString(),
	});

	if (user) {
		// If user is already logged in, we redirect him to the dashboard with the initial indication seller code and opened indication menu
		return redirect(`/dashboard?indicationSellerCode=${seller.codigoIndicacaoConecta}&newIndicationIsOpen=true`);
	}
	return <SellerInvitePage seller={seller} />;
}

export default SellerInviteMainPage;
