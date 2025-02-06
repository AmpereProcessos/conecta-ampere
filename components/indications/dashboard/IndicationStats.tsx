"use client";
import { useIndicationStatsQuery } from "@/lib/queries/indications";
import { cn } from "@/lib/utils";
import { BadgeX, ChartColumn, CircleDot, Trophy } from "lucide-react";
import React from "react";

function IndicationStats() {
	const { data, isLoading, isError, isSuccess, error } =
		useIndicationStatsQuery();
	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<ChartColumn className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">
						RESULTADOS
					</h1>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center grow py-3 px-0 lg:px-6 gap-1.5">
				<div className="w-full flex items-center gap-1.5">
					<IndicationStatCard
						type="wins"
						text={`${data?.indicationsLostSales || 0} GANHAS`}
					/>
					<IndicationStatCard
						type="losts"
						text={`${data?.indicationsLostSales || 0} PERDIDAS`}
					/>
					<IndicationStatCard
						type="ongoing"
						text={`${data?.indicationsOnGoingOpportunities || 0} EM ANDAMENTO`}
					/>
				</div>
			</div>
		</div>
	);
}

export default IndicationStats;

type IndicationStatCardProps = {
	type: "wins" | "losts" | "ongoing";
	text: string;
};
function IndicationStatCard({ type, text }: IndicationStatCardProps) {
	return (
		<div
			className={cn(
				"w-full flex flex-col gap-1.5 px-2 py-1.5 border-2 rounded",
				{
					"border-green-500 bg-green-500/30": type === "wins",
					"border-red-500 bg-red-500/30": type === "losts",
					"border-blue-600 bg-blue-600/30": type === "ongoing",
				},
			)}
		>
			<div className="w-full flex items-center justify-center">
				{type === "wins" ? (
					<Trophy className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
				) : null}
				{type === "losts" ? (
					<BadgeX className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
				) : null}
				{type === "ongoing" ? (
					<CircleDot className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
				) : null}
			</div>
			<h1 className="w-full text-center text-[0.6rem] lg:text-base">{text}</h1>
		</div>
	);
}
