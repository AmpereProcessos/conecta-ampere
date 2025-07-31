import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { TGetProgramStatsRouteInput, TGetProgramStatsRouteOutput } from '@/app/api/admin/stats/route';
import { useDebounceMemo } from '@/lib/hooks/use-debounce';
import { absoluteUrl } from '@/lib/utils';

export async function fetchProgramStats({ isServer = false, after, before }: TGetProgramStatsRouteInput & { isServer?: boolean }) {
	try {
		const { data } = await axios.get<TGetProgramStatsRouteOutput>(`${isServer ? absoluteUrl('/api/admin/stats') : '/api/admin/stats'}?after=${after}&before=${before}`);
		return data.data;
	} catch (error) {
		console.log('Error running fetchProgramStats', error);
		throw error;
	}
}

type TUseProgramStatsQueryParams = {
	initialParams?: Partial<TGetProgramStatsRouteInput>;
};
export function useProgramStatsQuery({ initialParams }: TUseProgramStatsQueryParams) {
	const monthStart = dayjs().startOf('month').toISOString();
	const monthEnd = dayjs().endOf('month').toISOString();

	const [queryParams, setQueryParams] = useState<TGetProgramStatsRouteInput>({
		after: initialParams?.after || monthStart,
		before: initialParams?.before || monthEnd,
	});
	function updateQueryParams(params: Partial<TGetProgramStatsRouteInput>) {
		setQueryParams((prev) => ({
			...prev,
			...params,
		}));
	}
	const debouncedParams = useDebounceMemo(queryParams, 500);
	return {
		...useQuery({
			queryKey: ['program-stats', debouncedParams],
			queryFn: async () => await fetchProgramStats(debouncedParams),
		}),
		queryParams,
		updateQueryParams,
	};
}
