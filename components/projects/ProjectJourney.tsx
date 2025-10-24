import { BadgeDollarSign, Code, Key, LayoutGrid, MapPin, Route, User, UserRound, Zap } from 'lucide-react';
import { BsCalendar, BsCalendarCheck } from 'react-icons/bs';
import { formatDateAsLocale, formatDecimalPlaces, formatLocation, formatToMoney } from '@/lib/methods/formatting';
import { renderIconWithClassNames } from '@/lib/methods/rendering';
import { getJourneyStepMetadata } from '@/lib/projects';
import type { TGetProjectJourneyByIdOutput } from '@/lib/queries-server/projects';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type ProjectJourneyProps = {
	project: TGetProjectJourneyByIdOutput;
};
export default function ProjectJourney({ project }: ProjectJourneyProps) {
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutGrid className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MEU PROJETO</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				<div className="flex w-full flex-col gap-3">
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<div className="flex items-center gap-1.5">
							<div className="flex items-center gap-1 rounded-lg bg-[#15599a] px-2 py-1 font-bold text-[0.625rem] text-white leading-none tracking-tight lg:text-xs">
								<Code className="h-3 min-h-3 w-3 min-w-3 lg:h-4 lg:w-4" />
								{project.indexador}
							</div>

							<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">{project.nome}</h1>
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
					<div className="flex w-full flex-col gap-1.5">
						<h1 className="font-bold text-sm leading-none tracking-tight">INFORMAÇÕES GERAIS</h1>
						<div className="flex w-full items-center gap-1.5">
							<LayoutGrid className="h-4 w-4" />
							<h3 className="font-semibold text-xs tracking-tight">NOME DO CONTRATO: {project.nome}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<MapPin className="h-4 w-4" />
							<h3 className="font-semibold text-xs tracking-tight">
								LOCALIZAÇÃO:{' '}
								{formatLocation({
									location: project.localizacao,
									includeUf: true,
									includeCity: true,
								})}
							</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<Zap className="h-4 w-4" />
							<h3 className="font-semibold text-xs tracking-tight">POTÊNCIA: {formatDecimalPlaces(project.potencia)}kWp</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<BadgeDollarSign className="h-4 w-4" />
							<h3 className="font-semibold text-xs tracking-tight">VALOR: {formatToMoney(project.valor)}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<UserRound className="h-4 w-4" />
							<div className="flex items-center gap-1.5 font-semibold text-xs tracking-tight">
								VENDEDOR:{' '}
								<Avatar className="h-5 w-5">
									<AvatarImage src={project.vendedor.avatar_url || undefined} />
									<AvatarFallback className="text-xs">CN</AvatarFallback>
								</Avatar>{' '}
								{project.vendedor.nome}
							</div>
						</div>
					</div>
					{project.app.data ? (
						<div className="flex w-full flex-col gap-1.5">
							<h1 className="font-bold text-sm leading-none tracking-tight">INFORMAÇÕES DO APLICATIVO DE MONITORAMENTO</h1>
							<div className="flex w-full items-center gap-1.5">
								<User className="h-4 w-4" />
								<h3 className="font-semibold text-xs tracking-tight">LOGIN: {project.app.login}</h3>
							</div>
							<div className="flex w-full items-center gap-1.5">
								<Key className="h-4 w-4" />
								<h3 className="font-semibold text-xs tracking-tight">SENHA: {project.app.senha}</h3>
							</div>
						</div>
					) : null}
				</div>
				<div className="flex w-full flex-col gap-3">
					<div className="flex w-full items-center justify-start gap-1.5">
						<Route className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
						<h1 className="font-bold text-sm leading-none tracking-tight">JORNADA</h1>
					</div>
					{project.jornada.map((jornada) => (
						<ProjectJourneyStep key={jornada.id} step={jornada} />
					))}
				</div>
			</div>
		</div>
	);
}

function ProjectJourneyStep({ step }: { step: TGetProjectJourneyByIdOutput['jornada'][number] }) {
	const stepMetadata = getJourneyStepMetadata(step.id);
	if (!stepMetadata) return null;

	return (
		<div className="flex w-full flex-col gap-3 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs md:flex-row dark:bg-[#121212]">
			<div className="flex items-center justify-center">
				<div
					className={cn('flex h-10 w-10 items-center justify-center rounded-full', {
						'bg-green-500 text-white': !!step.date,
						'bg-primary/30 text-primary': !step.date,
					})}
				>
					{renderIconWithClassNames(stepMetadata.icon)}
				</div>
			</div>
			<div className="flex flex-col gap-1.5">
				<h1 className="font-bold text-sm leading-none tracking-tight">{stepMetadata.title}</h1>
				<p className="text-primary/80 text-xs leading-none">{stepMetadata.description}</p>
				<div
					className={cn('flex w-fit items-center gap-1.5 self-center rounded-lg px-2 py-1 md:self-start', {
						'bg-green-100 text-green-700': step.date,
						'bg-primary/10 text-primary': !step.date,
					})}
				>
					{step.date ? <BsCalendarCheck className="h-4 w-4" /> : <BsCalendar className="h-4 w-4" />}
					<h3 className="font-semibold text-xs tracking-tight">{step.date ? formatDateAsLocale(step.date) : 'Processo ainda não foi concluído.'}</h3>
				</div>
			</div>
		</div>
	);
}
