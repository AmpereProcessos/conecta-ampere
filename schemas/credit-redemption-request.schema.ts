import { z } from "zod";

export const CreditRedemptionRequestSchema = z.object({
	creditosResgatados: z.number({
		required_error: "Quantidade de créditos resgatados não informada.",
		invalid_type_error: "Tipo não válido para a quantidade de créditos resgatada.",
	}),
	recompensaResgatada: z.object(
		{
			id: z.string({
				required_error: "ID de referência da recompensa resgatada não informada.",
				invalid_type_error: "Tipo não válido para o ID de referência da recompensa resgatada.",
			}),
			nome: z.string({ required_error: "Nome da recompensa resgatada não informado.", invalid_type_error: "Tipo não válido para o nome da recompensa resgatada." }),
			creditosNecessarios: z.number({
				required_error: "Quantidade de créditos necessária para o resgate não informada.",
				invalid_type_error: "Tipo não válido para a quantidade de créditos necessária para o resgate.",
			}),
		},
		{
			required_error: "Informações sobre a recompensa resgatada não informada.",
			invalid_type_error: "Tipo não válido para as informações da recompensa resgatada.",
			description: "Informações da recompensa resgatada.",
		},
	),
	requerente: z.object(
		{
			id: z.string({ required_error: "ID do requerente não informado.", invalid_type_error: "Tipo não válido para o ID do requerente." }),
			nome: z.string({ required_error: "Nome do requerente não informado.", invalid_type_error: "Tipo não válido para o nome do requerente." }),
			avatar_url: z
				.string({ required_error: "Avatar do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o avatar do responsável." })
				.optional()
				.nullable(),
			telefone: z
				.string({ required_error: "Telefone do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o Telefone do responsável." })
				.optional()
				.nullable(),
			email: z
				.string({
					required_error: "Email do requerente não informado.",
					invalid_type_error: "Tipo não válido para o email do requerente.",
				})
				.optional()
				.nullable(),
		},
		{
			required_error: "Informações do cliente requerente não informadas.",
			invalid_type_error: "Tipo não válido para as informações do cliente requerente.",
			description: "Informações do cliente que requeriu o resgate de créditos.",
		},
	),
	analista: z.object(
		{
			id: z.string({ required_error: "ID do requerente não informado.", invalid_type_error: "Tipo não válido para o ID do requerente." }).optional().nullable(),
			nome: z.string({ required_error: "Nome do requerente não informado.", invalid_type_error: "Tipo não válido para o nome do requerente." }).optional().nullable(),
			avatar_url: z
				.string({ required_error: "Avatar do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o avatar do responsável." })
				.optional()
				.nullable(),
		},
		{
			required_error: "Informações do analista não informadas.",
			invalid_type_error: "Tipo não válido para as informações do analista.",
			description: "Informações do analista (quando definido) responsável pelo processamento da requisição.",
		},
	),
	pagamento: z.object(
		{
			observacoes: z.string({ required_error: "Observações para pagamento não informadas.", invalid_type_error: "Tipo não válido para as observações para pagamento." }),
			comprovanteUrl: z
				.string({
					invalid_type_error: "Tipo não válido para o link do arquivo do comprovante de pagamento.",
				})
				.optional()
				.nullable(),
			dataAgendamento: z
				.string({ invalid_type_error: "Tipo não válido para data de agendamento do pagamento." })
				.datetime({ message: "Tipo não válido para data de agendamento do pagamento." })
				.optional()
				.nullable(),
		},
		{
			required_error: "Informações para pagamento não informadas.",
			invalid_type_error: "Tipo não válido para as informações de pagamento.",
			description: "Informações sobre o pagamento da recompensa.",
		},
	),
	dataUltimaAtualizacao: z
		.string({ invalid_type_error: "Tipo não válido para a data de última atualização.", description: "Data da última atualização da requisição de resgate de créditos." })
		.datetime({ message: "Tipo não válido para a data de última atualização." })
		.optional()
		.nullable(),
	dataEfetivacao: z
		.string({
			invalid_type_error: "Tipo não válido para a data de efetivação.",
			description: "Data de efetivação do resgate de créditos.",
		})
		.optional()
		.nullable(),
	dataInsercao: z
		.string({
			required_error: "Data de inserção não informada.",
			invalid_type_error: "Tipo não válido para a data de inserção.",
			description: "Data de criação da requisição de resgate de créditos.",
		})
		.datetime({ message: "Tipo não válido para a data de inserção." }),
});

export type TCreditRedemptionRequest = z.infer<typeof CreditRedemptionRequestSchema>;
