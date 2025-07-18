import MuxPlayer from '@mux/mux-player-react';
import Link from 'next/link';
import { MuxAssetsConfig } from '@/configs/services/mux';

function Hero() {
	return (
		<section className="relative flex min-h-[80vh] w-full overflow-hidden bg-gradient-to-br from-[#15599a] via-[#1e6bb8] to-[#2575c7]" id="main">
			{/* Background Elements */}
			<div className="absolute inset-0">
				<div className="-translate-y-48 absolute top-0 right-0 h-96 w-96 translate-x-48 rounded-full bg-[#fead41]/10" />
				<div className="-translate-x-32 absolute bottom-0 left-0 h-64 w-64 translate-y-32 rounded-full bg-white/5" />
			</div>
			<div className="container relative z-10 mx-auto flex items-center justify-center px-4 py-6 lg:py-12">
				<div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
					{/* Content */}
					<div className="flex flex-col gap-6 text-white">
						<div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#fead41] px-4 py-2 font-bold text-[#15599a] text-sm">
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<title>Serviço Essencial</title>
								<path clipRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" fillRule="evenodd" />
							</svg>
							PROGRAMA DE INDICAÇÕES
						</div>

						<h1 className="font-bold text-5xl leading-tight lg:text-6xl">
							Faça parte do nosso <br />
							<span className="text-[#fead41]">Programa de Indicações</span> <br />
							{/* <span className="text-3xl lg:text-4xl font-medium">Potencialize seus ganhos enquanto ajuda amigos e familiares a descobrirem nossos serviços.</span> */}
						</h1>

						<p className="mb-8 max-w-2xl text-white/90 text-xl leading-relaxed">Aumente seus ganhos enquanto ajuda amigos e familiares a economizarem com a gente também.</p>
						<div className="flex w-full items-center justify-start">
							<Link className="mt-2 w-fit rounded-full bg-[#fead41] px-6 py-3 font-bold text-[#15599a] shadow-lg transition-colors hover:bg-[#fead41]/90" href={'/signup'}>
								COMEÇE A INDICAR
							</Link>
						</div>

						{/* Social Proof */}
						<div className="flex items-center gap-4 text-white/80">
							<div className="-space-x-2 flex">
								{[1, 2, 3, 4].map((i) => (
									<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#fead41]" key={i}>
										<span className="font-bold text-[#15599a] text-xs">👤</span>
									</div>
								))}
							</div>
							<span className="text-sm">+3000 clientes satisfeitos</span>
						</div>
					</div>
					<div className="relative">
						<div className="relative overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
							{/* Video Container */}
							<div className="flex aspect-video items-center justify-center bg-gradient-to-br from-orange-300 to-[#fead41]">
								<MuxPlayer
									metadata={{
										video_id: MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.videoId,
										video_title: MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.videoTitle,
									}}
									playbackId={MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.playbackId}
									thumbnailTime={MuxAssetsConfig.CONECTA_PROGRAM_PRESENTATION.thumbnailTime}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
