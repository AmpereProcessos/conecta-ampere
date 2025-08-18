'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import ConectaAmpereLogo from '@/assets/svgs/ampere-blue-logo-icon.svg';
import { SubmitButton } from '@/components/buttons/submit-button';
import SelectInput from '@/components/inputs/SelectInput';
import TextInput from '@/components/inputs/TextInput';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from '@/configs/states_cities';
import { signUp } from '@/lib/authentication/actions';
import type { TSignUpSchema } from '@/lib/authentication/types';
import { formatToPhone } from '@/lib/methods/formatting';

function SignUp() {
	const [signUpHolder, setSignUpHolder] = useState<TSignUpSchema>({
		name: '',
		email: '',
		city: '',
		uf: '',
		phone: '',
		termsAndPrivacyPolicyAcceptanceDate: null,
	});

	const [actionResult, actionMethod] = useActionState(signUp, {});

	return (
		<FullScreenWrapper>
			<div className="flex h-full w-full items-center justify-center">
				<Card className="w-full max-w-md border-none lg:border-solid">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Image alt="Conecta Ampère Logo" className="h-8 w-8" src={ConectaAmpereLogo} />
							Cadastro ao Conecta Ampère
						</CardTitle>
						<CardDescription>Crie já sua conta Conecta Ampère</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex w-full flex-col gap-2">
							<Button asChild className="w-full" variant="outline">
								<Link href="/google" prefetch={false}>
									<FaGoogle className="mr-2 h-5 w-5" />
									Acesso com Google
								</Link>
							</Button>
						</div>
						<div className="my-2 flex items-center">
							<div className="grow border-muted border-t" />
							<div className="mx-2 text-muted-foreground">ou</div>
							<div className="grow border-muted border-t" />
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

							<div className="flex flex-wrap justify-between">
								<Button asChild className="p-0" size={'sm'} variant={'link'}>
									<Link href={'/login'}>Já possui uma conta, clique aqui para acessar.</Link>
								</Button>
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
								Acessar
							</SubmitButton>
							<Button asChild className="w-full" variant="outline">
								<Link href="/">Cancelar</Link>
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</FullScreenWrapper>
	);
}

export default SignUp;
