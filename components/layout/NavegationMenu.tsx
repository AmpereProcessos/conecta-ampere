'use client';
import { useQueryClient } from '@tanstack/react-query';
import { House, Settings, TicketCheck, UserRoundPlus, UsersRound } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import type { TAuthSession } from '@/lib/authentication/types';
import { cn } from '@/lib/utils';
import NewIndication from '../indications/modals/NewIndication';

type NavegationMenuProps = {
	sessionUser: TAuthSession['user'];
	initialIndicationSellerCode?: string;
};
function NavegationMenu({ sessionUser, initialIndicationSellerCode }: NavegationMenuProps) {
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const [isNewIndicationMenuOpen, setIsNewIndicationMenuOpen] = useQueryState('newIndicationIsOpen', parseAsBoolean);
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const handleNewIndicationOnMutate = async () => await queryClient.cancelQueries({ queryKey: ['indications'] });
	const handleNewIndicationOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ['indications'] });
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;

			// Only hide the menu if:
			// 1. The content is actually scrollable (document height > window height)
			// 2. We're near the bottom
			const isScrollable = documentHeight > windowHeight;
			const isNearBottom = windowHeight + currentScrollY >= documentHeight - 20;

			// Update visibility
			if (isScrollable && isNearBottom) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			setLastScrollY(currentScrollY);
		};

		// Run the check immediately on mount and add scroll listener
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		// Also add resize listener to handle window size changes
		window.addEventListener('resize', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	}, [lastScrollY]);
	return (
		<>
			<AnimatePresence>
				{isVisible ? (
					<div className="-translate-x-1/2 fixed bottom-8 left-1/2 z-50 flex w-fit min-w-[40%] max-w-[90%] items-center justify-center">
						<motion.div
							animate={{ y: 0, opacity: 1 }}
							className="flex w-full items-center justify-around gap-6 self-center rounded-full bg-background p-2 px-4 shadow-lg lg:gap-4 lg:px-12"
							exit={{ y: 100, opacity: 0 }}
							initial={{ y: 100, opacity: 0 }}
						>
							<Link
								className={cn(
									'flex aspect-square flex-col items-center justify-center gap-1 rounded-full text-primary/60 transition-all hover:text-blue-600',
									pathname.startsWith('/dashboard') && 'font-black text-blue-500'
								)}
								href="/dashboard"
							>
								<House className="h-3 w-3 lg:h-4 lg:w-4" />
								<div className="flex flex-col items-center">
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">MENU</span>
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">PRINCIPAL</span>
								</div>
							</Link>
							<Link
								className={cn(
									'flex aspect-square flex-col items-center justify-center gap-1 rounded-full text-primary/60 transition-all hover:text-blue-600',
									pathname.startsWith('/profile') && 'font-black text-blue-500'
								)}
								href="/profile"
							>
								<Settings className="h-3 w-3 lg:h-4 lg:w-4" />
								<div className="flex flex-col items-center">
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">MEU</span>
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">PERFIL</span>
								</div>
							</Link>

							{/* Center Button */}
							<NewIndicationButton openNewIndicationMenu={() => setIsNewIndicationMenuOpen(true)} sessionUser={sessionUser} />
							{/* End of Center Button */}
							<Link
								className={cn(
									'flex aspect-square flex-col items-center justify-center gap-1 rounded-full text-primary/60 transition-all hover:text-blue-600',
									pathname.startsWith('/indications') && 'font-black text-blue-500'
								)}
								href="/indications"
							>
								<UsersRound className="h-3 w-3 lg:h-4 lg:w-4" />
								<div className="flex flex-col items-center">
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">MINHAS</span>
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">INDICAÇÕES</span>
								</div>
							</Link>
							<Link
								className={cn(
									'flex aspect-square flex-col items-center justify-center gap-1 rounded-full text-primary/60 transition-all hover:text-blue-600',
									pathname.startsWith('/credits') && 'font-black text-blue-500'
								)}
								href="/credits"
							>
								<TicketCheck className="h-3 w-3 lg:h-4 lg:w-4" />
								<div className="flex flex-col items-center">
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">MEUS</span>
									<span className="font-bold text-[0.4rem] antialiased lg:text-[0.55rem]">RESGATES</span>
								</div>
							</Link>

							{/* <button type="button"></button> */}
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>

			{isNewIndicationMenuOpen ? (
				<NewIndication
					callbacks={{
						onMutate: handleNewIndicationOnMutate,
						onSettled: handleNewIndicationOnSettled,
					}}
					closeModal={() => setIsNewIndicationMenuOpen(false)}
					initialState={{
						codigoIndicacaoVendedor: initialIndicationSellerCode,
					}}
					sessionUser={sessionUser}
				/>
			) : null}
		</>
	);
}

export default NavegationMenu;

type NewIndicationProps = {
	sessionUser: TAuthSession['user'];
	openNewIndicationMenu: () => void;
};
function NewIndicationButton({ openNewIndicationMenu }: NewIndicationProps) {
	return (
		<button
			className="flex aspect-square w-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-full bg-blue-600 text-white transition-all hover:scale-105 hover:bg-[#15599a] lg:w-16"
			onClick={() => openNewIndicationMenu()}
			type="button"
		>
			<UserRoundPlus className="h-3 w-3 lg:h-5 lg:w-5" />
			<div className="-mt-1 flex flex-col items-center">
				<span className="font-bold text-[0.35rem] antialiased lg:text-[0.45rem]">NOVA</span>
				<span className="font-bold text-[0.35rem] antialiased lg:text-[0.45rem]">INDICAÇÃO</span>
			</div>
		</button>
	);
}
