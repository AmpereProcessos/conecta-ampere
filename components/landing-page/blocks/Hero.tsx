import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";
import { MuxAssetsConfig } from "@/configs/services/mux";
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
						<div className="w-full flex items-center justify-start">
							<Link href={"/signup"} className="bg-[#fead41] hover:bg-[#fead41]/90 text-[#15599a] w-fit px-6 py-3 rounded-full font-bold shadow-lg transition-colors mt-2">
								COMEÇE A INDICAR
							</Link>
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
								<MuxPlayer
									playbackId={MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.playbackId}
									metadata={{
										video_id: MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.videoId,
										video_title: MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.videoTitle,
									}}
									thumbnailTime={MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.thumbnailTime}
								/>
								{/* {showVideo ? (
									<MuxPlayer
										playbackId={MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.playbackId}
										metadata={{
											video_id: MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.videoId,
											video_title: MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.videoTitle,
										}}
									/>
								) : (
									<button
										type="button"
										className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none group"
										onClick={() => setShowVideo(true)}
										aria-label="Assistir vídeo de apresentação"
									>
										<Image src={IndicationProgram} alt="Programa de Indicações" fill={true} className="opacity-50" />
										<div className="bg-white/20 backdrop-blur-sm rounded-full p-6 border border-white/20 flex items-center justify-center transition group-hover:scale-105">
											<Play className="w-12 h-12 text-white fill-current drop-shadow-lg" />
										</div>
									</button>
								)} */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
