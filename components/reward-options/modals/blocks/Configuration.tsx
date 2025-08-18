import { Settings } from 'lucide-react';
import NumberInput from '@/components/inputs/NumberInput';
import type { TRewardOption } from '@/schemas/reward-option.schema';

type RewardOptionConfigurationProps = {
	infoHolder: TRewardOption;
	updateInfoHolder: (changes: Partial<TRewardOption>) => void;
};
export default function RewardOptionConfiguration({ infoHolder, updateInfoHolder }: RewardOptionConfigurationProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex w-fit items-center gap-2 rounded bg-primary/20 px-2 py-1">
				<Settings className="h-4 min-h-4 w-4 min-w-4" />
				<h1 className="w-fit text-start font-medium text-xs tracking-tight">CONFIGURAÇÕES</h1>
			</div>
			<div className="flex w-full flex-col gap-1.5">
				<NumberInput
					handleChange={(value) => updateInfoHolder({ creditosNecessarios: value })}
					labelText="CREDITOS NECESSÁRIOS"
					placeholderText="Preencha aqui o número de créditos necessários para resgatar a recompensa..."
					value={infoHolder.creditosNecessarios}
				/>
			</div>
		</div>
	);
}
