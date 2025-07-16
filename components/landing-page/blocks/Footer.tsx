import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import HorizontalLogo from "@/assets/svgs/ampere-horizontal-white-logo-with-text.svg";
import Image from "next/image";
import Link from "next/link";

type LandingPageFooterProps = {
	otherLinks: {
		label: string;
		href: string;
	}[];
};
function Footer({ otherLinks }: LandingPageFooterProps) {
	return (
		<footer className="bg-[#15599a] text-white w-full">
			<div className="container mx-auto px-4 py-12">
				<div className="grid md:grid-cols-3 gap-8">
					{/* Logo and Description */}
					<div className="md:col-span-1">
						<div className="relative h-16 w-32">
							<Image src={HorizontalLogo} alt="Ampère Energias Logo" fill={true} />
						</div>
						<p className="text-blue-100 mb-4 text-sm leading-relaxed">Conte com a tecnologia e atendimento reconhecido da Ampère Energias para a instalação da sua Energia Solar.</p>
						<div className="text-blue-100 text-sm">
							<p className="font-medium">Email:</p>
							<p>marketing@solarampereenergia.com.br</p>
						</div>
					</div>

					{/* Endereços */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-[#fead41]">Endereço</h3>
						<div className="space-y-4 text-blue-100 text-sm">
							<div>
								<p className="font-medium text-white mb-1">Matriz</p>
								<p>Av. 9, nº 833, Centro, Ituiutaba/MG</p>
								<p>Cep: 38300-150 - Tel: (34) 3700-7001</p>
							</div>

							<div>
								<p className="font-medium text-white mb-1">Unidade Uberlândia</p>
								<p>Av Cesário Alvim, 3550 - Brasil,</p>
								<p>Uberlândia - MG - Cep: 38400-656 - Tel: (34) 3212-2680</p>
							</div>

							<div>
								<p className="font-medium text-white mb-1">Unidade Rio Verde</p>
								<p>R. Osório Coelho de Moraes, 87 - Setor Centro,</p>
								<p>Rio Verde - GO - Cep: 75901-020 - Tel: (64) 99218-3771</p>
							</div>
						</div>
					</div>

					{/* Contato */}
					<div>
						<h3 className="text-lg font-semibold mb-4 text-[#fead41]">Outros</h3>
						<ul className="space-y-2 text-blue-100 text-sm">
							<li>
								<Link href="/legal" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
									- Política de Privacidade
								</Link>
							</li>
							<li>
								<a href="https://www.ampereenergias.com.br/informacoes" className="hover:text-white transition-colors">
									- Blog da Ampère
								</a>
							</li>
							{otherLinks.map((link) => (
								<li key={link.label}>
									<Link href={link.href} className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
										- {link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="border-t border-blue-400 mt-8 pt-6 text-center text-blue-100 text-sm">
					<p>Copyright 2025 - Ampère Energias | Todos os direitos reservados.</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
