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

type CreditRedemptionRequestsProps = {
	sessionUser: TAuthSession["user"];
};
function CreditRedemptionRequests({ sessionUser }: CreditRedemptionRequestsProps) {
	const queryClient = useQueryClient();
	const [newRequestMenuIsOpen, setNewRequestMenuIsOpen] = useState<boolean>(false);
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
			<button
				onClick={() => setNewRequestMenuIsOpen((prev) => !prev)}
				type="button"
				className="py-2 px-2 w-full lg:w-2/3 flex justify-center rounded-lg items-center gap-1 bg-[#FB2E9F] text-white"
			>
				<TicketCheck className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
				<p className="text-[0.5rem] lg:text-sm font-extrabold">NOVO RESGATE</p>
			</button>
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
							<h3 className="text-xs lg:text-base font-semibold tracking-tight">Você ainda não possui nenhum resgate :(</h3>
						)
					) : null}
				</div>
			</div>
			{newRequestMenuIsOpen ? (
				<NewCreditRedemptionRequest
					sessionUser={sessionUser}
					closeModal={() => setNewRequestMenuIsOpen(false)}
					callbacks={{
						onMutate: handleNewRequestOnMutate,
						onSettled: handleNewRequestOnSettled,
					}}
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
