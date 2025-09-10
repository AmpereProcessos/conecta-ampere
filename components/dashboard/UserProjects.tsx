import { LayoutDashboard } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';

function UserProjects() {
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutDashboard className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MEUS PROJETOS</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-6 py-3">
				<h3 className="font-semibold text-xs tracking-tight lg:text-base">Aparentemente você não possui nenhum projeto conosco :(</h3>
				<a
					className="flex w-fit items-center gap-1 rounded-lg bg-[#15599a] px-4 py-2 text-white transition-colors hover:bg-blue-800 dark:bg-blue-400 dark:hover:bg-blue-500"
					href="https://api.whatsapp.com/send?phone=553437007001&text=Ol%C3%A1%2C%20gostaria%20de%20adquirir%20um%20projeto%20fotovoltaico"
					rel="noopener noreferrer"
					target="_blank"
				>
					<BsWhatsapp size={15} />
					<p className="font-extrabold text-[0.45rem] lg:text-xs">CONTATAR CONSULTOR DE VENDAS</p>
				</a>
			</div>
		</div>
	);
}

export default UserProjects;
