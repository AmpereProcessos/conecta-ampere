import { TicketCheck } from 'lucide-react';
import Image from 'next/image';
import { useRewardOptionsQuery } from '@/lib/queries/reward-options';
import type { TCreditRedemptionRequest } from '@/schemas/credit-redemption-request.schema';

type RewardSelectionProps = {
	infoHolder: TCreditRedemptionRequest;
	updateInfoHolder: (changes: Partial<TCreditRedemptionRequest>) => void;
};
function RewardSelection({ updateInfoHolder }: RewardSelectionProps) {
	const { data: rewardOptions } = useRewardOptionsQuery();
	return (
		<div className="flex w-full flex-col gap-1.5 py-4">
			<h1 className="w-full text-center font-bold text-sm leading-none tracking-tight lg:text-lg">SELECIONE A RECOMPENSA</h1>
			<div className="flex w-full flex-col items-center gap-1.5 px-6 py-3">
				{rewardOptions?.map((option) => (
					<button
						className="relative flex h-[150px] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-transparent p-2 transition-all duration-300 ease-in-out hover:border-primary lg:h-[250px] lg:p-8"
						key={option._id}
						onClick={() =>
							updateInfoHolder({
								recompensaResgatada: {
									id: option._id,
									nome: option.titulo,
									creditosNecessarios: option.creditosNecessarios,
								},
							})
						}
						type="button"
					>
						{option.imagemCapaUrl && (
							<>
								<Image
									alt={`Imagem de capa da recompensa: ${option.titulo}`}
									className="absolute inset-0 rounded-lg object-cover"
									fill
									sizes="(max-width: 768px) 33.333vw, 30vw"
									src={option.imagemCapaUrl}
								/>
								<div className="absolute inset-0 rounded-lg bg-black/40" />
							</>
						)}
						<div className="relative z-10 flex flex-col items-center gap-1">
							<TicketCheck className="h-6 min-h-4 w-6 min-w-4 lg:h-12 lg:min-h-12 lg:w-12 lg:min-w-12" />
							<h1 className="break-words text-center font-bold text-[0.55rem] uppercase tracking-tight lg:text-lg">{option.chamada}</h1>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

export default RewardSelection;
