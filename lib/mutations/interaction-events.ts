import axios from 'axios';
import type { TCreateInteractionEventRouteInput, TCreateInteractionEventRouteOutput } from '@/app/api/interaction-events/route';
import { absoluteUrl } from '../utils';

export async function createInteractionEvent(interactionEvent: TCreateInteractionEventRouteInput) {
	try {
		const { data }: { data: TCreateInteractionEventRouteOutput } = await axios.post(`${absoluteUrl('/api/interaction-events')}`, interactionEvent);

		return data.data;
	} catch (error) {
		console.log('[ERROR] [CREATE INTERACTION EVENT] Error creating interaction event:', error);
		throw error;
	}
}
