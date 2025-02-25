import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import React from "react";
import SignUp from "./sign-up-page";

async function SignUpPage() {
	const { session, user } = await getCurrentSession();
	if (session || user) return redirect("/dashboard");
	return <SignUp />;
}

export default SignUpPage;
