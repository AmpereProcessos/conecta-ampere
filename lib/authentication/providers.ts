import { Google } from "arctic";
import { env } from "node:process";
import { absoluteUrl } from "../utils";

export const google = new Google(
	env.GOOGLE_CLIENT_ID as string,
	env.GOOGLE_CLIENT_SECRET_KEY as string,
	absoluteUrl("/google/callback"),
);

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = "google_oauth_state";
export const GOOGLE_OAUTH_VERIFIER_COOKIE_NAME = "google_code_verifier";

export interface GoogleUserOpenIDConnect {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}
