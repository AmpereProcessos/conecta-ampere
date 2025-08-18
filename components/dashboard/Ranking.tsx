'use client';
import { Trophy, UserRound } from 'lucide-react';
import type { TAuthSession } from '@/lib/authentication/types';
import { getErrorMessage } from '@/lib/methods/errors';
import { useIndicationsRankingQuery } from '@/lib/queries/ranking';
import { cn } from '@/lib/utils';
import ErrorComponent from '../layout/ErrorComponent';

type IndicationsRankingProps = {
	sessionUser: TAuthSession['user'];
};
function IndicationsRanking({ sessionUser }: IndicationsRankingProps) {
	const { data: ranking, isLoading, isError, isSuccess, error } = useIndicationsRankingQuery();

	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-white p-3.5 shadow-xs dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<Trophy className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">RANKING DO MÊS</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				{isLoading ? <h3 className="animate-pulse font-semibold text-xs tracking-tight lg:text-base">Buscando ranking...</h3> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<div className="flex w-full flex-col gap-3">
						{ranking.map((rankingItem) => (
							<div className="flex items-center justify-between gap-1.5" key={rankingItem.posicao}>
								<div className="flex items-center gap-1.5">
									<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#15599a] font-bold text-white text-xs ring-primary-foreground">#{rankingItem.posicao}</div>
									<h2 className="font-semibold text-sm uppercase">{rankingItem.autor.nome}</h2>
									{rankingItem.posicao === 1 ? (
										<div className={cn('flex items-center gap-1 rounded-lg bg-green-100 px-2 py-0.5 text-center font-bold text-[0.5rem] text-green-700 italic')}>
											<Trophy className={cn('h-3 min-h-3 w-3 min-w-3')} />
											<p className={cn('font-medium text-[0.57rem]')}>TOP INDICADOR DO MÊS</p>
										</div>
									) : null}
									{rankingItem.autor.id === sessionUser.id ? (
										<div className={cn('flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-0.5 text-center font-bold text-[0.5rem] text-blue-700 italic')}>
											<UserRound className={cn('h-3 min-h-3 w-3 min-w-3')} />
											<p className={cn('font-medium text-[0.57rem]')}>VOCÊ</p>
										</div>
									) : null}
								</div>
								<h3 className="font-semibold text-sm">{rankingItem.totalIndicacoes}</h3>
							</div>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

export default IndicationsRanking;
