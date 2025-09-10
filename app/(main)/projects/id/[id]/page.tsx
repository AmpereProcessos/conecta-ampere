import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/authentication/session';
import { getProjectJourneyById } from '@/lib/queries-server/projects';

export async function ProjectById({ params }: { params: Promise<{ id: string }> }) {
	const { session } = await getCurrentSession();
	if (!session) return redirect('/login');

	const paramsValues = await params;
	const id = paramsValues.id;

	const project = await getProjectJourneyById(id);

	return <div>{project.nome}</div>;
}
