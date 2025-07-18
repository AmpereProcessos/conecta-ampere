import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';
import ProvidersWrapper from '@/components/Providers';

const raleway = Raleway({
	variable: '--font-raleway',
	subsets: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'],
});

export const metadata: Metadata = {
	title: 'Conecta Ampère',
	description: 'Sua plataforma Ampère Energias.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning={true}>
			<body className={`${raleway.variable} antialiased`} suppressHydrationWarning={true}>
				<ProvidersWrapper>
					<NuqsAdapter>{children}</NuqsAdapter>
				</ProvidersWrapper>
				<Toaster />
			</body>
		</html>
	);
}
