"use server";
import FullScreenWrapper from "@/components/layout/FullScreenWrapper";
import TermsAndPrivacy from "@/components/LegalTerms";
import React from "react";
async function LegalTermsPage() {
	return (
		<FullScreenWrapper>
			<TermsAndPrivacy />
		</FullScreenWrapper>
	);
}

export default LegalTermsPage;
