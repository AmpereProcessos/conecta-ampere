import AcceptInviteFormPage from "@/components/invites/AcceptInviteFormPage";
import AcceptInvitePage from "@/components/invites/AcceptInvitePage";
import ErrorComponent from "@/components/layout/ErrorComponent";
import { getInviteById } from "@/lib/authentication/invites";
import React from "react";

async function AcceptInviteMainPage({ params }: { params: { id: string } }) {
	const id = params.id;
	if (!id) return <ErrorComponent msg="ID do convite não específicado." />;
	const invite = await getInviteById(id);
	if (!invite) return <ErrorComponent msg="Oops, convite não encontrado ou expirado." />;
	// If informations of the invited person are defined, show the AcceptInvitePage
	// The AcceptInvitePage is a page that shows the informations of the promoter, and a CTA button to effectivate the access
	if (invite?.convidadoId) return <AcceptInvitePage inviteById={invite} />;
	// If informations of the invited person are not defined, show the AcceptWithFormInviteMain
	// The AcceptWithFormInviteMain provides a form for data collection and proper access effectivation
	return <AcceptInviteFormPage inviteById={invite} />;
}

export default AcceptInviteMainPage;
