'use server';
import LandingPage from '@/components/landing-page/LandingPage';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';

export default async function Home() {
	return (
		<FullScreenWrapper>
			<LandingPage />
		</FullScreenWrapper>
	);
}
