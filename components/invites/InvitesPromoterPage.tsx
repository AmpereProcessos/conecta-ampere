"use client";
import React, { useActionState, useState } from "react";
import Link from "next/link";

import TextInput from "../inputs/TextInput";
import { Checkbox } from "../ui/checkbox";
import SelectInput from "../inputs/SelectInput";

import FullScreenWrapper from "../layout/FullScreenWrapper";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatNameAsInitials, formatToPhone } from "@/lib/methods/formatting";

import type { TGetInvitesPromoterById } from "@/lib/authentication/invites";
import { signUp, signUpViaPromoter } from "@/lib/authentication/actions";
import type { TSignUpViaPromoterSchema } from "@/lib/authentication/types";

import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from "@/configs/states_cities";
import { SubmitButton } from "../buttons/submit-button";
import ConectaAmpereLogo from "@/assets/svgs/ampere-blue-logo-icon.svg";
import Image from "next/image";
type InvitesPromoterPageProps = {
	promoter: TGetInvitesPromoterById;
};
function InvitesPromoterPage({ promoter }: InvitesPromoterPageProps) {
	const [signUpHolder, setSignUpHolder] = useState<TSignUpViaPromoterSchema>({
		name: "",
		email: "",
		city: "",
		uf: "",
		phone: "",
		termsAndPrivacyPolicyAcceptanceDate: null,
		invitesPromoterId: promoter.id,
		// inviteId: inviteById.id,
	});
	const [actionResult, actionMethod] = useActionState(signUpViaPromoter, {});
	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center h-full">
				<Card className="w-full max-w-md border-none lg:border-solid">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Image src={ConectaAmpereLogo} alt="Conecta Ampère Logo" className="w-8 h-8" />
							Bem vindo ao Conecta Ampère !
						</CardTitle>
						<CardDescription>Você acessou um link de convite para nossa plataforma.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full flex items-center gap-2 flex-col mb-4">
							<p className="w-full text-sm tracking-tight text-primary/80 text-center font-bold">Você é um convidado de: </p>
							<div className="w-full flex items-center justify-center gap-1">
								<Avatar className="w-6 h-6">
									<AvatarImage src={promoter.avatarUrl || undefined} alt="Logo" />
									<AvatarFallback>{formatNameAsInitials(promoter.nome)}</AvatarFallback>
								</Avatar>
								<p className="text-sm tracking-tight text-primary/80 text-center font-bold">{promoter.nome}</p>
							</div>
						</div>
						<div className="flex flex-col my-2">
							<p className="w-full text-sm font-medium tracking-tight text-primary/80 text-center">Estamos muitos felizes de receber você.</p>
							<p className="w-full  text-sm font-medium tracking-tight text-primary/80 text-center">Preencha as informações abaixo para efetivar seu acesso.</p>
						</div>
						<form action={async () => await actionMethod(signUpHolder)} className="grid gap-4">
							<TextInput
								identifier="name"
								labelText="Nome"
								placeholderText="Preencha aqui seu nome..."
								value={signUpHolder.name}
								handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, name: value }))}
							/>
							<TextInput
								identifier="phone"
								labelText="Telefone"
								placeholderText="Preencha aqui seu telefone..."
								value={signUpHolder.phone}
								handleChange={(value) =>
									setSignUpHolder((prev) => ({
										...prev,
										phone: formatToPhone(value),
									}))
								}
							/>
							<TextInput
								labelText="Email"
								placeholderText="Preencha aqui seu melhor email..."
								value={signUpHolder.email}
								handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, email: value }))}
							/>

							<SelectInput
								labelText="Estado (UF)"
								placeholderText="Preencha aqui o seu estado federativo..."
								value={signUpHolder.uf}
								options={BrazilianStatesOptions}
								handleChange={(value) =>
									setSignUpHolder((prev) => ({
										...prev,
										uf: value,
										city: BrazilianCitiesOptionsFromUF(value)[0]?.value,
									}))
								}
								handleReset={() =>
									setSignUpHolder((prev) => ({
										...prev,
										uf: "MG",
										cidade: "ITUIUTABA",
									}))
								}
								resetOptionText="NÃO DEFINIDO"
							/>
							<SelectInput
								labelText="Cidade"
								placeholderText="Preencha aqui a sua cidade..."
								value={signUpHolder.city}
								options={BrazilianCitiesOptionsFromUF(signUpHolder.uf)}
								handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, city: value }))}
								handleReset={() => setSignUpHolder((prev) => ({ ...prev, city: "ITUIUTABA" }))}
								resetOptionText="NÃO DEFINIDO"
							/>
							<div className="w-full flex items-center gap-1.5">
								<Checkbox
									checked={!!signUpHolder.termsAndPrivacyPolicyAcceptanceDate}
									onCheckedChange={(v) =>
										setSignUpHolder((prev) => ({
											...prev,
											termsAndPrivacyPolicyAcceptanceDate: v === true ? new Date().toISOString() : null,
										}))
									}
								/>
								<p className="text-xs font-medium text-primary w-full">
									Li e concordo com os{" "}
									<Link href={"/legal"} className="underline-offset-4 hover:underline">
										termos e política de privacidade.
									</Link>
								</p>
							</div>
							{actionResult?.fieldError ? (
								<ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
									{Object.values(actionResult.fieldError).map((err) => (
										<li className="ml-4" key={err}>
											{err}
										</li>
									))}
								</ul>
							) : actionResult?.formError ? (
								<p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">{actionResult?.formError}</p>
							) : null}
							<SubmitButton className="w-full" aria-label="submit-btn">
								EFETIVAR ACESSO
							</SubmitButton>
						</form>
					</CardContent>
				</Card>
			</div>
		</FullScreenWrapper>
	);
}

export default InvitesPromoterPage;
