'use server';
import { redirect } from 'next/navigation';
import IndicationsRanking from '@/components/dashboard/Ranking';
import ReferEarn from '@/components/dashboard/ReferEarn';
import UserCreditsBalance from '@/components/dashboard/UserCreditsBalance';
import UserHeader from '@/components/dashboard/UserHeader';
import UserIndications from '@/components/dashboard/UserIndications';
import UserProjects from '@/components/dashboard/UserProjects';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import NavegationMenu from '@/components/layout/NavegationMenu';
import { getCurrentSession } from '@/lib/authentication/session';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ indicationSellerCode: string }> }) {
	const { indicationSellerCode } = await searchParams;
	const { session, user } = await getCurrentSession();
	console.log({ session, user });
	if (!session) return redirect('/login');
	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center bg-background px-6 py-6 lg:py-12">
				<div className="container flex flex-col gap-4">
					<UserHeader sessionUser={user} />
					<UserCreditsBalance sessionUser={user} />
					<UserProjects />
					<ReferEarn sessionUser={user} />
					<IndicationsRanking sessionUser={user} />
					<UserIndications />
					<NavegationMenu initialIndicationSellerCode={indicationSellerCode} sessionUser={user} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}
