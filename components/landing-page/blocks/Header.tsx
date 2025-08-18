import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import IndicationProgram from "@/assets/landing-page/indication-program.svg";
import Image from "next/image";
function Header() {
	return (
		<div className="px-6 lg:px-24 flex items-center lg:items-start flex-col lg:flex-row justify-between w-full gap-10 lg:gap-0">
			<div className="flex flex-col gap-8">
				<h1 className="font-medium text-4xl lg:text-6xl">Faça parte do nosso Programa de Indicações</h1>
				<h3 className="text-lg">Potencialize seus ganhos enquanto ajuda amigos e familiares a descobrirem nossos serviços.</h3>
				<Link href={"/signup"} className="bg-[#15599a] hover:bg-[#15599a]/90 text-white w-fit p-3 rounded-lg font-bold">
					COMEÇE A INDICAR
				</Link>
			</div>
			<div className="w-[20rem] lg:w-184 h-60 lg:h-136 relative">
				<Image src={IndicationProgram} alt="Programa de Indicações" fill={true} />
			</div>
		</div>
	);
}

export default Header;
