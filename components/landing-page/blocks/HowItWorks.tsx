import Image from "next/image";
import React from "react";
import SignUpIllustration from "@/assets/landing-page/illustration-signup.svg";
import ReferIllustration from "@/assets/landing-page/illustration-refer.svg";
import BussinessDealIllustration from "@/assets/landing-page/illustration-business-deal.svg";
import RedeemCreditsIllustration from "@/assets/landing-page/illustration-redeem-credits.svg";
function HowItWorks() {
	return (
		<div id="como-funciona" className="px-6 lg:px-24 flex flex-col gap-20 w-full">
			<div className="w-full flex items-center flex-col lg:flex-row gap-10">
				<h1 className="font-medium text-4xl bg-[#fead41] px-1 rounded-lg">Como Funciona</h1>
				<h3 className="text-lg">
					Entenda o passo a passo de como participar do Conecta Ampère <br />
					Em poucos minutos você já está pronto para começar !
				</h3>
			</div>
			<div className="w-full flex flex-col gap-10">
				<div className="w-full flex flex-col lg:flex-row items-center gap-10">
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#f3f3f3]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-[#fead41] text-2xl px-1 rounded-lg w-fit">Cadastre-se na</h1>
								<h1 className="bg-[#fead41] text-2xl px-1 rounded-lg w-fit">Plataforma</h1>
							</div>

							<h3 className="text-xs">Faça seu cadastro rápido com algumas informações básicas.</h3>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground text-lg">1º</div>
								<h1 className="text-xl">Passo</h1>
							</div>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={SignUpIllustration} fill={true} alt="Cadastre-se na Plataforma" />
						</div>
					</div>
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#fead41]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">Faça sua primeira</h1>
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">Indicação</h1>
							</div>

							<h3 className="text-xs">Preencha o nome, telefone e a cidade da pessoa que deseja indicar e pronto.</h3>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full flex items-center justify-center h-10 w-10 bg-white text-black text-lg">2º</div>
								<h1 className="text-xl">Passo</h1>
							</div>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={ReferIllustration} fill={true} alt="Faça sua primeira Indicação" />
						</div>
					</div>
				</div>
				<div className="w-full flex flex-col lg:flex-row items-center gap-10">
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#15599a]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">Receba créditos</h1>
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">em Vendas Concluídas</h1>
							</div>
							<h3 className="text-xs text-white">Você será notificado através do seu Email ou Whatsapp com os créditos obtidos.</h3>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full flex items-center justify-center h-10 w-10 bg-white text-black text-lg">3º</div>
								<h1 className="text-xl text-white">Passo</h1>
							</div>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={BussinessDealIllustration} fill={true} alt="Receba créditos em Vendas Concluídas" />
						</div>
					</div>
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#f3f3f3]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-[#15599a] text-2xl px-1 rounded-lg w-fit text-white">Resgate prêmios com</h1>
								<h1 className="bg-[#15599a] text-2xl px-1 rounded-lg w-fit text-white">Créditos Ampère</h1>
							</div>

							<h3 className="text-xs">Utilize os Créditos Ampère para resgatar prêmios do Indique e Ganhe.</h3>
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-full flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground text-lg">4º</div>
								<h1 className="text-xl">Passo</h1>
							</div>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={RedeemCreditsIllustration} fill={true} alt="Resgate prêmios com Créditos Ampère" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default HowItWorks;
