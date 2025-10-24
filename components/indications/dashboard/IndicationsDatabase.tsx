'use client';
import { useQueryClient } from '@tanstack/react-query';
import { LayoutDashboard, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { BsCalendarPlus } from 'react-icons/bs';
import { FaBolt } from 'react-icons/fa';
import type { TGetIndicationsDatabaseRouteOutput } from '@/app/api/indications/database/route';
import ErrorComponent from '@/components/layout/ErrorComponent';
import { Button } from '@/components/ui/button';
import GeneralPaginationComponent from '@/components/utils/Pagination';
import type { TAuthSession } from '@/lib/authentication/types';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatDateAsLocale } from '@/lib/methods/formatting';
import { useIndicationsDatabaseQuery } from '@/lib/queries/indications';
import NewIndication from '../modals/NewIndication';

type IndicationsDatabaseProps = {
	sessionUser: TAuthSession['user'];
};
function IndicationsDatabase({ sessionUser }: IndicationsDatabaseProps) {
	const queryClient = useQueryClient();
	const [newIndicationMenuIsOpen, setNewIndicationMenuIsOpen] = useState(false);

	const { data: dashboardIndications, isLoading, isError, isSuccess, error, params, updateParams } = useIndicationsDatabaseQuery();

	const handleNewIndicationOnMutate = async () =>
		await queryClient.cancelQueries({
			queryKey: ['indications-database', params],
		});
	const handleNewIndicationOnSettled = async () =>
		await queryClient.invalidateQueries({
			queryKey: ['indications-database', params],
		});

	const indications = dashboardIndications?.indications;
	const indicationsShowing = indications ? indications.length : 0;
	const indicationsMatched = dashboardIndications?.indicationsMatched || 0;
	const totalPages = dashboardIndications?.totalPages;
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UsersRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MINHAS INDICAÇÕES</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				<GeneralPaginationComponent
					activePage={params.page}
					itemsMatchedText={indicationsMatched > 0 ? `${indicationsMatched} indicações encontradas.` : `${indicationsMatched} indicação encontrada.`}
					itemsShowingText={indicationsShowing > 0 ? `Mostrando ${indicationsShowing} indicações.` : `Mostrando ${indicationsShowing} indicação.`}
					queryLoading={isLoading}
					selectPage={(page) => updateParams({ page })}
					totalPages={totalPages || 0}
				/>
				{isLoading ? <h3 className="animate-pulse font-semibold text-xs tracking-tight lg:text-base">Buscando indicações...</h3> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					indications && indications.length > 0 ? (
						indications.map((indication) => <UserIndicationCard indication={indication} key={indication._id} />)
					) : (
						<>
							<h3 className="font-semibold text-xs tracking-tight lg:text-base">Você ainda não possui nenhuma indicação :(</h3>
							<Button className="bg-blue-600 hover:bg-[#15599a]" onClick={() => setNewIndicationMenuIsOpen((prev) => !prev)} size={'sm'}>
								Clique aqui para fazer sua primeira indicação.
							</Button>
						</>
					)
				) : null}
			</div>
			{newIndicationMenuIsOpen ? (
				<NewIndication
					callbacks={{
						onMutate: handleNewIndicationOnMutate,
						onSettled: handleNewIndicationOnSettled,
					}}
					closeModal={() => setNewIndicationMenuIsOpen(false)}
					sessionUser={sessionUser}
				/>
			) : null}
		</div>
	);
}

export default IndicationsDatabase;

type UserIndicationCardProps = {
	indication: TGetIndicationsDatabaseRouteOutput['data']['indications'][number];
};
function UserIndicationCard({ indication }: UserIndicationCardProps) {
	function getIndicationStatusTag() {
		if (indication.oportunidade.dataGanho) {
			return <h1 className="rounded-full bg-green-500 p-1 text-center font-extrabold text-[0.45rem] text-white lg:text-[0.55rem]">VENDA CONCLÚIDA</h1>;
		}
		if (indication.oportunidade.dataPerda) {
			return <h1 className="rounded-full bg-red-500 p-1 text-center font-extrabold text-[0.45rem] text-white lg:text-[0.55rem]">VENDA PERDIDA</h1>;
		}
		if (indication.oportunidade.dataInteracao) {
			return <h1 className="rounded-full bg-blue-500 p-1 text-center font-extrabold text-[0.45rem] text-white lg:text-[0.55rem]">EM ANDAMENTO</h1>;
		}
		return <h1 className="rounded-full bg-[#F97316] p-1 text-center font-extrabold text-[0.45rem] text-white lg:text-[0.55rem]">PENDENTE</h1>;
	}
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-md border border-primary/20 bg-white p-2.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="rounded-xs bg-[#15599a] p-1 font-bold text-[0.55rem] text-white leading-none tracking-tight lg:text-[0.625rem]">{indication.oportunidade.identificador}</h1>
					<h1 className="font-semibold text-[0.625rem] leading-none tracking-tight lg:text-xs">{indication.oportunidade.nome}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					{indication.creditosRecebidos ? (
						<div className="flex items-center gap-1 rounded-full bg-amber-500/30 p-1 px-2 font-extrabold text-[0.55rem] text-amber-500">
							<FaBolt className="h-2.5 min-h-2 w-2.5 min-w-2 lg:h-2.5 lg:w-2.5" />
							<p className="text-[0.55rem]">
								+{indication.creditosRecebidos} <span className="hidden lg:inline">CRÉDITOS</span>
							</p>
						</div>
					) : null}

					{getIndicationStatusTag()}
				</div>
			</div>
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutDashboard className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
					<h1 className="font-semibold text-[0.6rem] leading-none tracking-tight">{indication.tipo.titulo}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<BsCalendarPlus className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
					<h1 className="font-semibold text-[0.6rem] leading-none tracking-tight">{formatDateAsLocale(indication.dataInsercao, true)}</h1>
				</div>
			</div>
		</div>
	);
}
