import { Home, IdCard, LogOut, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/assets/svgs/ampere-blue-logo-icon.svg';
import type { TSessionUser } from '@/lib/authentication/types';
import { ThemeModeToggle } from '../themes/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

type UserHeaderProps = {
	sessionUser: TSessionUser;
};
function AdminUserHeader({ sessionUser }: UserHeaderProps) {
	return (
		<>
			<div className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-primary/20 bg-card p-3.5 shadow-sm">
				<div className="flex items-center gap-1.5">
					<div className="relative h-8 min-h-8 w-8 min-w-8 lg:h-8 lg:w-8">
						<Image alt="Logo Ampère Energias" fill={true} src={Logo} />
					</div>
					<h1 className="py-0.5 text-center font-medium text-primary/80 text-xs italic lg:text-base">CONECTA AMPÈRE</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<Button asChild variant="ghost">
						<Link href={'/dashboard'} prefetch={false}>
							<Home className="h-[1.2rem] w-[1.2rem]" />
						</Link>
					</Button>
					<ThemeModeToggle />
					<Button asChild variant="ghost">
						<Link href={'/logout'} prefetch={false}>
							<LogOut className="h-[1.2rem] w-[1.2rem]" />
						</Link>
					</Button>
				</div>
			</div>
			<div className="flex w-full flex-col items-center justify-between gap-3 rounded-lg border border-primary/20 bg-[#fff] bg-background p-3.5 shadow-sm lg:flex-row dark:bg-[#121212]">
				<div className="flex flex-col items-center gap-1.5 lg:flex-row">
					<Avatar className="h-12 min-h-12 w-12 min-w-12 lg:h-12 lg:w-12">
						<AvatarImage src={sessionUser.avatar_url || undefined} />
						<AvatarFallback className="text-xs">CN</AvatarFallback>
					</Avatar>
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">{sessionUser.nome}</h1>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-1.5 gap-y-0.5">
					{sessionUser.cpfCnpj ? (
						<div className="flex items-center gap-1">
							<IdCard className="h-4 min-h-4 w-4 min-w-46 lg:h-6 lg:w-6 lg:min-w-6 lg:min-w-h-6" />
							<h1 className="py-0.5 text-center font-medium text-[0.6rem] text-primary/80 italic lg:text-xs">{sessionUser.cpfCnpj || 'N/A'}</h1>
						</div>
					) : null}
					{sessionUser.telefone ? (
						<div className="flex items-center gap-1">
							<Phone className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6 lg:min-w-6 lg:min-w-h-6" />
							<h1 className="py-0.5 text-center font-medium text-[0.6rem] text-primary/80 italic lg:text-xs">{sessionUser.telefone || 'N/A'}</h1>
						</div>
					) : null}
					{sessionUser.email ? (
						<div className="flex items-center gap-1">
							<Mail className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6 lg:min-w-6 lg:min-w-h-6" />
							<h1 className="py-0.5 text-center font-medium text-[0.6rem] text-primary/80 italic lg:text-xs">{sessionUser.email || 'N/A'}</h1>
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

export default AdminUserHeader;
