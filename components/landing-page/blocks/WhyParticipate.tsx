import { CheckCircle, Users, Star } from "lucide-react";
import React from "react";

function WhyParticipate() {
	return (
		<section id="por-que-participar" className="relative w-full bg-gradient-to-br from-[#1e6bb8] via-[#2575c7] to-[#15599a] py-20 overflow-hidden">
			{/* Elementos de fundo */}
			<div className="absolute top-0 left-0 w-72 h-72 bg-[#fead41]/10 rounded-full -translate-y-32 -translate-x-32" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-y-32 translate-x-32" />

			<div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
				<h2 className="text-4xl font-bold text-white mb-6 text-center">
					Por que participar do <span className="text-[#fead41]">Conecta Ampère?</span>
				</h2>
				<p className="text-xl text-white/90 max-w-2xl text-center mb-10">
					Indicar a Ampère Energias nunca foi tão vantajoso.
					<br />
					Com o Conecta Ampère, você transforma sua rede de contatos em uma fonte de renda extra — indicando um serviço confiável, com mais de 3.000 clientes atendidos e quase uma
					década de experiência no mercado de energia solar.
					<br />
					Além de contribuir com o crescimento da energia limpa no Brasil, você é recompensado por cada indicação convertida.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 max-w-4xl w-full">
					<div className="flex flex-col items-center text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
						<Users className="w-10 h-10 text-[#fead41] mb-3" />
						<span className="text-lg font-semibold text-white">+3.000 clientes atendidos</span>
						<p className="text-white/80 text-sm mt-2">Rede sólida e serviço comprovado no mercado.</p>
					</div>
					<div className="flex flex-col items-center text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
						<Star className="w-10 h-10 text-[#fead41] mb-3" />
						<span className="text-lg font-semibold text-white">Quase 10 anos de experiência</span>
						<p className="text-white/80 text-sm mt-2">Confiança de quem entende do setor de energia solar.</p>
					</div>
					<div className="flex flex-col items-center text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
						<CheckCircle className="w-10 h-10 text-[#fead41] mb-3" />
						<span className="text-lg font-semibold text-white">Ganhos e impacto positivo</span>
						<p className="text-white/80 text-sm mt-2">Receba por cada indicação convertida e ajude a expandir a energia limpa no Brasil.</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default WhyParticipate;
