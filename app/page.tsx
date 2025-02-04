"use server";
import ReferEarn from "@/components/dashboard/ReferEarn";
import UserHeader from "@/components/dashboard/UserHeader";
import UserIndications from "@/components/dashboard/UserIndications";
import UserProjects from "@/components/dashboard/UserProjects";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import NavegationMenu from "@/components/layout/NavegationMenu";
import { ThemeModeToggle } from "@/components/themes/ThemeToggle";
import { getCurrentSession } from "@/lib/authentication/session";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
	const { session, user } = await getCurrentSession();

	if (!session) return redirect("/login");
	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center px-6 lg:py-12 py-6 bg-background">
				<div className="flex flex-col gap-4 container">
					<UserHeader sessionUser={user} />
					<UserProjects />
					<ReferEarn sessionUser={user} />
					<UserIndications />
					<NavegationMenu sessionUser={user} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}
