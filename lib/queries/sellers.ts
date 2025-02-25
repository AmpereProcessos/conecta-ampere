import type { TGetSellersRouteOutput } from "@/app/api/sellers/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function fetchSellerByIndicationCode(indicationCode: string) {
	try {
		const { data }: { data: TGetSellersRouteOutput } = await axios.get("/api/sellers", {
			params: { indicationCode },
		});

		return data.data.byIndicationCode;
	} catch (error) {
		console.log("Error running fetchSellerByIndicationCode", error);
		throw error;
	}
}

export function useSellerByIndicationCodeQuery(indicationCode: string) {
	return useQuery({
		queryKey: ["seller-by-indication-code", indicationCode],
		queryFn: async () => await fetchSellerByIndicationCode(indicationCode),
		retry: 1,
	});
}
