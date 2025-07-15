import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import IndicationProgram from "@/assets/landing-page/indication-program.svg";
import Image from "next/image";

async function Hero() {
	return (
		<section id="main" className="w-full relative min-h-[80vh] flex overflow-hidden bg-gradient-to-br from-[#15599a] via-[#1e6bb8] to-[#2575c7]">
			{/* Background Elements */}
			<div className="absolute inset-0">
				<div className="absolute top-0 right-0 w-96 h-96 bg-[#fead41]/10 rounded-full -translate-y-48 translate-x-48" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />
			</div>
			<div className="container mx-auto px-4 relative z-10 flex items-center justify-center py-6 lg:py-12">
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Content */}
					<div className="text-white flex flex-col gap-6">
						<div className="w-fit inline-flex items-center gap-2 bg-[#fead41] text-[#15599a] px-4 py-2 rounded-full text-sm font-bold mb-6">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<title>Serviço Essencial</title>
								<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
							</svg>
							PROGRAMA DE INDICAÇÕES
						</div>

						<h1 className="text-5xl lg:text-6xl font-bold leading-tight">
							Faça parte do nosso <br />
							<span className="text-[#fead41]">Programa de Indicações</span> <br />
							{/* <span className="text-3xl lg:text-4xl font-medium">Potencialize seus ganhos enquanto ajuda amigos e familiares a descobrirem nossos serviços.</span> */}
						</h1>

						<p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">Aumente seus ganhos enquanto ajuda amigos e familiares a economizarem com a gente também.</p>

						{/* Stats */}
						{/* <div className="grid grid-cols-3 gap-6 mb-8">
							<div className="text-center">
								<div className="text-3xl font-bold text-[#fead41] mb-1">24/7</div>
								<div className="text-sm text-white/80">Monitoramento</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-[#fead41] mb-1">98%</div>
								<div className="text-sm text-white/80">Detecção de Falhas</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-[#fead41] mb-1">+30%</div>
								<div className="text-sm text-white/80">Vida Útil</div>
							</div>
						</div> */}
						<div className="w-full flex items-center justify-start">
							<Button size={"lg"} className="w-fit bg-[#fead41] text-[#15599a] hover:bg-[#fead41]/80 font-bold">
								COMEÇE A INDICAR
							</Button>
						</div>

						{/* Social Proof */}
						<div className="flex items-center gap-4 text-white/80">
							<div className="flex -space-x-2">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="w-8 h-8 bg-[#fead41] rounded-full border-2 border-white flex items-center justify-center">
										<span className="text-xs font-bold text-[#15599a]">👤</span>
									</div>
								))}
							</div>
							<span className="text-sm">+3000 clientes satisfeitos</span>
						</div>
					</div>
					<div className="relative">
						<div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
							{/* Video Container */}
							<div className="aspect-video bg-gradient-to-br from-orange-300 to-[#fead41] flex items-center justify-center">
								<video className="w-full h-full object-cover" controls poster="/placeholder.svg?height=400&width=600" preload="metadata">
									<source src="/placeholder-video.mp4" type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							</div>

							{/* Video Overlay for Demo */}
							<div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 to-[#fead41]/20 flex items-center justify-center">
								<div className="bg-white/10 backdrop-blur-sm rounded-full p-6 border border-white/20">
									<Play className="w-12 h-12 text-white fill-current" />
								</div>
								<Image src={IndicationProgram} alt="Programa de Indicações" fill={true} className="opacity-50" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
