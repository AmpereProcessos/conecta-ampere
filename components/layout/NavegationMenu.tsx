"use client";
import React, { useEffect, useRef, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
	Bell,
	Calendar,
	Grid,
	House,
	LayoutDashboard,
	Settings,
	TicketCheck,
	User,
	UserRoundPlus,
	Users,
	UsersRound,
} from "lucide-react";

import type { TAuthSession } from "@/lib/authentication/types";
import { useQueryClient } from "@tanstack/react-query";
import NewIndication from "../indications/modals/NewIndication";

type NavegationMenuProps = {
	sessionUser: TAuthSession["user"];
};
function NavegationMenu({ sessionUser }: NavegationMenuProps) {
	const queryClient = useQueryClient();
	const [newIndicationMenuIsOpen, setNewIndicationMenuIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const handleNewIndicationOnMutate = async () =>
		await queryClient.cancelQueries({ queryKey: ["indications"] });
	const handleNewIndicationOnSettled = async () =>
		await queryClient.invalidateQueries({ queryKey: ["indications"] });
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
		window.addEventListener("scroll", handleScroll, { passive: true });

		// Also add resize listener to handle window size changes
		window.addEventListener("resize", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [lastScrollY]);
	return (
		<>
			<AnimatePresence>
				{isVisible ? (
					<div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center justify-center min-w-[40%] max-w-[90%] w-fit">
						<motion.div
							initial={{ y: 100, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 100, opacity: 0 }}
							className="flex items-center justify-around gap-6 lg:gap-4 rounded-full bg-background shadow-lg self-center p-2 w-full px-4 lg:px-12"
						>
							<button
								type="button"
								className="flex flex-col items-center justify-center gap-1 rounded-full text-primary/60 aspect-square hover:text-blue-600 transition-all"
							>
								<House className="w-3 h-3 lg:w-4 lg:h-4" />
								<div className="flex flex-col items-center">
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										MENU
									</span>
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										PRINCIPAL
									</span>
								</div>
							</button>
							<button
								type="button"
								className="flex flex-col items-center justify-center gap-1 rounded-full text-primary/60 aspect-square hover:text-blue-600 transition-all"
							>
								<LayoutDashboard className="w-3 h-3 lg:w-4 lg:h-4" />
								<div className="flex flex-col items-center">
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										MEUS
									</span>
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										PROJETOS
									</span>
								</div>
							</button>

							{/* Center Button */}
							<NewIndicationButton
								sessionUser={sessionUser}
								openNewIndicationMenu={() => setNewIndicationMenuIsOpen(true)}
							/>
							{/* End of Center Button */}

							<button
								type="button"
								className="flex flex-col items-center justify-center gap-1 rounded-full text-primary/60 aspect-square hover:text-blue-600 transition-all"
							>
								<TicketCheck className="w-3 h-3 lg:w-4 lg:h-4" />
								<div className="flex flex-col items-center">
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										MEUS
									</span>
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										RESGATES
									</span>
								</div>
							</button>
							<button
								type="button"
								className="flex flex-col items-center justify-center gap-1 rounded-full text-primary/60 aspect-square hover:text-blue-600 transition-all"
							>
								<UsersRound className="w-3 h-3 lg:w-4 lg:h-4" />
								<div className="flex flex-col items-center">
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										MINHAS
									</span>
									<span className="text-[0.4rem] lg:text-[0.5rem] font-bold antialiased">
										INDICAÇÕES
									</span>
								</div>
							</button>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>

			{newIndicationMenuIsOpen ? (
				<NewIndication
					sessionUser={sessionUser}
					closeModal={() => setNewIndicationMenuIsOpen(false)}
					callbacks={{
						onMutate: handleNewIndicationOnMutate,
						onSettled: handleNewIndicationOnSettled,
					}}
				/>
			) : null}
		</>
	);
}

export default NavegationMenu;

type NewIndicationProps = {
	sessionUser: TAuthSession["user"];
	openNewIndicationMenu: () => void;
};
function NewIndicationButton({
	sessionUser,
	openNewIndicationMenu,
}: NewIndicationProps) {
	return (
		<>
			<button
				type="button"
				onClick={() => openNewIndicationMenu()}
				className="flex flex-col transition-all items-center justify-center gap-1 rounded-full bg-blue-600 text-white aspect-square w-12 lg:w-[4rem] hover:bg-[#15599a] hover:scale-105"
			>
				<UserRoundPlus className="w-3 h-3 lg:w-5 lg:h-5" />
				<div className="flex flex-col items-center -mt-1">
					<span className="text-[0.35rem] lg:text-[0.45rem] font-bold antialiased">
						NOVA
					</span>
					<span className="text-[0.35rem] lg:text-[0.45rem] font-bold antialiased">
						INDICAÇÃO
					</span>
				</div>
			</button>
		</>
	);
}
