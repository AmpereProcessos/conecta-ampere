import type { TGetUserCreditsBalanceRouteOutput } from "@/app/api/credits/balance/route";
import type { TGetCreditRedemptionRequestsRouteOutput } from "@/app/api/credits/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function fetchUserCreditsBalance() {
	try {
		const { data }: { data: TGetUserCreditsBalanceRouteOutput } = await axios.get("/api/credits/balance");

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

export async function fetchCreditRedemptionRequests() {
	try {
		const { data }: { data: TGetCreditRedemptionRequestsRouteOutput } = await axios.get("/api/credits");
		const requests = data.data.default;
		if (!requests) throw new Error("Oops, houve um erro desconhecido ao buscar as indicações.");
		return requests;
	} catch (error) {
		console.log("Error running fetchCreditRedemptionRequests", error);
		throw error;
	}
}
export function useCreditRedemptionRequestsQuery() {
	return useQuery({
		queryKey: ["credit-redemption-requests"],
		queryFn: fetchCreditRedemptionRequests,
	});
}
