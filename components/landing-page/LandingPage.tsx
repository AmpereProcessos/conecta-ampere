import AboutUs from './blocks/AboutUs';
import Footer from './blocks/Footer';
import Hero from './blocks/Hero';
import HowItWorks from './blocks/HowItWorks';
import OurServices from './blocks/OurServices';
import WhyParticipate from './blocks/WhyParticipate';

function LandingPage() {
	return (
		<main className="flex w-full flex-col items-center bg-gray-50">
			<Hero />
			<HowItWorks />
			<WhyParticipate />
			<AboutUs />
			<OurServices />
			<Footer
				otherLinks={[
					{ label: 'Energia Solar', href: 'https://solar.ampereenergias.com.br?marketing_source=conecta' },
					{ label: 'Monitoramento Solar', href: 'https://solar.ampereenergias.com.br/monitoramento?marketing_source=conecta' },
					{ label: 'Consórcio de Energia', href: 'https://solar.ampereenergias.com.br/consorcio-energia?marketing_source=conecta' },
				]}
			/>
		</main>
	);
}

export default LandingPage;
