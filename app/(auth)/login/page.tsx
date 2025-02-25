import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import React from "react";
import Login from "./login-page";

async function LoginPage() {
	const { session, user } = await getCurrentSession();
	if (session || user) return redirect("/dashboard");
	return <Login />;
}

export default LoginPage;
