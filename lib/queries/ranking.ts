import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { TGetOwnIndicationsRankingRouteOutput } from '@/app/api/indications/ranking/own/route';
import type { TGetIndicationsRankingRouteOutput } from '@/app/api/indications/ranking/route';
import { absoluteUrl } from '../utils';

export async function fetchOwnIndicationsRanking({ isServer = false }: { isServer?: boolean } = {}) {
	try {
		const { data } = await axios.get<TGetOwnIndicationsRankingRouteOutput>(`${isServer ? absoluteUrl('/api/indications/ranking/own') : '/api/indications/ranking/own'}`);
		return data.data.userRanking;
	} catch (error) {
		console.log('Error running fetchOwnIndicationsRanking', error);
		throw error;
	}
}

export function useOwnIndicationsRankingQuery() {
	return useQuery({
		queryKey: ['own-indications-ranking'],
		queryFn: async () => await fetchOwnIndicationsRanking(),
	});
}

export async function fetchIndicationsRanking({ isServer = false }: { isServer?: boolean } = {}) {
	try {
		const { data } = await axios.get<TGetIndicationsRankingRouteOutput>(`${isServer ? absoluteUrl('/api/indications/ranking') : '/api/indications/ranking'}`);
		return data.data.ranking;
	} catch (error) {
		console.log('Error running fetchIndicationsRanking', error);
		throw error;
	}
}

export function useIndicationsRankingQuery() {
	return useQuery({
		queryKey: ['indications-ranking'],
		queryFn: async () => await fetchIndicationsRanking(),
	});
}
