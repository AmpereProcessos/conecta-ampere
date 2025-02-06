import {
	deleteSessionTokenCookie,
	getCurrentSessionUncached,
} from "@/lib/authentication/session";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { session, user } = await getCurrentSessionUncached();
	if (!session && !user) {
		return new Response(null, {
			status: 400,
			headers: { Location: "/login" },
		});
	}

	// Deleting the session token cookie
	await deleteSessionTokenCookie();

	return new Response(null, {
		status: 302,
		headers: { Location: "/login" },
	});
}
