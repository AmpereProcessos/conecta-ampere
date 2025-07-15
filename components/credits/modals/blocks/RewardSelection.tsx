import { EarnRewardsOptions } from "@/configs/constants";
import { cn } from "@/lib/utils";
import type { TCreditRedemptionRequest } from "@/schemas/credit-redemption-request.schema";
import { TicketCheck } from "lucide-react";
import React from "react";
import { FaBolt } from "react-icons/fa";

type RewardSelectionProps = {
	infoHolder: TCreditRedemptionRequest;
	updateInfoHolder: (changes: Partial<TCreditRedemptionRequest>) => void;
};
function RewardSelection({ infoHolder, updateInfoHolder }: RewardSelectionProps) {
	return (
		<div className="w-full flex flex-col gap-1.5 py-4">
			<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight w-full text-center">SELECIONE A RECOMPENSA</h1>
			<div className="w-full flex-col flex items-center py-3 px-6 gap-1.5">
				{EarnRewardsOptions.map((option) => (
					<button
						type="button"
						onClick={() =>
							updateInfoHolder({
								recompensaResgatada: {
									id: option.id,
									nome: option.label,
									creditosNecessarios: option.requiredCredits,
								},
							})
						}
						key={`${option.id}`}
						className={cn(
							"flex duration-300 ease-in-out flex-col items-center justify-center border-2 border-transparent gap-1 p-2 lg:p-8 bg-[#FB2E9F]/20 text-[#FB2E9F] rounded-lg aspect-auto w-full hover:bg-[#FB2E9F]/30",
							{
								"bg-[#FB2E9F]/40 border-[#FB2E9F]": infoHolder.recompensaResgatada.id === option.value,
							},
						)}
					>
						<TicketCheck className="w-6 h-6 lg:w-12 lg:h-12 min-w-4 min-h-4" />
						<h1 className="font-bold text-sm lg:text-lg tracking-tight text-center uppercase break-words">{option.label}</h1>
						<h1 className="text-[0.55rem]">POR</h1>
						<div className="w-full flex items-center justify-center gap-1 text-primary">
							<FaBolt />
							<p className="font-bold text-[0.6rem] lg:text-sm tracking-tight text-center uppercase break-words">{option.requiredCredits} CRÉDITOS</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

export default RewardSelection;
