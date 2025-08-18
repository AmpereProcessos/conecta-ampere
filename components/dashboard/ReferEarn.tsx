'use client';
import { useQueryClient } from '@tanstack/react-query';
import { UsersRound } from 'lucide-react';
import { useState } from 'react';
import { FaBolt, FaSolarPanel } from 'react-icons/fa';
import { ReferEarnOptions } from '@/configs/constants';
import type { TAuthSession } from '@/lib/authentication/types';
import type { TSaleCategoryEnum } from '@/schemas/enums.schema';
import NewIndication from '../indications/modals/NewIndication';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

type NewIndicationMenuState = {
	isOpen: boolean;
	projectType: {
		id: string;
		title: string;
		saleCategory: TSaleCategoryEnum;
	} | null;
};

type ReferEarnProps = {
	sessionUser: TAuthSession['user'];
	initialIndicationSellerCode?: string;
};
function ReferEarn({ sessionUser, initialIndicationSellerCode }: ReferEarnProps) {
	const queryClient = useQueryClient(); // Use the query client to cancel and invalidate queries
	const [newIndicationMenu, setNewIndicationMenu] = useState<NewIndicationMenuState>({
		isOpen: false,
		projectType: null,
	});

	const handleNewIndicationOnMutate = async () => await queryClient.cancelQueries({ queryKey: ['indications'] });
	const handleNewIndicationOnSettled = async () => await queryClient.invalidateQueries({ queryKey: ['indications'] });
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<UsersRound className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">INDIQUE E GANHE</h1>
				</div>
			</div>
			<div className="w-full">
				<p className="text-[0.625rem] lg:text-sm">
					<span className="font-normal">Indique nossos produtos para familiares, amigos ou conhecidos e GANHE </span>
					<span className="inline-flex items-center gap-0.5 font-bold text-[#FB2E9F]">
						<FaBolt className="h-2 w-2 lg:h-4 lg:w-4" />
						CRÉDITOS AMPÈRE
					</span>
				</p>
			</div>
			<div className="flex w-full flex-col px-4">
				<Carousel
					opts={{
						align: 'start',
						loop: false,
						dragFree: true,
						containScroll: 'trimSnaps',
					}}
				>
					<CarouselContent className="-ml-2 p-3">
						{ReferEarnOptions.map((option) => (
							<CarouselItem className="basis-[calc(33.333%-0.5rem)] pl-2 sm:basis-[calc(30%-0.5rem)]" key={option.id}>
								<button
									className="flex h-[150px] w-full flex-col items-center justify-center gap-1 rounded-lg bg-blue-100 p-2 text-[#15599a] duration-300 ease-in-out hover:bg-blue-200 lg:h-[250px] lg:p-8"
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
									type="button"
								>
									<FaSolarPanel className="h-6 min-h-4 w-6 min-w-4 lg:h-12 lg:w-12" />
									<h1 className="break-words text-center font-bold text-[0.55rem] uppercase tracking-tight lg:text-lg">{option.referEarnCall}</h1>
								</button>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="left-0" />
					<CarouselNext className="right-0" />
				</Carousel>
			</div>

			{newIndicationMenu.isOpen && newIndicationMenu.projectType ? (
				<NewIndication
					callbacks={{
						onMutate: handleNewIndicationOnMutate,
						onSettled: handleNewIndicationOnSettled,
					}}
					closeModal={() => setNewIndicationMenu({ isOpen: false, projectType: null })}
					initialState={{
						codigoIndicacaoVendedor: initialIndicationSellerCode,
					}}
					projectType={newIndicationMenu.projectType}
					sessionUser={sessionUser}
				/>
			) : null}
		</div>
	);
}

export default ReferEarn;
