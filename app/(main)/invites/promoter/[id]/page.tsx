import InvitesPromoterPage from "@/components/invites/InvitesPromoterPage";
import ErrorComponent from "@/components/layout/ErrorComponent";
import { getInvitesPromoterById } from "@/lib/authentication/invites";
import React from "react";

async function InvitesPromoterMainPage({ params }: { params: Promise<{ id: string }> }) {
	const paramsValues = await params;
	const id = paramsValues.id;
	if (!id) return <ErrorComponent msg="ID do convite não específicado." fullScreen={true} />;
	const promoter = await getInvitesPromoterById(id);
	if (!promoter) return <ErrorComponent msg="Oops, promotor não encontrado." fullScreen={true} />;
	return <InvitesPromoterPage promoter={promoter} />;
}

export default InvitesPromoterMainPage;
