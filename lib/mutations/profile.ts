import type { TUpdateUserProfileRouteInput, TUpdateUserProfileRouteOutput } from "@/app/api/configurations/profile/route";
import axios from "axios";

export async function updateProfile(info: TUpdateUserProfileRouteInput) {
	try {
		const { data } = await axios.put("/api/configurations/profile", info);
		const response = data as TUpdateUserProfileRouteOutput;
		return response;
	} catch (error) {
		console.log("Error running updateProfile", info);
		throw error;
	}
}
