import Image from "next/image";
import type React from "react";
import { UserPlus, Send, Gift, Trophy } from "lucide-react";

interface HowItWorksStepProps {
	icon: React.ReactNode;
	title: React.ReactNode;
	subtitle: string;
	description: string;
	badge: { text: string; className: string };
	bgClass: string;
	textClass: string;
	subtitleClass: string;
}

const steps: HowItWorksStepProps[] = [
	{
		icon: <UserPlus className="w-8 h-8 text-[#15599a]" aria-hidden="true" />,
		title: (
			<>
				Cadastre-se na <span className="text-[#fead41]">Plataforma</span>
			</>
		),
		subtitle: "Preencha seus dados de nome, email e telefone, seu estado e cidade.",
		description: "É rápido e fácil, você já está pronto para começar !",
		badge: { text: "Passo Nº1", className: "bg-[#fead41] text-[#15599a]" },
		bgClass: "from-[#15599a] to-[#1e6bb8]",
		textClass: "text-white",
		subtitleClass: "text-[#fead41]",
	},
	{
		icon: <Send className="w-8 h-8 text-[#15599a]" aria-hidden="true" />,
		title: (
			<>
				Faça sua primeira <span className="text-[#15599a]">Indicação</span>
			</>
		),
		subtitle: "Preencha o nome, telefone e a cidade da pessoa que deseja indicar e pronto.",
		description: "Um dos nossos vendedores receberá sua indicação e entrará o mais rápido possível com o seu indicado.",
		badge: { text: "Passo Nº2", className: "bg-[#15599a] text-white" },
		bgClass: "from-[#fead41] to-[#ffb84d]",
		textClass: "text-white",
		subtitleClass: "text-[#15599a]",
	},
	{
		icon: <Gift className="w-8 h-8 text-[#15599a]" aria-hidden="true" />,
		title: (
			<>
				Receba créditos <span className="text-[#15599a]">em Vendas Concluídas</span>
			</>
		),
		subtitle: "Você será notificado através do seu Email ou Whatsapp com os créditos obtidos.",
		description:
			"A cada venda concluída você receberá créditos proporcionais ao valor da venda, você pode resgatar os créditos obtidos em prêmios, como brindes, cupons de desconto, entre outros.",
		badge: { text: "Passo Nº3", className: "bg-[#15599a] text-white" },
		bgClass: "from-[#fead41] to-[#ffb84d]",
		textClass: "text-white",
		subtitleClass: "text-[#15599a]",
	},
	{
		icon: <Trophy className="w-8 h-8 text-[#15599a]" aria-hidden="true" />,
		title: (
			<>
				Resgate prêmios com <span className="text-[#fead41]">Créditos Ampère</span>
			</>
		),
		subtitle: "Utilize os Créditos Ampère para resgatar prêmios do Indique e Ganhe.",
		description: "Você pode resgatar os créditos obtidos em prêmios, como brindes, cupons de desconto, entre outros.",
		badge: { text: "Passo Nº4", className: "bg-[#fead41] text-[#15599a]" },
		bgClass: "from-[#15599a] to-[#1e6bb8]",
		textClass: "text-white",
		subtitleClass: "text-[#fead41]",
	},
];

function HowItWorksStep({ icon, title, subtitle, description, badge, bgClass, textClass, subtitleClass }: HowItWorksStepProps) {
	return (
		<div className={`group flex flex-col relative overflow-hidden rounded-2xl bg-linear-to-br ${bgClass} p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
			<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
			<div className="relative z-10 flex flex-col grow">
				<div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
				<div className={`flex flex-col space-y-4 grow ${textClass}`}>
					<h3 className={`text-2xl font-bold ${textClass}`}>{title}</h3>
					<div className="w-full flex flex-col gap-2 grow">
						<h4 className={`text-lg font-semibold ${subtitleClass}`}>{subtitle}</h4>
						<p className="text-white/90 leading-relaxed">{description}</p>
					</div>
					<div className="pt-2">
						<span className={`inline-block ${badge.className} px-4 py-2 rounded-full font-semibold text-sm`}>{badge.text}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function HowItWorks() {
	return (
		<section id="como-funciona" className="bg-gray-50 py-20">
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
					{steps.map((step) => (
						<HowItWorksStep key={step.badge.text + String(step.title)} {...step} />
					))}
				</div>
			</div>
		</section>
	);
}

export default HowItWorks;
