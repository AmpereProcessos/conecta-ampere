import axios from 'axios';
import type {
	TAdminCreateRewardOptionRouteInput,
	TAdminCreateRewardOptionRouteOutput,
	TAdminDeleteRewardOptionRouteInput,
	TAdminDeleteRewardOptionRouteOutput,
	TAdminEditRewardOptionRouteInput,
	TAdminEditRewardOptionRouteOutput,
} from '@/app/api/admin/reward-options/route';
import { absoluteUrl } from '../utils';

export async function createRewardOption({ isServer = false, payload }: { payload: TAdminCreateRewardOptionRouteInput; isServer?: boolean }) {
	try {
		const { data } = await axios.post<TAdminCreateRewardOptionRouteOutput>(`${isServer ? absoluteUrl('/api/admin/reward-options') : '/api/admin/reward-options'}`, payload);
		return data;
	} catch (error) {
		console.log('Error running createRewardOption', error);
		throw error;
	}
}

export async function editRewardOption({ isServer = false, payload }: { payload: TAdminEditRewardOptionRouteInput; isServer?: boolean }) {
	try {
		const { data } = await axios.put<TAdminEditRewardOptionRouteOutput>(`${isServer ? absoluteUrl('/api/admin/reward-options') : '/api/admin/reward-options'}`, payload);
		return data;
	} catch (error) {
		console.log('Error running editRewardOption', error);
		throw error;
	}
}

export async function deleteRewardOption({ isServer = false, id }: { id: TAdminDeleteRewardOptionRouteInput; isServer?: boolean }) {
	try {
		const { data } = await axios.delete<TAdminDeleteRewardOptionRouteOutput>(`${isServer ? absoluteUrl('/api/admin/reward-options') : '/api/admin/reward-options'}?id=${id}`);
		return data.data;
	} catch (error) {
		console.log('Error running deleteRewardOption', error);
		throw error;
	}
}
