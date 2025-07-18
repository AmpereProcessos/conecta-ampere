'use server';
import { IdCard, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Logo from '@/assets/svgs/ampere-blue-logo-icon.svg';
import type { TAuthSession } from '@/lib/authentication/types';
import { ThemeModeToggle } from '../themes/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import HeaderIndicationBlock from './utils/HeaderIndicationBlock';

type UserHeaderProps = {
	sessionUser: TAuthSession['user'];
};
function UserHeader({ sessionUser }: UserHeaderProps) {
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-[#fff] bg-background p-3.5 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<Avatar className="h-6 min-h-6 w-6 min-w-6 lg:h-8 lg:w-8">
						<AvatarImage src={sessionUser.avatar_url || undefined} />
						<AvatarFallback className="text-xs">CN</AvatarFallback>
					</Avatar>
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">{sessionUser.nome}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<ThemeModeToggle />
					<Button asChild variant="ghost">
						<Link href={'/logout'} prefetch={false}>
							<LogOut className="h-[1.2rem] w-[1.2rem]" />
						</Link>
					</Button>
				</div>
			</div>
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1">
					<IdCard className="h-5 min-h-6 w-5 min-w-6 lg:h-6 lg:w-6" />
					<h1 className="py-0.5 text-center font-medium text-[0.6rem] text-primary/80 italic lg:text-xs">{sessionUser.cpfCnpj || 'N/A'}</h1>
				</div>
				<div className="flex items-center gap-1">
					<div className="relative h-5 min-h-6 w-5 min-w-6 lg:h-6 lg:w-6">
						<Image alt="Logo Ampère Energias" fill={true} src={Logo} />
					</div>
					<h1 className="py-0.5 text-center font-medium text-[0.6rem] text-primary/80 italic lg:text-xs">CONECTA AMPÈRE</h1>
				</div>
			</div>
			<HeaderIndicationBlock sessionUserId={sessionUser.id} />
		</div>
	);
}

export default UserHeader;
