import { geolocation } from '@vercel/functions';
import createHttpError from 'http-errors';
import { type NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getCurrentSession } from '@/lib/authentication/session';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import { InteractionEventsSchema, type TInteractionEvent } from '@/schemas/interaction-events.schema';

export type TCreateInteractionEventRouteInput = z.infer<typeof InteractionEventsSchema>;
async function handleCreateInteractionEvent(req: NextRequest) {
	console.log('[INFO] [CREATE INTERACTION EVENT] Request received');
	const { city, country, region, latitude, longitude, countryRegion } = await geolocation(req);

	console.log('[INFO] [CREATE INTERACTION EVENT] Gelocation data:', { city, country, region, latitude, longitude, countryRegion });
	const { user } = await getCurrentSession();

	const payload = await req.json();
	const event = InteractionEventsSchema.parse(payload);

	const crmDb = await connectToCRMDatabase();
	const interactionEventsCollection = crmDb.collection<TInteractionEvent>(DATABASE_COLLECTION_NAMES.INTERACTION_EVENTS);

	const interactionEventToInsert: TInteractionEvent = {
		tipo: event.tipo,
		vendedor: event.vendedor,
		promotor: event.promotor,

		localizacao: {
			cidade: city || null,
			uf: region || null,
			latitude: latitude || null,
			longitude: longitude || null,
		},
		usuario: user
			? {
					id: user.id,
					nome: user.nome,
					avatar_url: user.avatar_url,
				}
			: null,
		data: new Date().toISOString(),
		codigoIndicacaoVendedor: event.codigoIndicacaoVendedor,
	};

	const insertedInteractionEvent = await interactionEventsCollection.insertOne(interactionEventToInsert);

	if (!insertedInteractionEvent.acknowledged) {
		throw new createHttpError.InternalServerError('Oops, não foi possível criar o evento de interação.');
	}

	console.log('[INFO] [CREATE INTERACTION EVENT] Inserted interaction event:', insertedInteractionEvent);
	return NextResponse.json({
		message: 'Evento de interação criado com sucesso.',
		data: {
			insertedId: insertedInteractionEvent.insertedId.toString(),
		},
	});
}
export type TCreateInteractionEventRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleCreateInteractionEvent>>>;

export const POST = apiHandler({ POST: handleCreateInteractionEvent });
