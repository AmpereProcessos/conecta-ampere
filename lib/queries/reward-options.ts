import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import type { TAdminGetRewardOptionsRouteByIdInput, TAdminGetRewardOptionsRouteDefaultInput, TAdminGetRewardOptionsRouteOutput } from '@/app/api/admin/reward-options/route';
import type { TGetRewardOptionsRouteOutput } from '@/app/api/reward-options/route';
import { useDebounceMemo } from '../hooks/use-debounce';
import { absoluteUrl } from '../utils';

export async function fetchRewardOptions({ isServer = false }: { isServer?: boolean } = {}) {
	try {
		const { data } = await axios.get<TGetRewardOptionsRouteOutput>(`${isServer ? absoluteUrl('/api/reward-options') : '/api/reward-options'}`);
		return data.data.default;
	} catch (error) {
		console.log('Error running fetchRewardOptions', error);
		throw error;
	}
}

export function useRewardOptionsQuery() {
	return useQuery({
		queryKey: ['reward-options'],
		queryFn: async () => await fetchRewardOptions(),
	});
}

export async function fetchAdminRewardOptions({ isServer = false, ...params }: TAdminGetRewardOptionsRouteDefaultInput & { isServer?: boolean }) {
	try {
		const searchParamsHolder = new URLSearchParams({ activeOnly: params.activeOnly.toString() });
		const searchParams = searchParamsHolder.toString();
		const { data } = await axios.get<TAdminGetRewardOptionsRouteOutput>(
			`${isServer ? absoluteUrl('/api/admin/reward-options') : '/api/admin/reward-options'}${searchParams ? `?${searchParams}` : ''}`
		);
		if (!data.data.default) {
			throw new Error('Nenhuma recompensa encontrada.');
		}
		return data.data.default;
	} catch (error) {
		console.log('Error running fetchAdminRewardOptions', error);
		throw error;
	}
}

type useAdminRewardOptionsQueryParams = {
	initialParams?: Partial<TAdminGetRewardOptionsRouteDefaultInput>;
};
export function useAdminRewardOptionsQuery({ initialParams }: useAdminRewardOptionsQueryParams) {
	const DEBOUNCE_TIME = 500;
	const [queryParams, setQueryParams] = useState<TAdminGetRewardOptionsRouteDefaultInput>({
		activeOnly: initialParams?.activeOnly ?? true,
	});
	function updateQueryParams(changes: Partial<TAdminGetRewardOptionsRouteDefaultInput>) {
		setQueryParams((prev) => ({ ...prev, ...changes }));
	}
	const debouncedQueryParams = useDebounceMemo(queryParams, DEBOUNCE_TIME);
	return {
		...useQuery({
			queryKey: ['admin-reward-options', debouncedQueryParams],
			queryFn: async () => await fetchAdminRewardOptions({ ...debouncedQueryParams }),
		}),
		queryParams,
		updateQueryParams,
		queryKey: ['admin-reward-options', debouncedQueryParams],
	};
}

async function fetchAdminRewardOptionById({ isServer = false, id }: TAdminGetRewardOptionsRouteByIdInput & { isServer?: boolean }) {
	try {
		const searchParamsHolder = new URLSearchParams({ id });
		const searchParams = searchParamsHolder.toString();
		const { data } = await axios.get<TAdminGetRewardOptionsRouteOutput>(
			`${isServer ? absoluteUrl('/api/admin/reward-options') : '/api/admin/reward-options'}${searchParams ? `?${searchParams}` : ''}`
		);
		if (!data.data.byId) {
			throw new Error('Recompensa não encontrada.');
		}
		return data.data.byId;
	} catch (error) {
		console.log('Error running fetchAdminRewardOptionById', error);
		throw error;
	}
}

export function useAdminRewardOptionByIdQuery({ id }: TAdminGetRewardOptionsRouteByIdInput) {
	return useQuery({
		queryKey: ['admin-reward-option-by-id', id],
		queryFn: async () => await fetchAdminRewardOptionById({ id }),
	});
}
