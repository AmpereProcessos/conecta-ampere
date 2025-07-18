import { z } from 'zod';
import { InteractionEventEnumSchema } from './enums.schema';

export const InteractionEventsSchema = z.object({
	tipo: InteractionEventEnumSchema,
	vendedor: z
		.object({
			id: z.string({ invalid_type_error: 'Tipo não válido para ID do vendedor.' }),
			nome: z.string({ invalid_type_error: 'Tipo não válido para nome do vendedor.' }),
			avatar_url: z.string({ invalid_type_error: 'Tipo não válido para avatar do vendedor.' }).optional().nullable(),
		})
		.optional()
		.nullable(),
	codigoIndicacaoVendedor: z.string({ invalid_type_error: 'Tipo não válido para código de indicação.' }).optional().nullable(),
	usuario: z
		.object({
			id: z.string({ invalid_type_error: 'Tipo não válido para ID do usuário.' }),
			nome: z.string({ invalid_type_error: 'Tipo não válido para nome do usuário.' }),
			avatar_url: z.string({ invalid_type_error: 'Tipo não válido para avatar do usuário.' }).optional().nullable(),
		})
		.optional()
		.nullable(),
	// Location from which the interaction event was triggered
	localizacao: z.object({
		cidade: z.string({ invalid_type_error: 'Tipo não válido para cidade.' }).optional().nullable(),
		uf: z.string({ invalid_type_error: 'Tipo não válido para UF.' }).optional().nullable(),
		latitude: z.string({ invalid_type_error: 'Tipo não válido para latitude.' }).optional().nullable(),
		longitude: z.string({ invalid_type_error: 'Tipo não válido para longitude.' }).optional().nullable(),
	}),
	data: z.string({ invalid_type_error: 'Tipo não válido para data de interação.' }).datetime({ message: 'Tipo não válido para data de interação.' }),
});

export type TInteractionEvent = z.infer<typeof InteractionEventsSchema>;
