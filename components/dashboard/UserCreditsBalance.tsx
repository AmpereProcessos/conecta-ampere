'use client';
import { useQueryClient } from '@tanstack/react-query';
import { TicketCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { FaBolt } from 'react-icons/fa';
import type { TAuthSession } from '@/lib/authentication/types';
import { getErrorMessage } from '@/lib/methods/errors';
import { useUserCreditsBalanceQuery } from '@/lib/queries/credits';
import { useRewardOptionsQuery } from '@/lib/queries/reward-options';
import NewCreditRedemptionRequest from '../credits/modals/NewCreditRedemptionRequest';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { Skeleton } from '../ui/skeleton';

type TNewCreditRedemptionRequestMenuState = {
	isOpen: boolean;
	reward: {
		id: string;
		label: string;
		requiredCredits: number;
	} | null;
};
type UserCreditsBalanceProps = {
	sessionUser: TAuthSession['user'];
};
function UserCreditsBalance({ sessionUser }: UserCreditsBalanceProps) {
	const queryClient = useQueryClient();
	const [newRequestMenu, setNewRequestMenu] = useState<TNewCreditRedemptionRequestMenuState>({
		isOpen: false,
		reward: null,
	});
	const { data } = useUserCreditsBalanceQuery();
	const { data: rewardOptions, isLoading, isError, isSuccess, error } = useRewardOptionsQuery();

	const handleNewRequestOnMutate = async () =>
		await queryClient.cancelQueries({
			queryKey: ['credits-balance'],
		});
	const handleNewRequestOnSettled = async () =>
		await queryClient.invalidateQueries({
			queryKey: ['credits-balance'],
		});
	return (
		<div className="flex w-full flex-col rounded-lg border border-[#FB2E9F] bg-[#FB2E9F]/20 p-3.5 shadow-xs">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="font-bold text-[#FB2E9F] text-sm leading-none tracking-tight lg:text-lg">MEUS CRÉDITOS AMPÈRE</h1>
				</div>
			</div>
			<div className="flex w-full items-end justify-between gap-1.5">
				<div className="flex items-center gap-1.5 text-[#FB2E9F]">
					<h1 className="font-black text-4xl">{data?.balance || 0}</h1>
					<FaBolt size={22} />
				</div>
			</div>
			<div className="w-full">
				<p className="text-[0.625rem] lg:text-sm">
					<span className="font-normal">Escolha uma recompensa e resgate seus</span>
					<span className="inline-flex items-center gap-0.5 font-bold text-[#FB2E9F]">
						<FaBolt className="h-2 w-2 lg:h-4 lg:w-4" />
						CRÉDITOS
					</span>
				</p>
			</div>
			<div className="flex w-full flex-col gap-2 px-4">
				<Carousel
					opts={{
						align: 'start',
						loop: false,
						dragFree: true,
						containScroll: 'trimSnaps',
					}}
				>
					<CarouselContent className="-ml-2 p-3">
						{isLoading
							? [0, 1, 2].map((item) => (
									<CarouselItem className="basis-[calc(33.333%-0.5rem)] pl-2 sm:basis-[calc(30%-0.5rem)]" key={item}>
										<Skeleton className="h-[150px] w-full rounded-lg" />
									</CarouselItem>
								))
							: null}
						{isError ? (
							<div className="flex w-full items-center justify-center">
								<p className="text-red-500 text-sm">{getErrorMessage(error)}</p>
							</div>
						) : null}
						{isSuccess
							? rewardOptions?.map((option) => (
									<CarouselItem className="basis-[calc(33.333%-0.5rem)] pl-2 sm:basis-[calc(30%-0.5rem)]" key={option._id}>
										<button
											className="relative flex h-[150px] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-transparent p-2 transition-all duration-300 ease-in-out hover:border-primary lg:h-[250px] lg:p-8"
											onClick={() =>
												setNewRequestMenu({
													isOpen: true,
													reward: {
														id: option._id,
														label: option.titulo,
														requiredCredits: option.creditosNecessarios,
													},
												})
											}
											type="button"
										>
											{option.imagemCapaUrl && (
												<>
													<Image
														alt={`Imagem de capa da recompensa: ${option.titulo}`}
														className="absolute inset-0 rounded-lg object-cover"
														fill
														sizes="(max-width: 768px) 33.333vw, 30vw"
														src={option.imagemCapaUrl}
													/>
													<div className="absolute inset-0 rounded-lg bg-black/40" />
												</>
											)}
											<div className="relative z-10 flex flex-col items-center gap-1">
												<TicketCheck className="h-6 min-h-4 w-6 min-w-4 lg:h-12 lg:min-h-12 lg:w-12 lg:min-w-12" />
												<h1 className="break-words text-center font-bold text-[0.55rem] uppercase tracking-tight lg:text-lg">{option.chamada}</h1>
											</div>
										</button>
									</CarouselItem>
								))
							: null}
					</CarouselContent>
					<CarouselPrevious className="left-0" />
					<CarouselNext className="right-0" />
				</Carousel>
			</div>
			{newRequestMenu.isOpen ? (
				<NewCreditRedemptionRequest
					callbacks={{
						onMutate: handleNewRequestOnMutate,
						onSettled: handleNewRequestOnSettled,
					}}
					closeModal={() => setNewRequestMenu((prev) => ({ ...prev, isOpen: false }))}
					initialState={
						newRequestMenu.reward
							? {
									creditosResgatados: newRequestMenu.reward.requiredCredits,
									recompensaResgatada: {
										id: newRequestMenu.reward.id,
										nome: newRequestMenu.reward.label,
										creditosNecessarios: newRequestMenu.reward.requiredCredits,
									},
								}
							: undefined
					}
					sessionUser={sessionUser}
				/>
			) : null}
		</div>
	);
}

export default UserCreditsBalance;
