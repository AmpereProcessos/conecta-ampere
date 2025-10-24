'use client';
import { BadgeCheck, CirclePlus, LayoutGrid, Mail, MapPin, Phone, Share2, UserRound, Zap } from 'lucide-react';
import Image from 'next/image';
import { BsWhatsapp } from 'react-icons/bs';
import FullScreenWrapper from '@/components/layout/FullScreenWrapper';
import { Button } from '@/components/ui/button';
import type { TSessionUser } from '@/lib/authentication/types';
import { formatDecimalPlaces } from '@/lib/methods/formatting';
import { copyToClipboard, getProjectTypeCollors } from '@/lib/methods/utils';
import type { TGetSellerPublicProfileByIdOutput } from '@/lib/queries-server/sellers';
import { cn } from '@/lib/utils';

type SellerByIdPageProps = {
	seller: TGetSellerPublicProfileByIdOutput;
	sessionUser: TSessionUser | null;
};
export function SellerByIdPage({ seller, sessionUser }: SellerByIdPageProps) {
	const sellerName = seller?.vendedor?.nome || 'Vendedor Ampère';
	const sellerPhone = seller?.vendedor?.telefone || '';
	const sellerEmail = seller?.vendedor?.email || '';
	const sellerAvatar = seller?.vendedor?.avatarUrl || '';

	const whatsappHref = sellerPhone
		? `https://wa.me/55${sellerPhone.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20no%20Conecta%20Amp%C3%A8re.`
		: undefined;

	return (
		<FullScreenWrapper>
			<div className="flex h-full justify-center bg-background px-6 py-6 lg:py-12">
				<div className="container flex max-w-5xl flex-col gap-4">
					{/* Header */}
					<SellerHeaderDesktop
						sellerAvatar={sellerAvatar}
						sellerEmail={sellerEmail}
						sellerName={sellerName}
						sellerPhone={sellerPhone}
						sellerStats={{ projectsSold: seller?.estatisticas?.qtdeVendida ?? 0, powerSold: seller?.estatisticas?.potenciaVendida ?? 0 }}
						whatsappHref={whatsappHref || ''}
					/>
					<SellerHeaderMobile
						sellerAvatar={sellerAvatar}
						sellerEmail={sellerEmail}
						sellerName={sellerName}
						sellerPhone={sellerPhone}
						sellerStats={{ projectsSold: seller?.estatisticas?.qtdeVendida ?? 0, powerSold: seller?.estatisticas?.potenciaVendida ?? 0 }}
						whatsappHref={whatsappHref || ''}
					/>
					{/* Projetos */}
					<SellerProjects projects={seller?.projetos ?? []} />
				</div>
			</div>
		</FullScreenWrapper>
	);
}

type StatCardProps = { label: string; value: string | number; icon: React.ReactNode; className?: string };
function StatCard({ label, value, icon, className }: StatCardProps) {
	return (
		<div className={cn('flex w-full flex-col gap-1 rounded-xl border border-primary/20 bg-card px-3 py-4 shadow-xs', className)}>
			<div className="flex items-center justify-between">
				<h1 className="font-medium text-xs uppercase tracking-tight">{label}</h1>
				<div className="flex items-center gap-2">{icon}</div>
			</div>
			<div className="flex w-full flex-col">
				<div className="font-bold text-2xl text-[#15599a] dark:text-[#fead61]">{value}</div>
			</div>
		</div>
	);
}

type SellerProjectsProps = {
	projects: NonNullable<TGetSellerPublicProfileByIdOutput>['projetos'];
};
function SellerProjects({ projects }: SellerProjectsProps) {
	if (projects.length === 0) return null;
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<LayoutGrid className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">PROJETOS</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				{projects?.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
		</div>
	);
}

type ProjectCardProps = {
	project: NonNullable<TGetSellerPublicProfileByIdOutput>['projetos'][number];
};
function ProjectCard({ project }: ProjectCardProps) {
	return (
		<div className="flex w-full flex-col overflow-hidden rounded-lg border border-primary/20 bg-white shadow-xs dark:bg-[#121212]">
			<div className="relative h-40 w-full bg-accent/30">
				{project.imagemCapaUrl ? (
					<Image alt={`Imagem do projeto ${project.id}`} className="object-cover" fill={true} sizes="(max-width: 768px) 100vw, 50vw" src={project.imagemCapaUrl} />
				) : (
					<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
						<span className="font-semibold text-primary/60">Projeto Ampère</span>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-2 p-3">
				<div className="flex items-center justify-between">
					<div className={cn('flex items-center gap-1 rounded-lg px-2 py-0.5 text-center font-bold text-[0.65rem] italic', getProjectTypeCollors(project.tipo))}>{project.tipo}</div>
				</div>
				<div className="flex items-center gap-1 text-primary/80">
					<MapPin className="h-4 w-4" />
					<span className="text-xs lg:text-sm">
						{project.localizacaoCidade} - {project.localizacaoUF}
					</span>
				</div>
				{project.indexador ? <span className="text-[0.65rem] text-primary/70 lg:text-xs">Índice: {project.indexador}</span> : null}
			</div>
		</div>
	);
}

type SellerHeaderProps = {
	sellerName: string;
	sellerAvatar: string;
	sellerEmail: string;
	sellerPhone: string;
	sellerStats: {
		projectsSold: number;
		powerSold: number;
	};
	whatsappHref: string;
};
function SellerHeaderMobile({ sellerName, sellerAvatar, sellerEmail, sellerStats, whatsappHref }: SellerHeaderProps) {
	return (
		<div className="lg:hidden">
			<div className="flex w-full flex-col gap-3 rounded-2xl border border-primary/20 bg-white p-2.5 shadow-xs dark:bg-[#121212]">
				<div className="relative h-96 w-full overflow-hidden rounded-xl bg-accent/30">
					{sellerAvatar ? (
						<Image alt={sellerName} className="object-cover" fill={true} sizes="100vw" src={sellerAvatar} />
					) : (
						<div className="flex h-full w-full items-center justify-center bg-primary/50 text-primary-foreground">
							<UserRound className="h-7 w-7" />
						</div>
					)}
				</div>
				<div className="flex flex-col gap-1 px-1">
					<div className="flex items-center gap-1.5">
						<h2 className="font-semibold text-base leading-none tracking-tight">{sellerName}</h2>
						<BadgeCheck className="h-4 w-4 text-green-600" />
					</div>
					<p className="text-primary/70 text-sm">Especialista em soluções de energia solar.</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-1.5 px-1 pb-1">
					<div className="flex items-center gap-3 text-primary/80">
						<div className="flex items-center gap-1 text-xs">
							<LayoutGrid className="h-4 w-4" />
							<span>{sellerStats.projectsSold}</span>
						</div>
						<div className="flex items-center gap-1 text-xs">
							<Zap className="h-4 w-4" />
							<span>{formatDecimalPlaces(sellerStats.powerSold, 2)} kWp</span>
						</div>
					</div>
					<div className="flex items-center gap-3">
						{sellerEmail ? (
							<Button asChild size="fit" variant="ghost">
								<a aria-label="Enviar e-mail" href={`mailto:${sellerEmail}`} rel="noopener noreferrer" target="_blank">
									<Mail className="h-4 w-4" />
								</a>
							</Button>
						) : null}
						<Button
							aria-label="Compartilhar"
							onClick={async () => await copyToClipboard(typeof window !== 'undefined' ? window.location.href : '')}
							size="fit"
							type="button"
							variant="ghost"
						>
							<Share2 className="h-4 w-4" />
						</Button>
						{whatsappHref ? (
							<Button asChild className="bg-green-600 hover:bg-green-700" size="sm" variant="default">
								<a href={whatsappHref} rel="noopener noreferrer" target="_blank">
									<BsWhatsapp className="h-4 w-4" />
									FALAR +
								</a>
							</Button>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

function SellerHeaderDesktop({ sellerName, sellerAvatar, sellerEmail, sellerPhone, sellerStats, whatsappHref }: SellerHeaderProps) {
	return (
		<div className="hidden w-full flex-col gap-4 lg:flex">
			<div className="flex w-full flex-col gap-3 rounded-md border border-primary/20 bg-white p-2.5 shadow-xs lg:flex-row dark:bg-[#121212]">
				<div className="relative h-25 max-h-25 min-h-25 w-25 min-w-25 max-w-25 overflow-hidden rounded-lg">
					{sellerAvatar ? (
						<Image alt={sellerName} fill={true} objectFit="cover" src={sellerAvatar} />
					) : (
						<div className="flex h-full w-full items-center justify-center bg-primary/50 text-primary-foreground">
							<UserRound className="h-6 w-6" />
						</div>
					)}
				</div>
				<div className="flex h-full grow flex-col justify-between gap-2 p-2">
					<div className="flex flex-col gap-1">
						<h1 className="font-black text-base leading-none tracking-tight lg:text-xl">{sellerName}</h1>
						<p className="text-primary/70 text-sm">Portfólio público do vendedor(a) Ampère Energias</p>
					</div>
					<div className="flex w-full flex-col items-center justify-between gap-1.5 lg:flex-row">
						<div className="flex items-center gap-1.5">
							<Phone className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
							<h1 className="text-primary/70 text-sm">{sellerPhone}</h1>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
							{sellerEmail ? (
								<Button asChild size="sm" variant="ghost">
									<a href={`mailto:${sellerEmail}`} rel="noopener noreferrer" target="_blank">
										<Mail className="h-4 w-4" />
										ENVIAR E-MAIL
									</a>
								</Button>
							) : null}
							<Button onClick={async () => await copyToClipboard(typeof window !== 'undefined' ? window.location.href : '')} size="sm" type="button" variant="ghost">
								<Share2 className="h-4 w-4" />
								COMPARTILHAR
							</Button>
							{whatsappHref ? (
								<Button asChild className="bg-green-600 hover:bg-green-700" size="sm" variant="default">
									<a href={whatsappHref} rel="noopener noreferrer" target="_blank">
										<Phone className="h-4 w-4" />
										FALAR NO WHATSAPP
									</a>
								</Button>
							) : null}
						</div>
					</div>
				</div>
			</div>

			<div className="flex w-full flex-col items-center gap-2 lg:flex-row">
				<StatCard className="w-full lg:w-1/2" icon={<CirclePlus className="h-4 w-4" />} label="Projetos vendidos" value={sellerStats.projectsSold} />
				<StatCard className="w-full lg:w-1/2" icon={<Zap className="h-4 w-4" />} label="Potência vendida (kWp)" value={`${formatDecimalPlaces(sellerStats.powerSold, 2)} kWp`} />
			</div>
		</div>
	);
}
