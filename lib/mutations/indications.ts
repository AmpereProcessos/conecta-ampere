import type {
	TCreateIndicationRouteInput,
	TCreateIndicationRouteOutput,
} from "@/app/api/indications/route";
import { TIndication } from "@/schemas/indication.schema";
import axios from "axios";

export async function createIndication(info: TCreateIndicationRouteInput) {
	try {
		const { data } = await axios.post("/api/indications", info);
		const response = data as TCreateIndicationRouteOutput;
		return response;
	} catch (error) {
		console.log("Error running createIndication", info);
		throw error;
	}
}
