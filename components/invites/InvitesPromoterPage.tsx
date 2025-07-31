'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import ConectaAmpereLogo from '@/assets/svgs/ampere-blue-logo-icon.svg';
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from '@/configs/states_cities';
import { signUpViaPromoter } from '@/lib/authentication/actions';
import type { TGetInvitesPromoterById } from '@/lib/authentication/invites';
import type { TSignUpViaPromoterSchema } from '@/lib/authentication/types';
import { formatNameAsInitials, formatToPhone } from '@/lib/methods/formatting';
import { SubmitButton } from '../buttons/submit-button';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';
import FullScreenWrapper from '../layout/FullScreenWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

type InvitesPromoterPageProps = {
	promoter: TGetInvitesPromoterById;
};
function InvitesPromoterPage({ promoter }: InvitesPromoterPageProps) {
	const [signUpHolder, setSignUpHolder] = useState<TSignUpViaPromoterSchema>({
		name: '',
		email: '',
		city: '',
		uf: '',
		phone: '',
		termsAndPrivacyPolicyAcceptanceDate: null,
		invitesPromoterId: promoter.id,
		// inviteId: inviteById.id,
	});
	const [actionResult, actionMethod] = useActionState(signUpViaPromoter, {});
	return (
		<FullScreenWrapper>
			<div className="flex h-full w-full items-center justify-center">
				<Card className="w-full max-w-md border-none lg:border-solid">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Image alt="Conecta Ampère Logo" className="h-8 w-8" src={ConectaAmpereLogo} />
							Bem vindo ao Conecta Ampère !
						</CardTitle>
						<CardDescription>Você acessou um link de convite para nossa plataforma.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="mb-4 flex w-full flex-col items-center gap-2">
							<p className="w-full text-center font-bold text-primary/80 text-sm tracking-tight">Você é um convidado de: </p>
							<div className="flex w-full items-center justify-center gap-1">
								<Avatar className="h-6 w-6">
									<AvatarImage alt="Logo" src={promoter.avatarUrl || undefined} />
									<AvatarFallback>{formatNameAsInitials(promoter.nome)}</AvatarFallback>
								</Avatar>
								<p className="text-center font-bold text-primary/80 text-sm tracking-tight">{promoter.nome}</p>
							</div>
						</div>
						<div className="my-2 flex flex-col">
							<p className="w-full text-center font-medium text-primary/80 text-sm tracking-tight">Estamos muitos felizes de receber você.</p>
							<p className="w-full text-center font-medium text-primary/80 text-sm tracking-tight">Preencha as informações abaixo para efetivar seu acesso.</p>
						</div>
						<form action={async () => await actionMethod(signUpHolder)} className="grid gap-4">
							<TextInput
								handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, name: value }))}
								identifier="name"
								labelText="Nome"
								placeholderText="Preencha aqui seu nome..."
								value={signUpHolder.name}
							/>
							<TextInput
								handleChange={(value) =>
									setSignUpHolder((prev) => ({
										...prev,
										phone: formatToPhone(value),
									}))
								}
								identifier="phone"
								labelText="Telefone"
								placeholderText="Preencha aqui seu telefone..."
								value={signUpHolder.phone}
							/>
							<TextInput
								handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, email: value }))}
								labelText="Email"
								placeholderText="Preencha aqui seu melhor email..."
								value={signUpHolder.email}
							/>

							<SelectInput
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
										uf: 'MG',
										cidade: 'ITUIUTABA',
									}))
								}
								labelText="Estado (UF)"
								options={BrazilianStatesOptions}
								placeholderText="Preencha aqui o seu estado federativo..."
								resetOptionText="NÃO DEFINIDO"
								value={signUpHolder.uf}
							/>
							<SelectInput
								handleChange={(value) => setSignUpHolder((prev) => ({ ...prev, city: value }))}
								handleReset={() => setSignUpHolder((prev) => ({ ...prev, city: 'ITUIUTABA' }))}
								labelText="Cidade"
								options={BrazilianCitiesOptionsFromUF(signUpHolder.uf)}
								placeholderText="Preencha aqui a sua cidade..."
								resetOptionText="NÃO DEFINIDO"
								value={signUpHolder.city}
							/>
							<div className="flex w-full items-center gap-1.5">
								<Checkbox
									checked={!!signUpHolder.termsAndPrivacyPolicyAcceptanceDate}
									onCheckedChange={(v) =>
										setSignUpHolder((prev) => ({
											...prev,
											termsAndPrivacyPolicyAcceptanceDate: v === true ? new Date().toISOString() : null,
										}))
									}
								/>
								<p className="w-full font-medium text-primary text-xs">
									Li e concordo com os{' '}
									<Link className="underline-offset-4 hover:underline" href={'/legal'}>
										termos e política de privacidade.
									</Link>
								</p>
							</div>
							{actionResult?.fieldError ? (
								<ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 font-medium text-[0.8rem] text-destructive">
									{Object.values(actionResult.fieldError).map((err) => (
										<li className="ml-4" key={err}>
											{err}
										</li>
									))}
								</ul>
							) : null}
							{actionResult?.formError ? <p className="rounded-lg border bg-destructive/10 p-2 font-medium text-[0.8rem] text-destructive">{actionResult?.formError}</p> : null}
							<SubmitButton aria-label="submit-btn" className="w-full">
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
