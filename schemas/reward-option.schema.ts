import { z } from 'zod';

export const RewardOptionSchema = z.object({
	titulo: z.string({ invalid_type_error: 'Tipo não válido para título da recompensa.' }),
	descricao: z.string({ invalid_type_error: 'Tipo não válido para descrição da recompensa.' }),
	chamada: z.string({ invalid_type_error: 'Tipo não válido para chamada da recompensa.' }),
	imagemCapaUrl: z.string({ invalid_type_error: 'Tipo não válido para URL da imagem da capa da recompensa.' }).optional().nullable(),
	creditosNecessarios: z.number({ invalid_type_error: 'Tipo não válido para créditos necessários para resgate da recompensa.' }),

	autor: z.object({
		id: z.string({ invalid_type_error: 'Tipo não válido para ID do autor da recompensa.' }),
		nome: z.string({ invalid_type_error: 'Tipo não válido para nome do autor da recompensa.' }),
		avatarUrl: z.string({ invalid_type_error: 'Tipo não válido para URL do avatar do autor da recompensa.' }).optional().nullable(),
	}),
	dataExclusao: z
		.string({ invalid_type_error: 'Tipo não válido para data de exclusão da recompensa.' })
		.datetime({ message: 'Formato inválido para data de exclusão da recompensa.' })
		.optional()
		.nullable(),
	dataExpiracao: z
		.string({ invalid_type_error: 'Tipo não válido para data de expiração da recompensa.' })
		.datetime({ message: 'Formato inválido para data de expiração da recompensa.' })
		.optional()
		.nullable(),
	dataInsercao: z
		.string({ invalid_type_error: 'Tipo não válido para data de inserção da recompensa.' })
		.datetime({ message: 'Formato inválido para data de inserção da recompensa.' }),
});

export type TRewardOption = z.infer<typeof RewardOptionSchema>;
