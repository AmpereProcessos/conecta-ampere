import { LayoutDashboard } from "lucide-react";
import React from "react";
import { BsWhatsapp } from "react-icons/bs";

function UserProjects() {
	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutDashboard className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">MEUS PROJETOS</h1>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center grow py-3 px-6 gap-1.5">
				<h3 className="text-xs lg:text-base font-semibold tracking-tight">Aparentemente você não possui nenhum projeto conosco :(</h3>
				<a
					href="google.com"
					className="py-2 px-4 transition-colors w-fit flex rounded-lg items-center gap-1 bg-[#15599a] text-white hover:bg-blue-800 dark:bg-blue-400 dark:hover:bg-blue-500"
				>
					<BsWhatsapp size={15} />
					<p className="text-[0.45rem] lg:text-xs font-extrabold">CONTATAR CONSULTOR DE VENDAS</p>
				</a>
			</div>
		</div>
	);
}

export default UserProjects;
