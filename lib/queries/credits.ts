import type { TGetUserCreditsBalanceRouteOutput } from "@/app/api/credits/balance/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function fetchUserCreditsBalance() {
	try {
		const { data }: { data: TGetUserCreditsBalanceRouteOutput } =
			await axios.get("/api/credits/balance");

		return data.data;
	} catch (error) {
		console.log("Error running fetchUserCreditsBalance", error);
	}
}

export function useUserCreditsBalanceQuery() {
	return useQuery({
		queryKey: ["credits-balance"],
		queryFn: fetchUserCreditsBalance,
	});
}
