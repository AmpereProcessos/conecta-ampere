"use client";
import React, { useState } from "react";
import { UsersRound } from "lucide-react";
import { FaBolt, FaSolarPanel } from "react-icons/fa";
import type { TSaleCategoryEnum } from "@/schemas/enums.schema";
import { useQueryClient } from "@tanstack/react-query";
import type { TAuthSession } from "@/lib/authentication/types";
import { ReferEarnOptions } from "@/configs/constants";

type NewIndicationMenuState = {
	isOpen: boolean;
	projectType: {
		id: string;
		title: string;
		saleCategory: TSaleCategoryEnum;
	} | null;
};

type ReferEarnProps = {
	sessionUser: TAuthSession["user"];
};
function ReferEarn({ sessionUser }: ReferEarnProps) {
	const queryClient = useQueryClient(); // Use the query client to cancel and invalidate queries
	const [newIndicationMenu, setNewIndicationMenu] =
		useState<NewIndicationMenuState>({
			isOpen: false,
			projectType: null,
		});

	const handleNewIndicationOnMutate = async () =>
		await queryClient.cancelQueries({ queryKey: ["indications"] });
	const handleNewIndicationOnSettled = async () =>
		await queryClient.invalidateQueries({ queryKey: ["indications"] });
	return (
		<div className="bg-[#fff] dark:bg-[#121212] w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UsersRound className="w-4 h-4 lg:w-6 lg:h-6 min-w-4 min-h-4" />
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">
						INDIQUE E GANHE
					</h1>
				</div>
			</div>
			<div className="w-full">
				<p className="text-[0.625rem] lg:text-sm">
					<span className="font-normal">
						Indique nossos produtos para familiares, amigos ou conhecidos e
						GANHE{" "}
					</span>
					<span className="text-[#FB2E9F] font-bold inline-flex items-center gap-0.5">
						<FaBolt className="w-2 h-2 lg:w-4 lg:h-4" />
						CRÉDITOS AMPÈRE
					</span>
				</p>
			</div>
			<div className="w-full grid grid-cols-2 lg:flex items-center justify-center grow py-3 px-0 lg:px-6 gap-1.5 lg:flex-wrap">
				{ReferEarnOptions.map((option) => (
					<button
						type="button"
						onClick={() =>
							setNewIndicationMenu({
								isOpen: true,
								projectType: {
									id: option.projectTypeId,
									title: option.projectType,
									saleCategory: option.projectTypeSaleCategory,
								},
							})
						}
						key={`${option.id}-${option.projectTypeId}`}
						className="flex hover:bg-blue-200 duration-300 ease-in-out flex-col items-center justify-center gap-1 p-2 lg:p-8 bg-blue-100 text-[#15599a] rounded-lg aspect-video sm:aspect-auto"
					>
						<FaSolarPanel className="w-6 h-6 lg:w-12 lg:h-12 min-w-4 min-h-4" />
						<h1 className="font-bold text-[0.55rem] lg:text-lg tracking-tight text-center uppercase break-words">
							{option.referEarnCall}
						</h1>
					</button>
				))}
			</div>
			{/* {newIndicationMenu.isOpen && newIndicationMenu.projectType ? (
				<NewIndication
					projectType={newIndicationMenu.projectType}
					sessionUser={sessionUser}
					closeModal={() =>
						setNewIndicationMenu({ isOpen: false, projectType: null })
					}
					callbacks={{
						onMutate: handleNewIndicationOnMutate,
						onSettled: handleNewIndicationOnSettled,
					}}
				/>
			) : null} */}
		</div>
	);
}

export default ReferEarn;
