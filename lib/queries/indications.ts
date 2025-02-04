import type { TGetIndicationsRouteOutput } from "@/app/api/indications/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
