import UserHeader from "@/components/dashboard/UserHeader";
import IndicationsDatabase from "@/components/indications/dashboard/IndicationsDatabase";
import IndicationStats from "@/components/indications/dashboard/IndicationStats";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import NavegationMenu from "@/components/layout/NavegationMenu";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import React from "react";

async function IndicationsMainPage() {
	const { session, user } = await getCurrentSession();
	if (!session) return redirect("/login");
	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center px-6 lg:py-12 py-6 bg-background">
				<div className="flex flex-col gap-4 container">
					<UserHeader sessionUser={user} />
					<IndicationStats />
					<IndicationsDatabase sessionUser={user} />
					<NavegationMenu sessionUser={user} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}

export default IndicationsMainPage;
