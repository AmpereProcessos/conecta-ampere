import Link from "next/link";
import React from "react";
import AmpereVerticalBlueLogo from "@/assets/svgs/ampere-vertical-blue-logo-icon-text.svg";
import Image from "next/image";
function AboutUs() {
	return (
		<div id="sobre-nos" className="px-6 lg:px-24 flex flex-col gap-20 w-full">
			<div className="w-full flex items-center flex-col lg:flex-row gap-10">
				<h1 className="font-medium text-4xl bg-[#15599a] px-1 rounded-lg text-white">Sobre Nós</h1>
				<h3 className="text-lg">Conheça um pouco sobre nós, a Ampère Energias, e como trabalhamos para contribuir para Transição Energética.</h3>
			</div>
			<div className="flex items-center justify-between flex-col lg:flex-row px-8 lg:px-16 py-16 bg-[#f3f3f3]">
				<div className="flex flex-col gap-6 max-w-[46rem]">
					<h1 className="font-medium text-2xl">
						A Energia que move o Mundo <br />
						vem de você !
					</h1>
					<p className="text-lg">
						A Ampère Energias é uma empresa que nasceu no Triangulo Mineiro, com a missão de ser a melhor empresa de soluções em energia do Brasil. <br />
						Oferecemos soluções completas e com qualidade para os nossos clientes, levando economia e qualidade, com praticidade e facilidade.
					</p>
					<Link href={"/signup"} className="bg-[#15599a] hover:bg-[#15599a]/90 text-white w-fit p-3 rounded-lg font-bold">
						ENTRE EM CONTATO CONOSCO
					</Link>
				</div>
				<div className="w-[16rem] h-[16rem] relative">
					<Image src={AmpereVerticalBlueLogo} alt="Logo da Ampère" fill={true} />
				</div>
			</div>
		</div>
	);
}

export default AboutUs;
