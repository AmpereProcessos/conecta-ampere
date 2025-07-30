import { redirect } from 'next/navigation';
import CreditRedemptionRequests from '@/components/credits/dashboard/CreditRedemptionRequests';
import UserCreditsBalance from '@/components/dashboard/UserCreditsBalance';
import UserHeader from '@/components/dashboard/UserHeader';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import NavegationMenu from '@/components/layout/NavegationMenu';
import { getCurrentSession } from '@/lib/authentication/session';

export default async function CreditsMainPage() {
	const { session, user } = await getCurrentSession();
	if (!session) return redirect('/login');

	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center bg-background px-6 py-6 lg:py-12">
				<div className="container flex flex-col gap-4">
					<UserHeader sessionUser={user} />
					<UserCreditsBalance sessionUser={user} />
					<CreditRedemptionRequests sessionUser={user} />
					<NavegationMenu sessionUser={user} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}
