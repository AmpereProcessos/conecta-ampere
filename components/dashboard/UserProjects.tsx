'use client';
import { Diamond, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { BsCalendarCheck, BsCalendarPlus, BsWhatsapp } from 'react-icons/bs';
import type { TGetProjectsRouteOutput } from '@/app/api/projects/route';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatDateAsLocale } from '@/lib/methods/formatting';
import { getProjectTypeCollors } from '@/lib/methods/utils';
import { useProjectsQuery } from '@/lib/queries/projects';
import { cn } from '@/lib/utils';
import ErrorComponent from '../layout/ErrorComponent';
import { Button } from '../ui/button';

function UserProjects() {
	const { data: projects, isLoading, isError, isSuccess, error } = useProjectsQuery();
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutDashboard className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MEUS PROJETOS</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-6 py-3">
				{isLoading ? <h3 className="animate-pulse font-semibold text-xs tracking-tight lg:text-base">Buscando projetos...</h3> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					projects.length > 0 ? (
						projects.map((project) => <UserProjectCard key={project.id} project={project} />)
					) : (
						<>
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
						</>
					)
				) : null}
			</div>
		</div>
	);
}

export default UserProjects;

type UserProjectCardProps = {
	project: TGetProjectsRouteOutput['data'][number];
};
function UserProjectCard({ project }: UserProjectCardProps) {
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-md border border-primary/20 bg-white p-2.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="font-semibold text-[0.625rem] leading-none tracking-tight lg:text-xs">{project.nome}</h1>
					<div
						className={cn('flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-center font-bold text-[0.65rem] text-primary/80 italic', getProjectTypeCollors(project.tipo))}
					>
						<Diamond size={12} />
						<p>{project.tipo}</p>
					</div>
				</div>
				<h3
					className={cn('rounded-full bg-red-500 p-1 font-extrabold text-[0.55rem] text-white', {
						'bg-orange-500 text-white': project.status === 'PENDENTE',
						'bg-blue-500 text-white': project.status === 'EM ANDAMENTO',
						'bg-green-500 text-white': project.status === 'CONCLUÍDO',
					})}
				>
					{project.status}
				</h3>
			</div>
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-1.5">
						<BsCalendarPlus className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
						<h1 className="font-semibold text-[0.6rem] leading-none tracking-tight">INICIADO EM: {formatDateAsLocale(project.inicio)}</h1>
					</div>
					{project.fim ? (
						<div className="flex items-center gap-1.5">
							<BsCalendarCheck className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
							<h1 className="font-semibold text-[0.6rem] leading-none tracking-tight">CONCLUÍDO EM: {formatDateAsLocale(project.fim)}</h1>
						</div>
					) : null}
				</div>
				<Button asChild className="text-xs" size={'fit'} variant={'link'}>
					<Link href={`/projects/id/${project.id}`}>VER JORNADA</Link>
				</Button>
			</div>
		</div>
	);
}
