import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/ThemeProvider";
import { Toaster } from "sonner";
import ProvidersWrapper from "@/components/Providers";

const raleway = Raleway({
	variable: "--font-raleway",
	subsets: ["cyrillic", "cyrillic-ext"],
});

export const metadata: Metadata = {
	title: "Conecta Ampère",
	description: "Sua plataforma Ampère Energias.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning={true}>
			<body
				className={`${raleway.variable} antialiased`}
				suppressHydrationWarning={true}
			>
				<ProvidersWrapper>{children}</ProvidersWrapper>
				<Toaster />
			</body>
		</html>
	);
}
