import { BadgeCheck, CircleCheck, CirclePlay, GitPullRequest, Hammer, ScanSearch, ShoppingCart, Truck } from 'lucide-react';

export const JourneySteps = [
	{
		icon: CirclePlay,
		id: 'journey-start',
		title: 'Início da sua Jornada',
		description: 'O início da sua jornada começa com a assinatura do contrato. À partir daí, iniciamos os processos que levarão à entrega do seu sistema fotovoltaico.',
	},
	{
		icon: GitPullRequest,
		id: 'access-granting-request',
		title: 'Solicitação do Parecer de Acesso',
		description: 'O momento em que solicitamos à concessionária local o parecer de acesso ao seu sistema fotovoltaico.',
	},
	{
		icon: BadgeCheck,
		id: 'access-granting-approval',
		title: 'Aprovação do Parecer de Acesso',
		description: 'A aprovação do parecer de acesso do seu projeto junto à sua concessionária local.',
	},
	{
		icon: ShoppingCart,
		id: 'equipment-order',
		title: 'Compra dos Equipamentos',
		description: 'O momento em que realizamos a compra dos seus equipamentos.',
	},
	{
		icon: Truck,
		id: 'equipment-delivery',
		title: 'Entrega dos Equipamentos',
		description: 'Marca a entrega dos seus equipamentos ao seu endereço.',
	},
	{
		icon: Hammer,
		id: 'service-execution-start',
		title: 'Início da Execução do Serviço',
		description: 'O momento em que iniciamos a execução do serviço de instalação do seu sistema fotovoltaico.',
	},
	{
		icon: Hammer,
		id: 'service-execution-end',
		title: 'Conclusão da Execução do Serviço',
		description: 'Marca a conclusão da execução do serviço de instalação do seu sistema fotovoltaico.',
	},
	{
		icon: ScanSearch,
		id: 'vistory-request',
		title: 'Solicitação de Vistoria',
		description: 'O momento em que solicitamos à concessionária local a vistoria do seu sistema fotovoltaico.',
	},
	{
		icon: BadgeCheck,
		id: 'vistory-approval',
		title: 'Vistoria',
		description: 'A aprovação da vistoria do seu sistema fotovoltaico junto à sua concessionária local.',
	},
	{
		icon: CircleCheck,
		id: 'journey-end',
		title: 'Conclusão da sua Jornada',
		description: 'Finalização e entrega do seu tão desejado sistema fotovoltaico.',
	},
];

export function getJourneyStepMetadata(stepId: string) {
	const step = JourneySteps.find((s) => s.id === stepId);
	if (!step) return null;
	return step;
}
