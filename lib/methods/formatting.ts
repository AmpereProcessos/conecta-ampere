import dayjs from "dayjs";
import { isValidNumber } from "./validation";
export function formatDateForInput(value: any) {
	if (!value) return undefined;
	if (Number.isNaN(new Date(value).getMilliseconds())) return undefined;
	return new Date(value).toISOString().slice(0, 10);
}
export function formatDateTimeForInput(value: any) {
	if (!value) return undefined;
	if (Number.isNaN(new Date(value).getMilliseconds())) return undefined;
	return dayjs(value).format("YYYY-MM-DDTHH:mm");
}

export function formatDateAsLocale(
	date?: string | Date | null,
	showHours = false,
) {
	if (!date) return null;
	if (showHours) return dayjs(date).format("DD/MM/YYYY HH:mm");
	return dayjs(date).add(3, "hour").format("DD/MM/YYYY");
}
export function formatDateInputChange(
	value: any,
	returnType?: "date" | "string",
	normalizeHours = true,
) {
	if (Number.isNaN(new Date(value).getMilliseconds())) return null;
	if (!returnType || returnType === "string") {
		if (!normalizeHours) return new Date(value).toISOString();
		return dayjs(new Date(value)).add(3, "hours").toISOString();
	}
	if (!normalizeHours) return new Date(value);
	return dayjs(new Date(value)).add(3, "hours").toDate();
}
export function formatToDateTime(date: string | null) {
	if (!date) return "";
	return dayjs(date).format("DD/MM/YYYY HH:mm");
}
export function formatDateQuery(
	date: string,
	type: "start" | "end",
	returnAs?: "string" | "date",
) {
	if (type === "start") {
		if (returnAs === "date")
			return dayjs(date).startOf("day").subtract(3, "hour").toDate() as Date;
		return dayjs(date).startOf("day").subtract(3, "hour").toISOString();
	}
	if (type === "end") {
		if (returnAs === "date")
			return dayjs(date).endOf("day").subtract(3, "hour").toDate() as Date;
		return dayjs(date).endOf("day").subtract(3, "hour").toISOString();
	}
	return dayjs(date).startOf("day").subtract(3, "hour").toISOString();
}
export function formatNameAsInitials(name: string) {
	const splittedName = name.split(" ");
	const firstLetter = splittedName[0] ? splittedName[0][0] || "" : "";
	let secondLetter = "";
	if (["DE", "DA", "DO", "DOS", "DAS"].includes(splittedName[1] || ""))
		secondLetter = splittedName[2] ? splittedName[2][0] : "";
	else secondLetter = splittedName[1] ? splittedName[1][0] : "";
	if (!firstLetter && !secondLetter) return "N";
	return firstLetter + secondLetter;
}
export function formatToMoney(value: string | number, tag = "R$") {
	return `${tag} ${Number(value).toLocaleString("pt-br", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}
export function formatDecimalPlaces(
	value: string | number,
	minPlaces?: number,
	maxPlaces?: number,
) {
	return Number(value).toLocaleString("pt-br", {
		minimumFractionDigits:
			minPlaces !== null && minPlaces !== undefined ? minPlaces : 0,
		maximumFractionDigits:
			maxPlaces !== null && maxPlaces !== undefined ? maxPlaces : 2,
	});
}
export function formatToCPForCNPJ(value: string): string {
	const cnpjCpf = value.replace(/\D/g, "");

	if (cnpjCpf.length === 11) {
		return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
	}

	return cnpjCpf.replace(
		/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
		"$1.$2.$3/$4-$5",
	);
}
export function formatToCEP(value: string): string {
	const cep = value
		.replace(/\D/g, "")
		.replace(/(\d{5})(\d)/, "$1-$2")
		.replace(/(-\d{3})\d+?$/, "$1");

	return cep;
}
export function formatToPhone(value: string): string {
	let formattedValue = value;
	if (!value) return "";
	formattedValue = formattedValue.replace(/\D/g, "");
	formattedValue = formattedValue.replace(/(\d{2})(\d)/, "($1) $2");
	formattedValue = formattedValue.replace(/(\d)(\d{4})$/, "$1-$2");
	return formattedValue;
}

export type TLocation = {
	cep?: string | null;
	uf: string;
	cidade: string;
	bairro?: string | null;
	endereco?: string | null;
	numeroOuIdentificador?: string | null;
	complemento?: string | null;
	latitude?: string | null;
	longitude?: string | null;
	// distancia: z.number().optional().nullable(),
};
export function formatLocation({
	location,
	includeUf,
	includeCity,
	includeCEP,
}: {
	location: TLocation;
	includeUf?: boolean;
	includeCity?: boolean;
	includeCEP?: boolean;
}) {
	let addressStr = "";
	if (includeCity && location.cidade)
		addressStr = addressStr + `${location.cidade}`;
	if (includeUf && location.uf)
		addressStr = location.endereco
			? addressStr + ` (${location.uf}), `
			: addressStr + ` (${location.uf})`;
	if (!location.endereco && !includeUf && !includeCity) return "";
	if (location.endereco) addressStr = addressStr + location.endereco;
	if (location.numeroOuIdentificador)
		addressStr = addressStr + `, Nº ${location.numeroOuIdentificador}`;
	if (location.bairro) addressStr = addressStr + `, ${location.bairro}`;
	if (location.latitude) addressStr = addressStr + `, LAT ${location.latitude}`;
	if (location.longitude)
		addressStr = addressStr + `, LONG ${location.longitude}`;
	if (includeCEP && location.cep)
		addressStr = addressStr + `, CEP:${location.cep}`;

	addressStr += ".";
	return addressStr.toUpperCase();
}

export function formatWithoutDiacritics(
	string: string,
	useUpperCase?: boolean,
) {
	if (!useUpperCase)
		return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return string
		.toUpperCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

export function formatLongString(str: string, size: number) {
	if (str.length > size) {
		return str.substring(0, size) + "\u2026";
	}
	return str;
}
export function formatExternalLink(str: string) {
	if (str.includes("http") || str.includes("https")) return str;
	return "https://" + str;
}

export function formatAsValidNumber(value: number | null | undefined) {
	if (isValidNumber(value)) return value as number;
	return null;
}
