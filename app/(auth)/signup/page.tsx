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
import { FormProvider, useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/authentication/types";
import type { z } from "zod";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { formatToPhone } from "@/lib/methods/formatting";
import { FormSelectInput } from "@/components/inputs-form-only/FormSelectInput";
import { BrazilianStatesOptions } from "@/configs/states_cities";
import FormSelectInput2 from "@/components/inputs-form-only/FormSelectInput2";
function SignUp() {
	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: "",
			phone: "",
			uf: "MG",
			city: "ITUIUTABA",
		},
	});
	const [state, action] = useActionState(login, {});

	console.log(form.watch("uf"));
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
						<FormProvider {...form}>
							<form action={action} className="grid gap-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nome</FormLabel>
											<FormControl>
												<Input placeholder="João das Neves" {...field} />
											</FormControl>
											<FormDescription>Seu nome e sobrenome.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Telefone</FormLabel>
											<FormControl>
												<Input
													placeholder="(34) 99999-9999"
													{...field}
													onChange={(e) =>
														field.onChange(formatToPhone(e.target.value))
													}
												/>
											</FormControl>
											<FormDescription>
												Seu telefone de contato.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="seuemail@email.com" {...field} />
											</FormControl>
											<FormDescription>Seu melhor email.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="seuemail@email.com" {...field} />
											</FormControl>
											<FormDescription>Seu melhor email.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormSelectInput
									name="uf"
									labelText="ESTADO(UF) DA PESSOA INDICADA"
									placeholderText="Preencha aqui o estado federativo da pessoa indicada..."
									options={BrazilianStatesOptions}
									resetOptionText="NÃO DEFINIDO"
								/>
								<FormField
									control={form.control}
									name="uf"
									render={({ field }) => (
										<FormSelectInput2
											field={field}
											labelText="ESTADO(UF) DA PESSOA INDICADA"
											placeholderText="Preencha aqui o estado federativo da pessoa indicada..."
											options={BrazilianStatesOptions}
											resetOptionText="NÃO DEFINIDO"
											description="Seu estado."
										/>
									)}
								/>

								<div className="flex flex-wrap justify-between">
									<Button variant={"link"} size={"sm"} className="p-0" asChild>
										<Link href={"/login"}>
											Já possui uma conta, clique aqui para acessar.
										</Link>
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
						</FormProvider>
					</CardContent>
				</Card>
			</div>
		</FullScreenWrapper>
	);
}

export default SignUp;
