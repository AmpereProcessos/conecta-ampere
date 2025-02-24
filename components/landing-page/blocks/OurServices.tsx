import Image from "next/image";
import React from "react";

import PhotovoltaicSystems from "@/assets/landing-page/illustration-solar-energy.svg";
import Maintenance from "@/assets/landing-page/illustration-maintenance.svg";
import EnergyDiscount from "@/assets/landing-page/illustration-money-motivation.svg";
import SolarInsurance from "@/assets/landing-page/illustration-insurance.svg";

function OurServices() {
	return (
		<div id="nossos-servicos" className="px-6 lg:px-24 flex flex-col gap-20 w-full">
			<div className="w-full flex items-center flex-col lg:flex-row gap-10">
				<h1 className="font-medium text-4xl bg-[#fead41] px-1 rounded-lg">Nossos Serviços</h1>
				<h3 className="text-lg">Conheça um pouco sobre a variedade de serviços que oferecemos aos nossos clientes.</h3>
			</div>
			<div className="w-full flex flex-col gap-10">
				<div className="w-full flex flex-col lg:flex-row items-center gap-10">
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#f3f3f3]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-[#fead41] text-2xl px-1 rounded-lg w-fit">Sistemas</h1>
								<h1 className="bg-[#fead41] text-2xl px-1 rounded-lg w-fit">Fotovoltaicos</h1>
							</div>
							<h3 className="text-xs">
								Prestamos serviços completos como integradores de sistemas fotovoltaicos, com homologação, projeto e instalação. <br />A Ampère conta com mais de 1500 sistemas
								fotovoltaicos comercializados na região, sendo uma das maiores integradoras de Minas Gerais
							</h3>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={PhotovoltaicSystems} fill={true} alt="Sistemas Fotovoltaicos" />
						</div>
					</div>
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#fead41]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">Manutenção</h1>
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">Solar</h1>
							</div>
							<h3 className="text-xs">
								Realizamos inspeções detalhadas, limpeza de painéis e verificação de componentes, prevenindo falhas e aumentando a vida útil do seu investimento em energia solar, prezando
								pelo desempenho máximo do seu sistema fotovoltaico.
							</h3>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={Maintenance} fill={true} alt="Manutenção Solar" />
						</div>
					</div>
				</div>
				<div className="w-full flex flex-col lg:flex-row items-center gap-10">
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#15599a]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">Desconto</h1>
								<h1 className="bg-white text-2xl text-black px-1 rounded-lg w-fit">em Energia</h1>
							</div>

							<h3 className="text-xs text-white">
								Nosso programa de desconto conecta você a fazendas solares, garantindo economia mensal significativa e tarifa reduzida, sem necessidade de instalação de painéis ou
								modificações em sua residência.
							</h3>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={EnergyDiscount} fill={true} alt="Desconto em Energia" />
						</div>
					</div>
					<div className="flex items-center justify-between rounded-xl px-6 lg:px-12 py-12 w-full lg:w-1/2 flex-col lg:flex-row gap-10 border border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] h-full bg-[#f3f3f3]">
						<div className="flex flex-col grow h-full justify-between gap-5">
							<div className="flex flex-col">
								<h1 className="bg-[#15599a] text-2xl px-1 rounded-lg w-fit text-white">Seguro</h1>
								<h1 className="bg-[#15599a] text-2xl px-1 rounded-lg w-fit text-white">Solar</h1>
							</div>

							<h3 className="text-xs">
								Com o seguro você se protege contra danos físicos, falhas elétricas e eventos climáticos extremos. <br />
								Nosso seguro solar oferece cobertura completa e atendimento prioritário proporcionando tranquilidade e segurança para seu investimento em energia limpa.
							</h3>
						</div>
						<div className="relative w-[12.5rem] h-[12.5rem] min-w-[12.5rem] min-h-[12.5rem]">
							<Image src={SolarInsurance} fill={true} alt="Seguro Solar" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OurServices;
