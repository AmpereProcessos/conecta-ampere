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

import { login, signUp } from "@/lib/authentication/actions";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import type { TSignUpSchema } from "@/lib/authentication/types";

import { formatToPhone } from "@/lib/methods/formatting";
import {
	BrazilianCitiesOptionsFromUF,
	BrazilianStatesOptions,
} from "@/configs/states_cities";

import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";
function SignUp() {
	const [signUpHolder, setSignUpHolder] = useState<TSignUpSchema>({
		name: "",
		email: "",
		city: "",
		uf: "",
		phone: "",
	});

	const [actionResult, actionMethod] = useActionState(signUp, {});

	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center h-full">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle>Cadastro ao Conecta Ampère</CardTitle>
						<CardDescription>Crie já sua conta Conecta Ampère</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex w-full flex-col gap-2">
							<Button variant="outline" className="w-full" asChild>
								<Link href="/google" prefetch={false}>
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
						<form
							action={async () => await actionMethod(signUpHolder)}
							className="grid gap-4"
						>
							<TextInput
								identifier="name"
								labelText="Nome"
								placeholderText="Preencha aqui seu nome..."
								value={signUpHolder.name}
								handleChange={(value) =>
									setSignUpHolder((prev) => ({ ...prev, name: value }))
								}
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
								handleChange={(value) =>
									setSignUpHolder((prev) => ({ ...prev, email: value }))
								}
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
								handleChange={(value) =>
									setSignUpHolder((prev) => ({ ...prev, city: value }))
								}
								handleReset={() =>
									setSignUpHolder((prev) => ({ ...prev, city: "ITUIUTABA" }))
								}
								resetOptionText="NÃO DEFINIDO"
							/>
							<div className="w-full flex flex-col">
								<p className="text-xs font-medium text-primary w-full">
									Ao realizar o cadastro você concorda com nossos{" "}
									<Link
										href={"/legal"}
										className="underline-offset-4 hover:underline"
									>
										termos e política de privacidade.
									</Link>
								</p>
							</div>

							<div className="flex flex-wrap justify-between">
								<Button variant={"link"} size={"sm"} className="p-0" asChild>
									<Link href={"/login"}>
										Já possui uma conta, clique aqui para acessar.
									</Link>
								</Button>
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
								<p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
									{actionResult?.formError}
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

export default SignUp;
