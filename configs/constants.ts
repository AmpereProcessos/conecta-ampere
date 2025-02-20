import { MdDarkMode, MdSunny } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import type { IconType } from "react-icons/lib";
import type { TSaleCategoryEnum } from "@/schemas/enums.schema";
import { BsFiletypeCsv, BsFiletypeDocx, BsFiletypePdf, BsFiletypeXlsx, BsFiletypeXml, BsFillPlayBtnFill, BsImage, BsPeopleFill } from "react-icons/bs";

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

type FileTypes = {
	[contentType: string]: {
		title: string;
		extension: string;
		icon: IconType;
	};
};
export const FILE_TYPES: FileTypes = {
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
		title: "WORD",
		extension: ".docx",
		icon: BsFiletypeDocx,
	},
	"image/png": {
		title: "IMAGEM (.PNG)",
		extension: ".png",
		icon: BsImage,
	},
	"image/jpeg": {
		title: "IMAGEM(.JPEG)",
		extension: ".jpeg",
		icon: BsImage,
	},
	"image/tiff": {
		title: "IMAGEM(.TIFF)",
		extension: ".tiff",
		icon: BsImage,
	},
	"application/pdf": {
		title: "PDF",
		extension: ".pdf",
		icon: BsFiletypePdf,
	},
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
		title: "EXCEL",
		extension: ".xlsx",
		icon: BsFiletypeXlsx,
	},
	"text/xml": {
		title: "XML",
		extension: ".xml",
		icon: BsFiletypeXml,
	},
	"video/mp4": {
		title: "MP4",
		extension: ".mp4",
		icon: BsFillPlayBtnFill,
	},
	"application/vnd.sealed.tiff": {
		title: "IMAGEM(.TIFF)",
		extension: ".tiff",
		icon: BsImage,
	},
	"image/vnd.sealedmedia.softseal.jpg": {
		title: "IMAGEM(.JPG)",
		extension: ".jpg",
		icon: BsImage,
	},
	"text/csv": {
		title: "CSV(.CSV)",
		extension: ".csv",
		icon: BsFiletypeCsv,
	},
};
