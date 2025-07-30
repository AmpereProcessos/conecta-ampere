'use client';
import { isValidNumber } from '@/lib/methods/validation';
import { useOwnIndicationsRankingQuery } from '@/lib/queries/ranking';

export default function HeaderIndicationsRankingBagde() {
	const { data: ownIndicationsRanking } = useOwnIndicationsRankingQuery();

	if (!ownIndicationsRanking) return null;

	return (
		<div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#15599a] font-bold text-white text-xs ring-primary-foreground">
			{isValidNumber(ownIndicationsRanking) ? `#${ownIndicationsRanking}` : '?'}
		</div>
	);
}
