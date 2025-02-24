import React from "react";
import LogoIcon from "@/assets/svgs/ampere-blue-logo-icon.svg";
import Image from "next/image";
import Link from "next/link";
function NevegationMenu() {
	return (
		<div className="w-full flex items-center justify-between lg:px-24 px-6">
			<div className="flex items-center gap-2">
				<div className="min-w-8 min-h-8 w-8 h-8 lg:w-12 lg:h-12 relative">
					<Image src={LogoIcon} fill={true} alt="Logo da Conecta Ampère" />
				</div>
				<h1 className="font-bold text-xs lg:text-lg">Conecta Ampère</h1>
			</div>
			<div className="flex items-center gap-10">
				<a href="#como-funciona" className="text-lg hidden lg:block">
					Como Funciona
				</a>
				<a href="#sobre-nos" className="text-lg hidden lg:block">
					Sobre Nós
				</a>
				<a href="#nossos-servicos" className="text-lg hidden lg:block">
					Nossos Serviços
				</a>
				<Link href={"/signup"} className="bg-white border border-black text-black px-2 py-3 rounded-lg text-xs lg:text-lg">
					Criar sua Conta
				</Link>
			</div>
		</div>
	);
}

export default NevegationMenu;
