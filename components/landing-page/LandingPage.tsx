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
		<div className="w-full flex flex-col items-center gap-24">
			<Hero />
			{/* <Header /> */}
			<HowItWorks />
			<WhyParticipate />
			<AboutUs />
			<OurServices />
			<Footer
				otherLinks={[
					{ label: "Energia Solar", href: "https://solar.ampereenergias.com.br" },
					{ label: "Monitoramento Solar", href: "https://solar.ampereenergias.com.br/monitoramento" },
					{ label: "Consórcio de Energia", href: "https://solar.ampereenergias.com.br/consorcio-energia" },
				]}
			/>
		</div>
	);
}

export default LandingPage;
