"use client";
import type { TGetIndicationsDatabaseRouteOutput } from "@/app/api/indications/database/route";
import type { TGetIndicationsRouteOutput } from "@/app/api/indications/route";
import type { TGetIndicationStatsRouteOutput } from "@/app/api/indications/stats/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export async function fetchIndications() {
	try {
		const { data }: { data: TGetIndicationsRouteOutput } =
			await axios.get("/api/indications");
		const indications = data.data.default;
		if (!indications)
			throw new Error(
				"Oops, houve um erro desconhecido ao buscar as indicações.",
			);
		return indications;
	} catch (error) {
		console.log("Error running fetchIndications", error);
		throw error;
	}
}
export function useIndicationsQuery() {
	return useQuery({
		queryKey: ["indications"],
		queryFn: fetchIndications,
	});
}

type TUseIndicationByIdQueryParams = {
	id: string;
};
export async function fetchIndicationById({
	id,
}: TUseIndicationByIdQueryParams) {
	try {
		const { data }: { data: TGetIndicationsRouteOutput } = await axios.get(
			`/api/indications?id=${id}`,
		);
		const indication = data.data.byId;
		if (!indication)
			throw new Error(
				"Oops, houve um erro desconhecido ao buscar a indicação.",
			);
		return indication;
	} catch (error) {
		console.log("Error running fetchIndicationById", error);
		throw error;
	}
}

export function useIndicationByIdQuery({ id }: TUseIndicationByIdQueryParams) {
	return useQuery({
		queryKey: ["indication-by-id", id],
		queryFn: async () => await fetchIndicationById({ id }),
	});
}

export async function fetchIndicationStats() {
	try {
		const { data }: { data: TGetIndicationStatsRouteOutput } = await axios.get(
			"/api/indications/stats",
		);

		return data.data;
	} catch (error) {
		console.log("Error running fetchIndicationStats", error);
		throw error;
	}
}

export function useIndicationStatsQuery() {
	return useQuery({
		queryKey: ["indication-stats"],
		queryFn: async () => await fetchIndicationStats(),
	});
}

export async function fetchIndicationsDatabase(page: number) {
	try {
		const { data }: { data: TGetIndicationsDatabaseRouteOutput } =
			await axios.get(`/api/indications/database?page=${page}`);

		return data.data;
	} catch (error) {
		console.log("Error running fetchIndicationsDatabase", error);
		throw error;
	}
}

export function useIndicationsDatabaseQuery() {
	const [params, setParams] = useState({
		page: 1,
	});

	function updateParams(changes: Partial<typeof params>) {
		setParams((prev) => ({ ...prev, ...changes }));
	}

	const query = useQuery({
		queryKey: ["indications-database", params],
		queryFn: async () => fetchIndicationsDatabase(params.page),
	});
	return { ...query, params, updateParams };
}
