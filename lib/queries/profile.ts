import type { TGetUserProfileRouteOutput } from "@/app/api/configurations/profile/route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export async function fetchUserProfile() {
	try {
		const { data }: { data: TGetUserProfileRouteOutput } = await axios.get("/api/configurations/profile");

		return data.data;
	} catch (error) {
		console.log("Error running fetchUserProfile", error);
		throw error;
	}
}

export function useUserProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: fetchUserProfile,
	});
}
