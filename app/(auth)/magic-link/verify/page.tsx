import { LoadingButton } from "@/components/buttons/loading-button";
import { SubmitButton } from "@/components/buttons/submit-button";
import ErrorComponent from "@/components/layout/ErrorComponent";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getVerificationTokenById } from "@/lib/authentication/verification-tokens";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

async function VerifyWaitingPage({ searchParams }: { searchParams: { id: string; error?: string; details?: string } }) {
	const searchParamsValues = await searchParams;

	console.log(searchParamsValues);
	if (searchParamsValues.error) return <ErrorComponent msg={searchParamsValues.error} />;

	const id = searchParamsValues.id;

	if (!id) return <ErrorComponent msg="ID de verificação não informado." />;
	const token = await getVerificationTokenById(id);
	if (!token) return <ErrorComponent msg="Oops, código não encontrado ou expirado." />;

	const expiresInMinutes = dayjs(token.dataExpiracao).diff(dayjs(), "minutes");

	return (
		<FullScreenWrapper>
			<div className="w-full flex items-center justify-center h-full">
				<Card className="w-full max-w-md border-none lg:border-solid">
					<CardHeader className="text-center">
						<CardTitle>Acesso ao Conecta Ampère</CardTitle>
						<CardDescription>Email de acesso enviado !</CardDescription>
					</CardHeader>
					<CardContent className="gap-4 flex flex-col">
						{searchParamsValues.details ? <p className="w-full text-sm tracking-tight text-blue-800 text-center font-bold">{searchParamsValues.details}</p> : null}
						<p className="w-full text-sm font-medium tracking-tight text-primary/80 text-center">
							Enviamos um email com um link de acesso para: <strong>{token?.usuarioEmail}</strong>
						</p>
						<p className="w-full  text-sm font-medium tracking-tight text-primary/80 text-center">
							O link expira em: <strong>{expiresInMinutes.toFixed(0)} minutos.</strong>
						</p>
					</CardContent>
					<CardFooter>
						<Button variant={"link"} size={"sm"} className="p-0" asChild>
							<Link href={`/magic-link/send?userId=${token.usuarioId}`}>Não recebeu, ou o código expirou ? Clique aqui.</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</FullScreenWrapper>
	);
}

export default VerifyWaitingPage;
