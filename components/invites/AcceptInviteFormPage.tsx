"use client";
import type { TGetValidInviteById } from "@/lib/authentication/invites";
import React, { useActionState, useState } from "react";
import FullScreenWrapper from "../layout/FullScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { signUp } from "@/lib/authentication/actions";
import type { TSignUpSchema } from "@/lib/authentication/types";
import TextInput from "../inputs/TextInput";
import { formatNameAsInitials, formatToPhone } from "@/lib/methods/formatting";
import SelectInput from "../inputs/SelectInput";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from "@/configs/states_cities";
import { Checkbox } from "../ui/checkbox";
import { SubmitButton } from "../buttons/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AcceptInviteFormPageProps = {
	inviteById: TGetValidInviteById;
};
function AcceptInviteFormPage({ inviteById }: AcceptInviteFormPageProps) {
	const [signUpHolder, setSignUpHolder] = useState<TSignUpSchema>({
		name: "",
		email: "",
		city: "",
		uf: "",
		phone: "",
		termsAndPrivacyPolicyAcceptanceDate: null,
		inviteId: inviteById.id,
	});
	const [actionResult, actionMethod] = useActionState(signUp, {});

	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center h-full">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle>Bem vindo ao Conecta Ampère !</CardTitle>
						<CardDescription>Você recebeu um convite para nossa plataforma.</CardDescription>
					</CardHeader>
					<CardContent>
						{/* <div className="flex w-full flex-col gap-2">
							<Button variant="outline" className="w-full" asChild>
								<Link href="/google" prefetch={false}>
									<FaGoogle className="mr-2 h-5 w-5" />
									Acesso com Google
								</Link>
							</Button>
						</div> */}
						{/* <div className="my-2 flex items-center">
							<div className="flex-grow border-t border-muted" />
							<div className="mx-2 text-muted-foreground">ou</div>
							<div className="flex-grow border-t border-muted" />
						</div> */}
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

export default AcceptInviteFormPage;
