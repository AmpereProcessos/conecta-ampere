import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TGetProjectsRouteOutput } from "@/app/api/projects/route";

export async function fetchProjects() {
	try {
		const { data } = await axios.get<TGetProjectsRouteOutput>("/api/projects");
		return data.data;
	} catch (error) {
		console.log("Error running fetchProjects", error);
		throw error;
	}
}

export function useProjectsQuery() {
	return useQuery({
		queryKey: ["projects"],
		queryFn: fetchProjects,
	});
}
