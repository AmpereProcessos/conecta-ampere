import Link from "next/link";
import React from "react";
import AmpereVerticalBlueLogo from "@/assets/svgs/ampere-vertical-blue-logo-icon-text.svg";
import Image from "next/image";
import AboutUsBackgroundDesktop from "@/assets/landing-page/about-us-background-desktop.png";
import AboutUsBackgroundMobile from "@/assets/landing-page/about-us-background-mobile.png";

function AboutUs() {
	return (
		<section id="sobre-nos" className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-gray-100 py-20">
			{/* Imagem de fundo responsiva */}
			<Image src={AboutUsBackgroundDesktop} alt="Energia Solar" fill priority={true} className="hidden lg:block" />
			<Image src={AboutUsBackgroundMobile} alt="Energia Solar" fill priority={true} className="block lg:hidden" />

			{/* Degradê inferior para mobile */}
			<div
				className="lg:hidden block absolute bottom-0 left-0 w-full h-1/2 z-10 pointer-events-none"
				style={{ background: "linear-gradient(0deg, rgba(21,89,154,0.95) 70%, rgba(21,89,154,0.0) 100%)" }}
			/>

			{/* Desktop */}
			<div className="container mx-auto px-4 relative z-20 min-h-[50vh] flex flex-col lg:items-start items-center justify-center gap-8">
				{/* Mobile: conteúdo resumido e posicionado no degradê inferior */}
				<div className="lg:hidden absolute bottom-0 left-0 w-full z-20 px-4 flex flex-col items-center text-center gap-3">
					<h2 className="text-3xl font-bold text-white drop-shadow-lg">Sobre Nós</h2>
					<p className="text-base text-white/90 drop-shadow">A Ampère Energias nasceu no Triângulo Mineiro para levar energia solar de qualidade e economia para milhares de pessoas.</p>
					<h3 className="text-lg font-bold text-white drop-shadow-lg">
						A energia que move o mundo <br />
						<strong className="text-[#fead41]">vem de você!</strong>
					</h3>
					<Link href={"/signup"} className="bg-[#fead41] hover:bg-[#fead41]/90 text-[#15599a] w-full max-w-xs px-6 py-3 rounded-full font-bold shadow-lg transition-colors mt-2">
						ENTRE EM CONTATO
					</Link>
				</div>

				{/* Desktop: conteúdo completo, alinhado à esquerda */}
				<div className="hidden lg:flex flex-col gap-4 max-w-xl items-start text-left">
					<h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Sobre Nós</h2>
					<p className="text-lg text-white/90 max-w-2xl drop-shadow">Conheça um pouco sobre nós, a Ampère Energias, e como trabalhamos para contribuir para a Transição Energética.</p>
					<h3 className="text-2xl font-bold text-white mt-6 drop-shadow-lg">
						A Energia que move o Mundo <br />
						<strong className="text-[#fead41]">vem de você!</strong>
					</h3>
					<p className="text-lg text-white/90 drop-shadow">
						A Ampère Energias é uma empresa que nasceu no Triângulo Mineiro, com a missão de ser a melhor empresa de soluções em energia do Brasil.
						<br />
						Oferecemos soluções completas e com qualidade para os nossos clientes, levando economia e qualidade, com praticidade e facilidade.
					</p>
					<Link href={"/signup"} className="bg-[#fead41] hover:bg-[#fead41]/90 text-[#15599a] w-fit px-6 py-3 rounded-full font-bold shadow-lg transition-colors mt-4">
						ENTRE EM CONTATO CONOSCO
					</Link>
				</div>
			</div>
		</section>
	);
}

export default AboutUs;
