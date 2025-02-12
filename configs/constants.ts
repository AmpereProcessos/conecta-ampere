import { MdDarkMode, MdSunny } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import type { IconType } from "react-icons/lib";
import type { TSaleCategoryEnum } from "@/schemas/enums.schema";
export const Themes = [
	{
		label: "Sistema",
		value: "system",
		icon: BsRobot,
	},
	{
		label: "Claro",
		value: "light",
		icon: MdSunny,
	},
	{
		label: "Escuro",
		value: "dark",
		icon: MdDarkMode,
	},
];
export function getThemeIcon(theme: string): IconType {
	return Themes.find((t) => t.value === theme)?.icon || BsRobot;
}

type TReferEarnOption = {
	id: number;
	projectTypeId: string;
	projectType: string;
	projectTypeSaleCategory: TSaleCategoryEnum;
	referEarnCall: string;
};
export const ReferEarnOptions: TReferEarnOption[] = [
	{
		id: 1,
		projectTypeId: "6615785ddcb7a6e66ede9785",
		projectType: "SISTEMA FOTOVOLTAICO",
		projectTypeSaleCategory: "KIT",
		referEarnCall: "Indique para Sistema Fotovoltaico",
	},
	{
		id: 2,
		projectTypeId: "6647673834e6ab38c7d36727",
		projectType: "CONSÓRCIO DE ENERGIA",
		projectTypeSaleCategory: "PLANO",
		referEarnCall: "Indique para Desconto de Energia",
	},
	{
		id: 3,
		projectTypeId: "661ec7e5e03128a48f94b4de",
		projectType: "OPERAÇÃO E MANUTENÇÃO",
		projectTypeSaleCategory: "PLANO",
		referEarnCall: "Indique para Limpeza de Painéis",
	},
	{
		id: 4,
		projectTypeId: "661ec7e5e03128a48f94b4de",
		projectType: "OPERAÇÃO E MANUTENÇÃO",
		projectTypeSaleCategory: "PLANO",
		referEarnCall: "Indique para Manutenção Solar",
	},
];

export const EarnRewardsOptions = [
	{
		id: "67a61c79fe128a1045e26528",
		label: "VALE PIX - 50 REAIS",
		value: "67a61c79fe128a1045e26528",
		requiredCredits: 50,
	},
	{
		id: "67a61c825c120e5aa98b8581",
		label: "VALE PIX - 100 REAIS",
		value: "67a61c825c120e5aa98b8581",
		requiredCredits: 100,
	},
	{
		id: "67a61ca1d890dc0dec6b1abf",
		label: "VALE PIX - 500 REAIS",
		value: "67a61ca1d890dc0dec6b1abf",
		requiredCredits: 500,
	},
];
