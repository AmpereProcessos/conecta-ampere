import axios from "axios";
import { toast } from "sonner";

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
		const { data } = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`);
		console.log(data);
		if (data.erro) throw new Error("Erro");
		return data;
	} catch (error) {
		toast.error("Erro ao buscar informações à partir do CEP.");
		return null;
	}
}
