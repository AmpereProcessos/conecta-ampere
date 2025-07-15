import type { TGetInviteById, TGetValidInviteById } from "@/lib/authentication/invites";
import React from "react";
import FullScreenWrapper from "../layout/FullScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatNameAsInitials } from "@/lib/methods/formatting";
import ConectaAmpereLogo from "@/assets/svgs/ampere-blue-logo-icon.svg";
import Image from "next/image";
type AcceptInvitePageProps = {
	inviteById: TGetValidInviteById;
};
function AcceptInvitePage({ inviteById }: AcceptInvitePageProps) {
	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center h-full">
				<Card className="w-full max-w-md border-none lg:border-solid">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Image src={ConectaAmpereLogo} alt="Conecta Ampère Logo" className="w-8 h-8" />
							Bem vindo ao Conecta Ampère !
						</CardTitle>
						<CardDescription>Você recebeu um convite para nossa plataforma.</CardDescription>
					</CardHeader>
					<CardContent className="gap-4 flex flex-col">
						<div className="w-full flex items-center gap-2 flex-col mb-4">
							<p className="w-full text-sm tracking-tight text-primary/80 text-center font-bold">Você recebeu um convite de: </p>
							<div className="w-full flex items-center justify-center gap-1">
								<Avatar className="w-6 h-6">
									<AvatarImage src={inviteById?.promotor?.avatar_url || undefined} alt="Logo" />
									<AvatarFallback>{formatNameAsInitials(inviteById?.promotor.nome)}</AvatarFallback>
								</Avatar>
								<p className="text-sm tracking-tight text-primary/80 text-center font-bold">{inviteById.promotor.nome}</p>
							</div>
						</div>
						<div className="flex flex-col my-2">
							<p className="w-full text-sm font-medium tracking-tight text-primary/80 text-center">Estamos muitos felizes de receber você.</p>
							<p className="w-full  text-sm font-medium tracking-tight text-primary/80 text-center">Clique abaixo para efetivar seu acesso.</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button asChild className="w-full">
							<Link href={`/invites/id/accept?inviteId=${inviteById.id}`} prefetch={false}>
								EFETIVAR ACESSO
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</FullScreenWrapper>
	);
}

export default AcceptInvitePage;
