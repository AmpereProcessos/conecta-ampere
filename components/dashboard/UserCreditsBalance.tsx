"use client";
import type { TAuthSession } from "@/lib/authentication/types";
import { useUserCreditsBalanceQuery } from "@/lib/queries/credits";
import { TicketCheck } from "lucide-react";
import React from "react";
import { FaBolt } from "react-icons/fa";

type UserCreditsBalanceProps = {
	sessionUser: TAuthSession["user"];
};
function UserCreditsBalance({ sessionUser }: UserCreditsBalanceProps) {
	const { data } = useUserCreditsBalanceQuery();
	return (
		<div className="w-full flex flex-col p-3.5 shadow-sm border border-[#FB2E9F] bg-[#FB2E9F]/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight text-[#FB2E9F]">
						MEUS CRÉDITOS AMPÈRE
					</h1>
				</div>
			</div>
			<div className="w-full flex items-end justify-between gap-1.5">
				<div className="flex items-center gap-1.5 text-[#FB2E9F]">
					<h1 className="font-black text-4xl">{data?.balance}</h1>
					<FaBolt size={22} />
				</div>
				{/* <button
					type="button"
					className="py-1 px-2 w-fit flex rounded-lg items-center gap-1 text-[#FB2E9F] transition-colors"
				>
					<TicketCheck size={15} />
					<p className="text-[0.5rem] lg:text-xs font-extrabold">
						NOVO RESGATE
					</p>
				</button> */}
			</div>
		</div>
	);
}

export default UserCreditsBalance;
