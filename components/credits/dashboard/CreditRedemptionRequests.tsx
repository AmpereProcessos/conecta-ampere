'use client';
import { useQueryClient } from '@tanstack/react-query';
import { TicketCheck } from 'lucide-react';
import { useState } from 'react';
import { BsCalendarPlus } from 'react-icons/bs';
import { FaBolt } from 'react-icons/fa';
import ErrorComponent from '@/components/layout/ErrorComponent';
import type { TAuthSession } from '@/lib/authentication/types';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatDateAsLocale } from '@/lib/methods/formatting';
import { useCreditRedemptionRequestsQuery } from '@/lib/queries/credits';
import type { TCreditRedemptionRequest } from '@/schemas/credit-redemption-request.schema';
import NewCreditRedemptionRequest from '../modals/NewCreditRedemptionRequest';

type TNewCreditRedemptionRequestMenuState = {
	isOpen: boolean;
	reward: {
		id: string;
		label: string;
		requiredCredits: number;
	} | null;
};
type CreditRedemptionRequestsProps = {
	sessionUser: TAuthSession['user'];
};
function CreditRedemptionRequests({ sessionUser }: CreditRedemptionRequestsProps) {
	const queryClient = useQueryClient();
	const [newRequestMenu, setNewRequestMenu] = useState<TNewCreditRedemptionRequestMenuState>({
		isOpen: false,
		reward: null,
	});
	const { data: requests, isLoading, isError, isSuccess, error } = useCreditRedemptionRequestsQuery();

	console.log('REQUESTS', requests);
	const handleNewRequestOnMutate = async () =>
		await queryClient.cancelQueries({
			queryKey: ['credit-redemption-requests'],
		});
	const handleNewRequestOnSettled = async () =>
		await queryClient.invalidateQueries({
			queryKey: ['credit-redemption-requests'],
		});
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<TicketCheck className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">MEUS RESGATES</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				{isLoading ? <h3 className="animate-pulse font-semibold text-xs tracking-tight lg:text-base">Buscando resgates...</h3> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					requests.length > 0 ? (
						requests.map((request) => <CreditRedemptionRequestCard key={request._id} request={request} />)
					) : (
						<>
							<h3 className="font-semibold text-xs tracking-tight lg:text-base">Você ainda não possui nenhum resgate :(</h3>
							<button
								className="flex w-fit items-center justify-center gap-1 rounded-lg bg-[#FB2E9F]/20 px-2 py-2 text-[#FB2E9F] duration-300 ease-in-out hover:bg-[#FB2E9F]/30"
								onClick={() => setNewRequestMenu((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
								type="button"
							>
								<TicketCheck className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
								<p className="font-extrabold text-[0.5rem] lg:text-sm">NOVO RESGATE</p>
							</button>
						</>
					)
				) : null}
			</div>
			{newRequestMenu.isOpen ? (
				<NewCreditRedemptionRequest
					callbacks={{
						onMutate: handleNewRequestOnMutate,
						onSettled: handleNewRequestOnSettled,
					}}
					closeModal={() => setNewRequestMenu((prev) => ({ ...prev, isOpen: false }))}
					initialState={
						newRequestMenu.reward
							? {
									creditosResgatados: newRequestMenu.reward.requiredCredits,
									recompensaResgatada: {
										id: newRequestMenu.reward.id,
										nome: newRequestMenu.reward.label,
										creditosNecessarios: newRequestMenu.reward.requiredCredits,
									},
								}
							: undefined
					}
					sessionUser={sessionUser}
				/>
			) : null}
		</div>
	);
}

export default CreditRedemptionRequests;

type CreditRedemptionRequestCardProps = {
	request: TCreditRedemptionRequest; // fix if the correct api endpoint output type
};
function CreditRedemptionRequestCard({ request }: CreditRedemptionRequestCardProps) {
	function getCreditRedemptionRequestStatus() {
		if (request.dataEfetivacao) {
			return <h1 className="rounded-full bg-green-500 p-1 font-extrabold text-[0.5rem] text-white">CONCLUÍDO</h1>;
		}
		return <h1 className="rounded-full bg-[#F97316] p-1 font-extrabold text-[0.5rem] text-white">PENDENTE</h1>;
	}
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-md border border-primary/20 bg-white p-2.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="font-semibold text-[0.625rem] leading-none tracking-tight lg:text-xs">{request.recompensaResgatada.nome}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-1 rounded-full bg-[#FB2E9F]/30 p-1 px-2 font-extrabold text-[#FB2E9F] text-[0.5rem]">
						<FaBolt className="h-2.5 min-h-2 w-2.5 min-w-2 lg:h-2.5 lg:w-2.5" />
						<p className="text-[0.5rem]">-{request.creditosResgatados} CRÉDITOS</p>
					</div>
					{getCreditRedemptionRequestStatus()}
				</div>
			</div>
			<div className="flex w-full items-center justify-end gap-1.5">
				{request.dataEfetivacao ? (
					<div className="flex items-center gap-1.5">
						<BsCalendarPlus className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
						<h1 className="font-semibold text-[0.5rem] leading-none tracking-tight">{formatDateAsLocale(request.dataEfetivacao, true)}</h1>
					</div>
				) : null}

				<div className="flex items-center gap-1.5">
					<BsCalendarPlus className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
					<h1 className="font-semibold text-[0.5rem] leading-none tracking-tight">{formatDateAsLocale(request.dataInsercao, true)}</h1>
				</div>
			</div>
		</div>
	);
}
