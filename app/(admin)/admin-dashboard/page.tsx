import { redirect } from 'next/navigation';
import AdminProgramStats from '@/components/admin-dashboard/ProgramStats';
import AdminUserHeader from '@/components/admin-dashboard/UserHeader';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import { getCurrentSession } from '@/lib/authentication/session';

export default async function AdminDashboard() {
	const { session, user } = await getCurrentSession();
	if (!session) return redirect('/login');
	if (!user.admin) return redirect('/dashboard');

	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center bg-background px-6 py-6 lg:py-12">
				<div className="container flex flex-col gap-4">
					<AdminUserHeader sessionUser={user} />
					<AdminProgramStats />
				</div>
			</div>
		</FullScreenWrapper>
	);
}
