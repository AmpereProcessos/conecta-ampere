import dayjs from "dayjs";
import { formatDecimalPlaces } from "./formatting";

export function getAgeFromBirthdayDate(date: string | Date) {
	const age = dayjs().diff(date, "years");
	return age;
}

export function getMonthPeriodsStrings({
	initialYear,
	endYear,
}: { initialYear: number; endYear: number }) {
	let iteratingYear = initialYear;

	const periods: string[] = [];
	for (let i = 1; i <= 12; i++) {
		const str = i < 10 ? `0${i}/${iteratingYear}` : `${i}/${iteratingYear}`;

		periods.push(str);

		// Resetting month and adding up a year
		if (i === 12) {
			// If iterating year is end year and the month is 12, stop iteration
			if (iteratingYear === endYear) break;
			iteratingYear += 1;
			i = 0;
		}
	}
	return periods;
}
export function getDayStringsBetweenDates({
	initialDate,
	endDate,
	format,
}: { initialDate: string; endDate: string; format?: string }) {
	const strings = [];
	let iteratingDate = dayjs(initialDate);
	const goalDate = dayjs(endDate);

	while (
		iteratingDate.isBefore(goalDate) ||
		iteratingDate.isSame(goalDate, "day")
	) {
		const dayStr = iteratingDate.format(format || "DD/MM");
		strings.push(dayStr);
		iteratingDate = iteratingDate.add(1, "day");
	}

	return strings;
}
export function getHoursDiff({
	start,
	finish,
	businessOnly,
}: { start: string | Date; finish: string | Date; businessOnly?: boolean }) {
	// if (businessOnly) {
	//   // @ts-ignore
	//   const hourDiff = dayjs(finish).businessDiff(dayjs(start), 'hour')
	//   return hourDiff
	// }
	const hourDiff = dayjs(finish).diff(dayjs(start), "hour");
	return hourDiff;
}
export function getFixedDate(date: Date | string, type: "start" | "end") {
	if (type === "start")
		return dayjs(date).add(3, "hour").startOf("day").toDate() as Date;

	if (type === "end")
		return dayjs(date).add(3, "hour").endOf("day").toDate() as Date;

	return dayjs(date).startOf("day").subtract(3, "hour").toDate();
}

type GetPeriodDateParamsByReferenceDateParams = {
	reference: string | Date;
	type?: "month" | "year";
	resetStart?: boolean;
	resetEnd?: boolean;
};
export function getPeriodDateParamsByReferenceDate({
	reference,
	type = "month",
	resetStart,
	resetEnd,
}: GetPeriodDateParamsByReferenceDateParams) {
	if (type === "month") {
		let start = dayjs(reference).startOf("month");
		let end = dayjs(reference).endOf("month");
		if (resetStart) start = start.subtract(3, "hour");
		if (resetEnd) end = end.startOf("day").subtract(3, "hour");
		return { start: start.toDate(), end: end.toDate() };
	}
	if (type === "year") {
		let start = dayjs(reference).startOf("year");
		let end = dayjs(reference).endOf("year");
		if (resetStart) start = start.subtract(3, "hour");
		if (resetEnd) end = end.startOf("day").subtract(3, "hour");
		return { start: start.toDate(), end: end.toDate() };
	}

	// Default for month
	let start = dayjs(reference).startOf("month");
	let end = dayjs(reference).endOf("month");
	if (resetStart) start = start.subtract(3, "hour");
	if (resetEnd) end = end.startOf("day").subtract(3, "hour");
	return { start: start.toDate(), end: end.toDate() };
}

export function getDateFromString(value: any) {
	if (!value) return undefined;
	if (Number.isNaN(new Date(value).getMilliseconds())) return undefined;
	return new Date(value);
}
export function getDateIsWithinPeriod({
	date,
	after,
	before,
}: { date: Date | undefined; after: Date; before: Date }) {
	return !!(date && date >= after && date <= before);
}

export function getTimeFormattedTextFromHours(hours: number) {
	if (hours > 24) {
		const days = hours / 24;
		return `${formatDecimalPlaces(days)} ${days > 2 ? "DIAS" : "DIA"}`;
	}
	return `${formatDecimalPlaces(hours)} ${hours > 2 ? "HORAS" : "HORA"}`;
}

export function isDateOverdue({
	date,
	inRelationTo,
	useEndOfDay = false,
}: {
	date: Date | string | dayjs.Dayjs;
	inRelationTo: Date | string | dayjs.Dayjs;
	useEndOfDay?: boolean;
}) {
	const dateAsDayJs = dayjs(date);
	const inRelationToAsDayJs = dayjs(inRelationTo);
	if (!useEndOfDay) return dateAsDayJs.isBefore(inRelationToAsDayJs);
	return dateAsDayJs.endOf("day").isBefore(inRelationToAsDayJs);
}

export function getMetadataFromHoursAmount(
	hours: number,
	reference: "months" | "days" | "hours",
) {
	if (reference === "months") {
		const totalDays = Math.floor(hours / 24);
		const months = Math.floor(totalDays / 30); // Using 30 as average month length
		const remainingDays = totalDays % 30;
		return {
			complete: months,
			remaining: remainingDays,
			unit: "months" as const,
			remainingUnit: "days" as const,
		};
	}

	if (reference === "days") {
		const days = Math.floor(hours / 24);
		const remainingHours = hours % 24;
		return {
			complete: days,
			remaining: remainingHours,
			unit: "days" as const,
			remainingUnit: "hours" as const,
		};
	}

	// reference ==== 'hours'
	const completeHours = Math.floor(hours);
	const remainingMinutes = Math.round((hours - completeHours) * 60);
	return {
		complete: completeHours,
		remaining: remainingMinutes,
		unit: "hours" as const,
		remainingUnit: "minutes" as const,
	};
}

export function getFormattedTextFromHoursAmount({
	hours,
	reference,
	onlyComplete,
}: {
	hours: number;
	reference: "months" | "days" | "hours";
	onlyComplete: boolean;
}) {
	const metadata = getMetadataFromHoursAmount(hours, reference);
	const referenceMap = {
		months: {
			singular: "mês",
			plural: "meses,",
		},
		days: {
			singular: "dia",
			plural: "dias.",
		},
		hours: {
			singular: "hora",
			plural: "horas.",
		},
		minutes: {
			singular: "minuto",
			plural: "minutos.",
		},
	};

	const completeUnitFormatted = referenceMap[metadata.unit];
	const remainingUnitFormatted = referenceMap[metadata.remainingUnit];

	if (onlyComplete)
		return `${metadata.complete} ${metadata.complete > 1 ? completeUnitFormatted.plural : completeUnitFormatted.singular}`;
	return `${metadata.complete} ${metadata.complete > 1 ? completeUnitFormatted.plural : completeUnitFormatted.singular} e ${formatDecimalPlaces(metadata.remaining)} ${metadata.remaining > 1 ? remainingUnitFormatted.plural : remainingUnitFormatted.singular}`;
}
