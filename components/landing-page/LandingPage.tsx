import React from "react";
import NavegationMenu from "./blocks/NavegationMenu";
import Header from "./blocks/Header";
import HowItWorks from "./blocks/HowItWorks";
import AboutUs from "./blocks/AboutUs";
import OurServices from "./blocks/OurServices";

function LandingPage() {
	return (
		<div className="w-full flex flex-col items-center py-16 gap-24">
			<NavegationMenu />
			<Header />
			<HowItWorks />
			<AboutUs />
			<OurServices />
		</div>
	);
}

export default LandingPage;
