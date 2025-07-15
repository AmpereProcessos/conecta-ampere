import React from "react";
import NavegationMenu from "./blocks/NavegationMenu";
import Header from "./blocks/Header";
import HowItWorks from "./blocks/HowItWorks";
import AboutUs from "./blocks/AboutUs";
import OurServices from "./blocks/OurServices";
import Hero from "./blocks/Hero";
import WhyParticipate from "./blocks/WhyParticipate";
import Footer from "./blocks/Footer";

function LandingPage() {
	return (
		<main className="w-full flex flex-col items-center bg-gray-50">
			<Hero />
			{/* <Header /> */}
			<HowItWorks />
			<WhyParticipate />
			<AboutUs />
			<OurServices />
			<Footer
				otherLinks={[
					{ label: "Energia Solar", href: "https://solar.ampereenergias.com.br?marketing_source=conecta" },
					{ label: "Monitoramento Solar", href: "https://solar.ampereenergias.com.br/monitoramento?marketing_source=conecta" },
					{ label: "Consórcio de Energia", href: "https://solar.ampereenergias.com.br/consorcio-energia?marketing_source=conecta" },
				]}
			/>
		</main>
	);
}

export default LandingPage;
