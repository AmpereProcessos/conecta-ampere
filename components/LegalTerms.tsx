"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import FullScreenWrapper from "./layout/FullScreenWrapper";

const TermsAndPrivacy = () => {
	const [showScrollTop, setShowScrollTop] = useState(false);

	const handleScroll = (e: any) => {
		setShowScrollTop(e.target.scrollTop > 200);
	};

	const scrollToTop = () => {
		const scrollArea = document.querySelector(
			"[data-radix-scroll-area-viewport]",
		);
		if (scrollArea) {
			scrollArea.scrollTo({ top: 0, behavior: "smooth" });
		}
	};
	return (
		<div className="w-full h-full grow flex items-center justify-center bg-background">
			<Card className="">
				<CardContent className="p-6">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold mb-2">
							Termos de Serviço e Política de Privacidade
						</h1>
						<p className="text-gray-500">
							Última atualização: 05 de fevereiro de 2025
						</p>
					</div>

					<ScrollArea className="h-[70vh]" onScrollCapture={handleScroll}>
						<div className="pr-6">
							<section className="mb-8">
								<h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
								<p className="text-gray-700 mb-4">
									Bem-vindo à plataforma da Conecta Ampère, um serviço Ampère
									Energias. Este documento estabelece os Termos de Serviço e a
									Política de Privacidade que regem o uso de nossa plataforma e
									do programa "Conecta Ampère".
								</p>
								<p className="text-gray-700">
									Ao acessar ou utilizar nossa plataforma, você concorda
									expressamente com estes Termos de Serviço e nossa Política de
									Privacidade. Se você não concordar com qualquer parte destes
									termos, por favor, não utilize nossos serviços.
								</p>
							</section>

							<section className="mb-8">
								<h2 className="text-2xl font-semibold mb-4">2. Definições</h2>
								<ul className="list-disc pl-6 space-y-2 text-gray-700">
									<li>
										<strong>Plataforma:</strong> Sistema online que
										disponibiliza acesso aos serviços da Empresa
									</li>
									<li>
										<strong>Usuário:</strong> Pessoa física que utiliza a
										plataforma, seja cliente ou não
									</li>
									<li>
										<strong>Cliente:</strong> Usuário que possui projeto(s) de
										energia solar contratado(s) com a Empresa
									</li>
									<li>
										<strong>Conecta Ampère:</strong> Programa de fidelidade e
										indicações da Empresa
									</li>
									<li>
										<strong>Créditos:</strong> Pontos acumulados no programa
										Conecta Ampère
									</li>
								</ul>
							</section>

							<section className="mb-8">
								<h2 className="text-2xl font-semibold mb-4">
									3. Serviços Oferecidos
								</h2>

								<h3 className="text-xl font-medium mb-3">3.1. Para Clientes</h3>
								<ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
									<li>
										Acesso a informações detalhadas sobre projetos contratados
									</li>
									<li>Gerenciamento de créditos do programa Conecta Ampère</li>
									<li>Sistema de indicações</li>
									<li>Resgate de benefícios e recompensas</li>
								</ul>

								<h3 className="text-xl font-medium mb-3">
									3.2. Para Novos Usuários
								</h3>
								<ul className="list-disc pl-6 space-y-2 text-gray-700">
									<li>Criar conta na plataforma</li>
									<li>Participar do programa Conecta Ampère</li>
									<li>Realizar indicações</li>
									<li>
										Acumular e resgatar créditos conforme regras do programa
									</li>
								</ul>
							</section>

							{/* Continue with other sections following the same pattern... */}

							<section className="mb-8">
								<h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
								<p className="text-gray-700 mb-4">
									Para questões sobre estes termos ou sobre seus dados pessoais:
								</p>
								<ul className="list-none space-y-2 text-gray-700">
									<li>📧 E-mail: processos@ampereenergias.com.br</li>
									<li>📞 Telefone: (34) 99769-8560</li>
									<li>
										📍 Endereço: Avenida Nove Nº 233, Centro - 38300-150 -
										Ituiutaba/MG
									</li>
								</ul>
							</section>
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
			{showScrollTop && (
				<Button
					className="fixed bottom-6 right-6 rounded-full p-3"
					onClick={scrollToTop}
					variant="secondary"
				>
					<ChevronUp className="h-6 w-6" />
				</Button>
			)}
		</div>
	);
};

export default TermsAndPrivacy;
