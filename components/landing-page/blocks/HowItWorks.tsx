import Image from "next/image";
import React from "react";
import SignUpIllustration from "@/assets/landing-page/illustration-signup.svg";
import ReferIllustration from "@/assets/landing-page/illustration-refer.svg";
import BussinessDealIllustration from "@/assets/landing-page/illustration-business-deal.svg";
import RedeemCreditsIllustration from "@/assets/landing-page/illustration-redeem-credits.svg";
import { UserPlus, Send, Gift, Trophy } from "lucide-react";
function HowItWorks() {
	return (
		<section id="como-funciona" className="bg-gray-50">
			<div className="container mx-auto px-4 relative flex flex-col items-center justify-center">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-800 mb-4">
						Como Funciona o <strong className="text-[#fead41]">Conecta Ampère</strong> ?
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Entenda o passo a passo de como participar do Conecta Ampère <br />
						Em poucos minutos você já está pronto para começar !
					</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
					{/* Passo 1 */}
					<div className="group flex flex-col relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15599a] to-[#1e6bb8] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />

						<div className="relative z-10 flex flex-col grow">
							<div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
								<UserPlus className="w-8 h-8 text-[#15599a]" />
							</div>

							<div className="flex flex-col space-y-4 grow">
								<h3 className="text-2xl font-bold text-white">
									Cadastre-se na <span className="text-[#fead41]">Plataforma</span>
								</h3>

								<div className="w-full flex flex-col gap-2 grow">
									<h4 className="text-lg font-semibold text-[#fead41]">Preencha seus dados de nome, email e telefone, seu estado e cidade.</h4>

									<p className="text-white/90 leading-relaxed">É rápido e fácil, você já está pronto para começar !</p>
								</div>

								<div className="pt-2">
									<span className="inline-block bg-[#fead41] text-[#15599a] px-4 py-2 rounded-full font-semibold text-sm">Passo Nº1</span>
								</div>
							</div>
						</div>
					</div>

					{/* Passo 2 */}
					<div className="group flex flex-col relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fead41] to-[#ffb84d] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />

						<div className="relative z-10 flex flex-col grow">
							<div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
								<Send className="w-8 h-8 text-[#15599a]" />
							</div>

							<div className="flex flex-col space-y-4 grow">
								<h3 className="text-2xl font-bold text-white">
									Faça sua primeira <span className="text-[#15599a]">Indicação</span>
								</h3>

								<div className="w-full flex flex-col gap-2 grow">
									<h4 className="text-lg font-semibold text-[#15599a]">Preencha o nome, telefone e a cidade da pessoa que deseja indicar e pronto.</h4>

									<p className="text-white/90 leading-relaxed">Um dos nossos vendedores receberá sua indicação e entrará o mais rápido possível com o seu indicado.</p>
								</div>
								<div className="pt-2">
									<span className="inline-block bg-[#15599a] text-white px-4 py-2 rounded-full font-semibold text-sm">Passo Nº2</span>
								</div>
							</div>
						</div>
					</div>

					{/* Passo 3 */}
					<div className="group flex flex-col relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fead41] to-[#ffb84d] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />

						<div className="relative z-10 flex flex-col grow">
							<div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
								<Gift className="w-8 h-8 text-[#15599a]" />
							</div>

							<div className="flex flex-col space-y-4 grow">
								<h3 className="text-2xl font-bold text-white">
									Receba créditos <span className="text-[#15599a]">em Vendas Concluídas</span>
								</h3>
								<div className="w-full flex flex-col gap-2 grow">
									<h4 className="text-lg font-semibold text-[#15599a]">Você será notificado através do seu Email ou Whatsapp com os créditos obtidos.</h4>
									<p className="text-white/90 leading-relaxed">
										A cada venda concluída você receberá créditos proporcionais ao valor da venda, você pode resgatar os créditos obtidos em prêmios, como brindes, cupons de desconto, entre
										outros.
									</p>
								</div>

								<div className="pt-2">
									<span className="inline-block bg-[#15599a] text-white px-4 py-2 rounded-full font-semibold text-sm">Passo Nº3</span>
								</div>
							</div>
						</div>
					</div>

					{/* Passo 4 */}
					<div className="group flex flex-col relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15599a] to-[#1e6bb8] p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
						<div className="relative z-10 flex flex-col grow">
							<div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
								<Trophy className="w-8 h-8 text-[#15599a]" />
							</div>

							<div className="flex flex-col space-y-4 grow">
								<h3 className="text-2xl font-bold text-white">
									Resgate prêmios com <span className="text-[#fead41]">Créditos Ampère</span>
								</h3>

								<div className="w-full flex flex-col gap-2 grow">
									<h4 className="text-lg font-semibold text-[#fead41]">Utilize os Créditos Ampère para resgatar prêmios do Indique e Ganhe.</h4>

									<p className="text-white/90 leading-relaxed">Você pode resgatar os créditos obtidos em prêmios, como brindes, cupons de desconto, entre outros.</p>
								</div>

								<div className="pt-2">
									<span className="inline-block bg-[#fead41] text-[#15599a] px-4 py-2 rounded-full font-semibold text-sm">Passo Nº4</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default HowItWorks;
