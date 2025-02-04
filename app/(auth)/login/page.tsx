"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/authentication/actions";
import Link from "next/link";
import React, { useActionState } from "react";
import { FaGoogle } from "react-icons/fa";

function Login() {
	const [state, action] = useActionState(login, {});
	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center h-full">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle>Acesso ao Conecta Ampère</CardTitle>
						<CardDescription>
							Acesse ao Dashboard validando sua conta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex w-full flex-col gap-2">
							<Button variant="outline" className="w-full" asChild>
								<Link href="/login/google" prefetch={false}>
									<FaGoogle className="mr-2 h-5 w-5" />
									Acesso com Google
								</Link>
							</Button>
						</div>
						<div className="my-2 flex items-center">
							<div className="flex-grow border-t border-muted" />
							<div className="mx-2 text-muted-foreground">ou</div>
							<div className="flex-grow border-t border-muted" />
						</div>
						<form action={action} className="grid gap-4">
							<div className="space-y-2">
								<Label htmlFor="username">Usuário</Label>
								<Input
									required
									id="username"
									placeholder="meuusername"
									autoComplete="username"
									name="username"
									type="text"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Senha</Label>
								<Input
									required
									id="password"
									placeholder="******"
									autoComplete="password"
									name="password"
									type="password"
								/>
							</div>

							<div className="flex flex-wrap justify-between">
								<Button variant={"link"} size={"sm"} className="p-0" asChild>
									<Link href={"/signup"}>
										Ainda não é um assinante? Assine agora.
									</Link>
								</Button>
								<Button variant={"link"} size={"sm"} className="p-0" asChild>
									<Link href={"/redefinir-senha"}>Esqueceu sua senha?</Link>
								</Button>
							</div>

							{state?.fieldError ? (
								<ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
									{Object.values(state.fieldError).map((err) => (
										<li className="ml-4" key={err}>
											{err}
										</li>
									))}
								</ul>
							) : state?.formError ? (
								<p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
									{state?.formError}
								</p>
							) : null}
							<SubmitButton className="w-full" aria-label="submit-btn">
								Acessar
							</SubmitButton>
							<Button variant="outline" className="w-full" asChild>
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
