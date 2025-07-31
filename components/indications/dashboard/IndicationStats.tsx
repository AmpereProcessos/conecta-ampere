'use client';
import { BadgeX, ChartColumn, CircleDot, Trophy } from 'lucide-react';
import { useIndicationStatsQuery } from '@/lib/queries/indications';
import { cn } from '@/lib/utils';

function IndicationStats() {
	const { data } = useIndicationStatsQuery();
	return (
		<div className="flex w-full flex-col gap-1.5 rounded-lg border border-primary/20 bg-[#fff] p-3.5 shadow-sm dark:bg-[#121212]">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<ChartColumn className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" />
					<h1 className="font-bold text-sm leading-none tracking-tight lg:text-lg">RESULTADOS</h1>
				</div>
			</div>
			<div className="flex w-full grow flex-col items-center justify-center gap-1.5 px-0 py-3 lg:px-6">
				<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
					<IndicationStatCard text={`${data?.indicationsLostSales || 0} GANHAS`} type="wins" />
					<IndicationStatCard text={`${data?.indicationsLostSales || 0} PERDIDAS`} type="losts" />
					<IndicationStatCard text={`${data?.indicationsOnGoingOpportunities || 0} EM ANDAMENTO`} type="ongoing" />
				</div>
			</div>
		</div>
	);
}

export default IndicationStats;

type IndicationStatCardProps = {
	type: 'wins' | 'losts' | 'ongoing';
	text: string;
};
function IndicationStatCard({ type, text }: IndicationStatCardProps) {
	return (
		<div
			className={cn('flex w-full flex-col gap-1.5 rounded border-2 px-2 py-1.5', {
				'border-green-500 bg-green-500/30': type === 'wins',
				'border-red-500 bg-red-500/30': type === 'losts',
				'border-blue-600 bg-blue-600/30': type === 'ongoing',
			})}
		>
			<div className="flex w-full items-center justify-center">
				{type === 'wins' ? <Trophy className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" /> : null}
				{type === 'losts' ? <BadgeX className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" /> : null}
				{type === 'ongoing' ? <CircleDot className="h-4 min-h-4 w-4 min-w-4 lg:h-6 lg:w-6" /> : null}
			</div>
			<h1 className="w-full text-center text-[0.6rem] lg:text-base">{text}</h1>
		</div>
	);
}
