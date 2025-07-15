import Image from "next/image";
import React from "react";

import PhotovoltaicSystems from "@/assets/landing-page/illustration-solar-energy.svg";
import Maintenance from "@/assets/landing-page/illustration-maintenance.svg";
import EnergyDiscount from "@/assets/landing-page/illustration-money-motivation.svg";
import SolarInsurance from "@/assets/landing-page/illustration-insurance.svg";

const services = [
	{
		title: ["Sistemas", "Fotovoltaicos"],
		text:
			"Prestamos serviços completos como integradores de sistemas fotovoltaicos, com homologação, projeto e instalação. A Ampère conta com mais de 1500 sistemas fotovoltaicos comercializados na região, sendo uma das maiores integradoras de Minas Gerais",
		image: PhotovoltaicSystems,
		alt: "Sistemas Fotovoltaicos",
		color: "from-[#15599a] to-[#1e6bb8]",
		badge: "bg-[#fead41] text-[#15599a]",
		textColor: "text-white",
		id: "sistemas-fotovoltaicos",
	},
	{
		title: ["Manutenção", "Solar"],
		text:
			"Realizamos inspeções detalhadas, limpeza de painéis e verificação de componentes, prevenindo falhas e aumentando a vida útil do seu investimento em energia solar, prezando pelo desempenho máximo do seu sistema fotovoltaico.",
		image: Maintenance,
		alt: "Manutenção Solar",
		color: "from-[#fead41] to-[#ffb84d]",
		badge: "bg-white text-[#15599a]",
		textColor: "text-[#15599a]",
		id: "manutencao-solar",
	},
	{
		title: ["Desconto", "em Energia"],
		text:
			"Nosso programa de desconto conecta você a fazendas solares, garantindo economia mensal significativa e tarifa reduzida, sem necessidade de instalação de painéis ou modificações em sua residência.",
		image: EnergyDiscount,
		alt: "Desconto em Energia",
		color: "from-[#fead41] to-[#ffb84d]",
		badge: "bg-white text-[#15599a]",
		textColor: "text-[#15599a]",
		id: "desconto-energia",
	},
	{
		title: ["Seguro", "Solar"],
		text:
			"Com o seguro você se protege contra danos físicos, falhas elétricas e eventos climáticos extremos. Nosso seguro solar oferece cobertura completa e atendimento prioritário proporcionando tranquilidade e segurança para seu investimento em energia limpa.",
		image: SolarInsurance,
		alt: "Seguro Solar",
		color: "from-[#15599a] to-[#1e6bb8]",
		badge: "bg-[#fead41] text-[#15599a]",
		textColor: "text-white",
		id: "seguro-solar",
	},
];

function OurServices() {
	return (
		<section id="nossos-servicos" className="bg-gray-50 py-20">
			<div className="container mx-auto px-4 flex flex-col items-center justify-center">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-800 mb-4">
						Nossos <span className="text-[#fead41]">Serviços</span>
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">Conheça um pouco sobre a variedade de serviços que oferecemos aos nossos clientes.</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
					{services.map((service) => (
						<div
							key={service.id}
							className={`group flex flex-col relative overflow-hidden rounded-2xl bg-gradient-to-br ${service.color} p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 min-h-[22rem]`}
						>
							<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
							<div className="relative z-10 flex flex-col grow h-full">
								<div className="flex flex-col gap-1 mb-4">
									{service.title.map((t, i) => (
										<span key={`${service.id}-badge-${t}`} className={`text-2xl font-bold px-3 py-1 rounded-lg w-fit mb-1 ${service.badge}`}>
											{t}
										</span>
									))}
								</div>
								<p className={`mb-6 ${service.textColor}`}>{service.text}</p>
								<div className="flex justify-center items-end grow">
									<div className="relative w-40 h-40">
										<Image src={service.image} fill alt={service.alt} className="object-contain" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default OurServices;
