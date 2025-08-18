'use client';
import { LayoutDashboard, UsersRound } from 'lucide-react';
import { BsCalendarPlus } from 'react-icons/bs';
import type { TGetIndicationsRouteOutputDataDefault } from '@/app/api/indications/route';
import ErrorComponent from '@/components/layout/ErrorComponent';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatDateAsLocale } from '@/lib/methods/formatting';
import { useIndicationsQuery } from '@/lib/queries/indications';

function UserIndications() {
	const { data: indications, isLoading, isError, isSuccess, error } = useIndicationsQuery();

	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UsersRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MINHAS INDICAÇÕES</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				{isLoading ? <h3 className="animate-pulse font-semibold text-xs tracking-tight lg:text-base">Buscando indicações...</h3> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					indications.length > 0 ? (
						indications.map((indication) => <UserIndicationCard indication={indication} key={indication._id} />)
					) : (
						<h3 className="font-semibold text-xs tracking-tight lg:text-base">Você ainda não possui nenhuma indicação :(</h3>
					)
				) : null}
			</div>
		</div>
	);
}

export default UserIndications;

type UserIndicationCardProps = {
	indication: TGetIndicationsRouteOutputDataDefault[number];
};
function UserIndicationCard({ indication }: UserIndicationCardProps) {
	function getIndicationStatusTag() {
		if (indication.oportunidade.dataGanho) {
			return <h1 className="rounded-full bg-green-500 p-1 font-extrabold text-[0.5rem] text-white">VENDA CONCLÚIDA</h1>;
		}
		if (indication.oportunidade.dataPerda) {
			return <h1 className="rounded-full bg-red-500 p-1 font-extrabold text-[0.5rem] text-white">VENDA PERDIDA</h1>;
		}
		if (indication.oportunidade.dataInteracao) {
			return <h1 className="rounded-full bg-blue-500 p-1 font-extrabold text-[0.5rem] text-white">EM ANDAMENTO</h1>;
		}
		return <h1 className="rounded-full bg-[#F97316] p-1 font-extrabold text-[0.5rem] text-white">PENDENTE</h1>;
	}
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-md border border-primary/20 bg-white p-2.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="rounded-xs bg-[#15599a] p-1 font-bold text-[0.5rem] text-white leading-none tracking-tight lg:text-[0.625rem]">{indication.oportunidade.identificador}</h1>
					<h1 className="font-semibold text-[0.625rem] leading-none tracking-tight lg:text-xs">{indication.oportunidade.nome}</h1>
				</div>
				{getIndicationStatusTag()}
			</div>
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutDashboard className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
					<h1 className="font-semibold text-[0.5rem] leading-none tracking-tight">{indication.tipo.titulo}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<BsCalendarPlus className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
					<h1 className="font-semibold text-[0.5rem] leading-none tracking-tight">{formatDateAsLocale(indication.dataInsercao, true)}</h1>
				</div>
			</div>
		</div>
	);
}
