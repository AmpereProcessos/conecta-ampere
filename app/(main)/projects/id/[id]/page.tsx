import { redirect } from 'next/navigation';
import UserHeader from '@/components/dashboard/UserHeader';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import NavegationMenu from '@/components/layout/NavegationMenu';
import ProjectJourney from '@/components/projects/ProjectJourney';
import { getCurrentSession } from '@/lib/authentication/session';
import { getProjectJourneyById } from '@/lib/queries-server/projects';

export default async function ProjectById({ params }: { params: Promise<{ id: string }> }) {
	const { session, user } = await getCurrentSession();
	if (!session) return redirect('/login');

	const paramsValues = await params;
	const id = paramsValues.id;

	const project = await getProjectJourneyById(id);

	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center bg-background px-6 py-6 lg:py-12">
				<div className="container flex flex-col gap-4">
					<UserHeader sessionUser={user} />
					<ProjectJourney project={project} />
					<NavegationMenu sessionUser={user} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}
