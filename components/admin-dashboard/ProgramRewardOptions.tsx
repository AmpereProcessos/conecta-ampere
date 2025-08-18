'use client';

import { useQueryClient } from '@tanstack/react-query';
import { TicketCheck } from 'lucide-react';
import { useState } from 'react';
import { BsCalendarPlus } from 'react-icons/bs';
import type { TAdminGetRewardOptionsRouteOutput } from '@/app/api/admin/reward-options/route';
import type { TSessionUser } from '@/lib/authentication/types';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatDateAsLocale, formatNameAsInitials } from '@/lib/methods/formatting';
import { useAdminRewardOptionsQuery } from '@/lib/queries/reward-options';
import ErrorComponent from '../layout/ErrorComponent';
import EditRewardOption from '../reward-options/modals/EditRewardOption';
import NewRewardOption from '../reward-options/modals/NewRewardOption';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

type AdminProgramRewardOptionsProps = {
	sessionUser: TSessionUser;
};
export default function AdminProgramRewardOptions({ sessionUser }: AdminProgramRewardOptionsProps) {
	const queryClient = useQueryClient();
	const [newRewardOptionMenuIsOpen, setNewRewardOptionMenuIsOpen] = useState(false);
	const [editRewardOptionMenuId, setEditRewardOptionMenuId] = useState<string | null>(null);
	const { data: rewardOptions, isLoading, isError, isSuccess, error, queryKey } = useAdminRewardOptionsQuery({});
	const handleOnMutate = async () => await queryClient.cancelQueries({ queryKey });
	const handleOnSettled = async () => await queryClient.invalidateQueries({ queryKey });

	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-card p-3.5 shadow-sm">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<TicketCheck className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">RECOMPENSAS DO PROGRAMA</h1>
				</div>
				<Button onClick={() => setNewRewardOptionMenuIsOpen(true)} size={'sm'} variant={'ghost'}>
					NOVA RECOMPENSA
				</Button>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-3 px-0 py-3 lg:px-6">
				{isLoading ? <h3 className="animate-pulse font-semibold text-xs tracking-tight lg:text-base">Buscando recompensas...</h3> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					rewardOptions.length > 0 ? (
						rewardOptions.map((rewardOption) => (
							<AdminRewardOptionCard handleEditClick={() => setEditRewardOptionMenuId(rewardOption._id)} key={rewardOption._id} rewardOption={rewardOption} />
						))
					) : (
						<h3 className="font-semibold text-xs tracking-tight lg:text-base">Nenhuma recompensa encontrada :(</h3>
					)
				) : null}
			</div>
			{newRewardOptionMenuIsOpen ? (
				<NewRewardOption
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
					closeModal={() => setNewRewardOptionMenuIsOpen(false)}
					sessionUser={sessionUser}
				/>
			) : null}
			{editRewardOptionMenuId ? (
				<EditRewardOption
					callbacks={{
						onMutate: handleOnMutate,
						onSettled: handleOnSettled,
					}}
					closeModal={() => setEditRewardOptionMenuId(null)}
					rewardOptionId={editRewardOptionMenuId}
					sessionUser={sessionUser}
				/>
			) : null}
		</div>
	);
}

type AdminRewardOptionCardProps = {
	rewardOption: Exclude<TAdminGetRewardOptionsRouteOutput['data']['default'], null | undefined>[number];
	handleEditClick: () => void;
};
function AdminRewardOptionCard({ rewardOption, handleEditClick }: AdminRewardOptionCardProps) {
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-[#fff] p-3.5 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full flex-col gap-1.5">
				<div className="flex items-center gap-1.5">
					<TicketCheck className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">{rewardOption.titulo}</h1>
				</div>
				<p className="font-normal text-[0.625rem] lg:text-sm">{rewardOption.descricao}</p>
			</div>

			<div className="flex w-full items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-1.5">
						<Avatar className="h-5 w-5">
							<AvatarImage src={rewardOption.autor.avatarUrl ?? undefined} />
							<AvatarFallback>{formatNameAsInitials(rewardOption.autor.nome)}</AvatarFallback>
						</Avatar>
						<h1 className="font-semibold text-xs leading-none tracking-tight lg:text-sm">{rewardOption.autor.nome}</h1>
					</div>
					<div className="flex items-center gap-1.5">
						<BsCalendarPlus className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
						<h1 className="font-semibold text-xs leading-none tracking-tight lg:text-sm">{formatDateAsLocale(rewardOption.dataInsercao, true)}</h1>
					</div>
				</div>
				<Button onClick={handleEditClick} size={'sm'} variant={'ghost'}>
					EDITAR
				</Button>
			</div>
		</div>
	);
}
