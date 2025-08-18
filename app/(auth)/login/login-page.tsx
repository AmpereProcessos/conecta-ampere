'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import ConectaAmpereLogo from '@/assets/svgs/ampere-blue-logo-icon.svg';
import { SubmitButton } from '@/components/buttons/submit-button';
import TextInput from '@/components/inputs/TextInput';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { login } from '@/lib/authentication/actions';
import type { TLoginSchema } from '@/lib/authentication/types';

function Login() {
	const [loginHolder, setLoginHolder] = useState<TLoginSchema>({
		username: '',
	});
	const [actionResult, actionMethod] = useActionState(login, {});
	return (
		<FullScreenWrapper>
			<div className="flex h-full w-full items-center justify-center">
				<Card className="w-full max-w-md border-none lg:border-solid">
					<CardHeader className="text-center">
						<CardTitle className="flex items-center justify-center gap-2">
							<Image alt="Conecta Ampère Logo" className="h-8 w-8" src={ConectaAmpereLogo} />
							Acesso ao Conecta Ampère
						</CardTitle>
						<CardDescription>Acesse ao Dashboard validando sua conta</CardDescription>
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
						<form action={async () => await actionMethod(loginHolder)} className="grid gap-4">
							<TextInput
								handleChange={(value) => setLoginHolder((prev) => ({ ...prev, username: value }))}
								identifier="username"
								labelText="Email"
								placeholderText="exemplo@email.com"
								value={loginHolder.username}
							/>
							<div className="flex flex-wrap justify-between">
								<Button asChild className="p-0" size={'sm'} variant={'link'}>
									<Link href={'/signup'}>Ainda não é um assinante? Assine agora.</Link>
								</Button>
								<Button asChild className="p-0" size={'sm'} variant={'link'}>
									<Link href={'/redefinir-senha'}>Esqueceu sua senha?</Link>
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

export default Login;
