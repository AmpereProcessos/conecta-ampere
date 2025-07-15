import SellerInvitePage from "@/components/invites/seller/SellerInvitePage";
import ErrorComponent from "@/components/layout/ErrorComponent";
import { getSellerInviteByCode } from "@/lib/authentication/invites";
import { getErrorMessage } from "@/lib/methods/errors";

async function SellerInviteMainPage({ params }: { params: Promise<{ code: string }> }) {
	try {
		const paramsValues = await params;
		const code = paramsValues.code;
		if (!code) return <ErrorComponent msg="Código de vendedor não informado." />;

		const seller = await getSellerInviteByCode(code);
		if (!seller) return <ErrorComponent msg="Oops, vendedor não encontrado ou inválido." />;
		return <SellerInvitePage seller={seller} />;
	} catch (error) {
		const errorMsg = getErrorMessage(error);
		console.log("Error running SellerInviteMainPage", error);
		return <ErrorComponent msg={errorMsg} fullScreen={true} />;
	}
}

export default SellerInviteMainPage;
