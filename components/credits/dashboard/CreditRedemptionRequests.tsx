"use client";
import ErrorComponent from "@/components/layout/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import { getErrorMessage } from "@/lib/methods/errors";
import { formatDateAsLocale } from "@/lib/methods/formatting";
import { useCreditRedemptionRequestsQuery } from "@/lib/queries/credits";
import type { TCreditRedemptionRequest } from "@/schemas/credit-redemption-request.schema";
import { TicketCheck } from "lucide-react";
import React, { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { FaBolt } from "react-icons/fa";
import NewCreditRedemptionRequest from "../modals/NewCreditRedemptionRequest";
import { useQueryClient } from "@tanstack/react-query";
import { EarnRewardsOptions } from "@/configs/constants";

type TNewCreditRedemptionRequestMenuState = {
	isOpen: boolean;
	reward: {
		id: string;
		label: string;
		requiredCredits: number;
	} | null;
};
type CreditRedemptionRequestsProps = {
	sessionUser: TAuthSession["user"];
};
function CreditRedemptionRequests({ sessionUser }: CreditRedemptionRequestsProps) {
	const queryClient = useQueryClient();
	const [newRequestMenu, setNewRequestMenu] = useState<TNewCreditRedemptionRequestMenuState>({
		isOpen: false,
		reward: null,
	});
	const { data: requests, isLoading, isError, isSuccess, error } = useCreditRedemptionRequestsQuery();

	console.log("REQUESTS", requests);
	const handleNewRequestOnMutate = async () =>
		await queryClient.cancelQueries({
			queryKey: ["credit-redemption-requests"],
		});
	const handleNewRequestOnSettled = async () =>
		await queryClient.invalidateQueries({
			queryKey: ["credit-redemption-requests"],
		});
	return (
		<div className="w-full flex items-center flex-col gap-1.5">
			<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
				<div className="w-full flex items-center justify-between gap-1.5">
					<div className="flex items-center gap-1.5">
						<TicketCheck className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
						<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">RESGATE SEUS CRÉDITOS</h1>
					</div>
				</div>
				<div className="w-full">
					<p className="text-[0.625rem] lg:text-sm">
						<span className="font-normal">Escolha uma recompensa e resgate seus créditos.</span>
						<span className="text-[#FB2E9F] font-bold inline-flex items-center gap-0.5">
							<FaBolt className="w-2 h-2 lg:w-4 lg:h-4" />
							CRÉDITOS
						</span>
					</p>
				</div>
				<div className="w-full grid grid-cols-2 lg:flex items-center justify-center grow py-3 px-0 lg:px-6 gap-1.5 lg:flex-wrap">
					{EarnRewardsOptions.map((option) => (
						<button
							type="button"
							onClick={() =>
								setNewRequestMenu({
									isOpen: true,
									reward: {
										id: option.id,
										label: option.label,
										requiredCredits: option.requiredCredits,
									},
								})
							}
							key={`${option.id}-${option.label}`}
							className="flex hover:bg-[#FB2E9F]/30 duration-300 ease-in-out flex-col items-center justify-center gap-1 p-2 lg:p-8 bg-[#FB2E9F]/20 text-[#FB2E9F] rounded-lg aspect-video sm:aspect-auto"
						>
							<TicketCheck className="w-6 h-6 lg:w-12 lg:h-12 min-w-4 min-h-4" />
							<h1 className="font-bold text-[0.55rem] lg:text-lg tracking-tight text-center uppercase break-words">{option.redeemCall}</h1>
						</button>
					))}
				</div>
			</div>

			<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
				<div className="w-full flex items-center justify-between gap-1.5">
					<div className="flex items-center gap-1.5">
						<TicketCheck className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
						<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">MEUS RESGATES</h1>
					</div>
				</div>
				<div className="w-full flex flex-col items-center justify-center grow py-3 px-0 lg:px-6 gap-1.5">
					{isLoading ? <h3 className="text-xs lg:text-base font-semibold tracking-tight animate-pulse">Buscando resgates...</h3> : null}
					{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
					{isSuccess ? (
						requests.length > 0 ? (
							requests.map((request) => <CreditRedemptionRequestCard key={request._id} request={request} />)
						) : (
							<>
								<h3 className="text-xs lg:text-base font-semibold tracking-tight">Você ainda não possui nenhum resgate :(</h3>
								<button
									onClick={() => setNewRequestMenu((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
									type="button"
									className="py-2 px-2 w-fit flex justify-center rounded-lg items-center gap-1 hover:bg-[#FB2E9F]/30 duration-300 ease-in-out bg-[#FB2E9F]/20 text-[#FB2E9F]"
								>
									<TicketCheck className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
									<p className="text-[0.5rem] lg:text-sm font-extrabold">NOVO RESGATE</p>
								</button>
							</>
						)
					) : null}
				</div>
			</div>
			{newRequestMenu.isOpen ? (
				<NewCreditRedemptionRequest
					sessionUser={sessionUser}
					closeModal={() => setNewRequestMenu((prev) => ({ ...prev, isOpen: false }))}
					callbacks={{
						onMutate: handleNewRequestOnMutate,
						onSettled: handleNewRequestOnSettled,
					}}
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
	function getCreditRedemptionRequestStatus({
		request,
	}: {
		request: TCreditRedemptionRequest; // fix if the correct api endpoint output type
	}) {
		if (request.dataEfetivacao) {
			return <h1 className="rounded-full bg-green-500 text-white font-extrabold text-[0.5rem] p-1">CONCLUÍDO</h1>;
		}
		return <h1 className="rounded-full bg-[#F97316] text-white font-extrabold text-[0.5rem] p-1">PENDENTE</h1>;
	}
	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-2.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-md">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="font-semibold leading-none tracking-tight text-[0.625rem] lg:text-xs">{request.recompensaResgatada.nome}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="rounded-full bg-[#FB2E9F]/30 text-[#FB2E9F] font-extrabold text-[0.5rem] px-2 p-1 flex items-center gap-1">
						<FaBolt className="w-2.5 h-2.5 lg:w-2.5 lg:h-2.5 min-w-2 min-h-2" />
						<p className="text-[0.5rem]">-{request.creditosResgatados} CRÉDITOS</p>
					</div>
					{getCreditRedemptionRequestStatus({ request })}
				</div>
			</div>
			<div className="w-full flex items-center justify-end gap-1.5">
				{request.dataEfetivacao ? (
					<div className="flex items-center gap-1.5">
						<BsCalendarPlus className="w-3 h-3 lg:w-4 lg:h-4 min-w-4 min-h-4" />
						<h1 className="font-semibold leading-none tracking-tight text-[0.5rem]">{formatDateAsLocale(request.dataEfetivacao, true)}</h1>
					</div>
				) : null}

				<div className="flex items-center gap-1.5">
					<BsCalendarPlus className="w-3 h-3 lg:w-4 lg:h-4 min-w-4 min-h-4" />
					<h1 className="font-semibold leading-none tracking-tight text-[0.5rem]">{formatDateAsLocale(request.dataInsercao, true)}</h1>
				</div>
			</div>
		</div>
	);
}
