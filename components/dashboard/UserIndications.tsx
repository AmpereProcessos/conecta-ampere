"use client";
import type { TGetIndicationsRouteOutputDataDefault } from "@/app/api/indications/route";
import ErrorComponent from "@/components/layout/ErrorComponent";
import { getErrorMessage } from "@/lib/methods/errors";
import { formatDateAsLocale } from "@/lib/methods/formatting";
import { useIndicationsQuery } from "@/lib/queries/indications";
import { LayoutDashboard, UsersRound } from "lucide-react";
import React from "react";
import { BsCalendarPlus } from "react-icons/bs";

function UserIndications() {
	const {
		data: indications,
		isLoading,
		isError,
		isSuccess,
		error,
	} = useIndicationsQuery();

	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UsersRound className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">
						MINHAS INDICAÇÕES
					</h1>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center grow py-3 px-0 lg:px-6 gap-1.5">
				{isLoading ? (
					<h3 className="text-xs lg:text-base font-semibold tracking-tight animate-pulse">
						Buscando indicações...
					</h3>
				) : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					indications.length > 0 ? (
						indications.map((indication) => (
							<UserIndicationCard
								key={indication._id}
								indication={indication}
							/>
						))
					) : (
						<h3 className="text-xs lg:text-base font-semibold tracking-tight">
							Você ainda não possui nenhuma indicação :(
						</h3>
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
	function getIndicationStatusTag(
		indication: TGetIndicationsRouteOutputDataDefault[number],
	) {
		if (indication.oportunidade.dataGanho) {
			return (
				<h1 className="rounded-full bg-green-500 text-white font-extrabold text-[0.5rem] p-1">
					VENDA CONCLÚIDA
				</h1>
			);
		}
		if (indication.oportunidade.dataPerda) {
			return (
				<h1 className="rounded-full bg-red-500 text-white font-extrabold text-[0.5rem] p-1">
					VENDA PERDIDA
				</h1>
			);
		}
		if (indication.oportunidade.dataInteracao) {
			return (
				<h1 className="rounded-full bg-blue-500 text-white font-extrabold text-[0.5rem] p-1">
					EM ANDAMENTO
				</h1>
			);
		}
		return (
			<h1 className="rounded-full bg-[#F97316] text-white font-extrabold text-[0.5rem] p-1">
				PENDENTE
			</h1>
		);
	}
	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-2.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-md">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="p-1 font-bold leading-none tracking-tight text-[0.5rem] lg:text-[0.625rem] bg-[#15599a] text-white rounded-xs">
						{indication.oportunidade.identificador}
					</h1>
					<h1 className="font-semibold leading-none tracking-tight text-[0.625rem] lg:text-xs">
						{indication.oportunidade.nome}
					</h1>
				</div>
				{getIndicationStatusTag(indication)}
			</div>
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutDashboard className="w-3 h-3 lg:w-4 lg:h-4 min-w-4 min-h-4" />
					<h1 className="font-semibold leading-none tracking-tight text-[0.5rem]">
						{indication.tipo.titulo}
					</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<BsCalendarPlus className="w-3 h-3 lg:w-4 lg:h-4 min-w-4 min-h-4" />
					<h1 className="font-semibold leading-none tracking-tight text-[0.5rem]">
						{formatDateAsLocale(indication.dataInsercao, true)}
					</h1>
				</div>
			</div>
		</div>
	);
}
