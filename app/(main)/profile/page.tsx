import UserHeader from "@/components/dashboard/UserHeader";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import NavegationMenu from "@/components/layout/NavegationMenu";
import UserProfileConfig from "@/components/profile/dashboard/UserProfileConfig";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";

async function ProfileMainPage() {
	const { session, user } = await getCurrentSession();
	if (!session) return redirect("/login");

	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center px-6 lg:py-12 py-6 bg-background">
				<div className="flex flex-col gap-4 container">
					<UserHeader sessionUser={user} />
					<UserProfileConfig sessionUser={user} />
					<NavegationMenu sessionUser={user} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}

export default ProfileMainPage;
