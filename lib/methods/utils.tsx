import axios from 'axios';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

type ViaCEPSuccessfulReturn = {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
};
export async function getCEPInfo(cep: string): Promise<ViaCEPSuccessfulReturn | null> {
	try {
		const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
		console.log(data);
		if (data.erro) throw new Error('Erro');
		return data;
	} catch (_) {
		toast.error('Erro ao buscar informações à partir do CEP.');
		return null;
	}
}

export async function copyToClipboard(text: string) {
	await navigator.clipboard.writeText(text);
	return toast('Copiado para área de transferência.', {
		icon: <Copy className="h-4 w-4" />,
	});
}

export const ProjectTypesCollors = {
	'SISTEMA FOTOVOLTAICO': 'bg-[#15599a] text-[#fead61]',
	'SISTEMA FOTOVOLTAICO (OFF GRID)': 'bg-[#fead61] text-[#15599a]',
	'AUMENTO DE SISTEMA FOTOVOLTAICO': 'bg-green-500 text-white',
	'BOMBA SOLAR': 'bg-[#000066] text-white',
	'OPERAÇÃO E MANUTENÇÃO': 'bg-[#8604c2] text-white',
	'SUBESTAÇÃO DE ENERGIA': 'bg-[#e6e6e6] text-[#15599a]',
	'SEGURO DE SISTEMA FOTOVOLTAICO': 'bg-[#b990e7] text-white',
	MONITORAMENTO: 'bg-[#08A89F] text-white',
};
export function getProjectTypeCollors(type: string) {
	return ProjectTypesCollors[type as keyof typeof ProjectTypesCollors] || 'bg-primary/60 text-white';
}
type GetContractValueParams = {
	projectValue?: number | null;
	paValue?: number | null;
	structureValue?: number | null;
	oemValue?: number | null;
	insuranceValue?: number | null;
};
export function getProjectContractValue({ projectValue, paValue, structureValue, oemValue, insuranceValue }: GetContractValueParams) {
	return [projectValue, paValue, structureValue, oemValue, insuranceValue].map((value) => Number(value || 0)).reduce((sum, value) => sum + value, 0);
}
