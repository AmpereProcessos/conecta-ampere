import type { TCreateCreditRedemptionRequestRouteInput, TCreateCreditRedemptionRequestRouteOutput } from "@/app/api/credits/route";
import axios from "axios";

export async function createCreditRedemptionRequest(info: TCreateCreditRedemptionRequestRouteInput) {
	try {
		const { data }: { data: TCreateCreditRedemptionRequestRouteOutput } = await axios.post("/api/credits", info);
		return data;
	} catch (error) {
		console.log("Error running createCreditRedemptionRequest", error);
		throw error;
	}
}
