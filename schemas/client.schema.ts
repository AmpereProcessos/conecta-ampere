import { z } from 'zod';

export const ClientIndicatorSchema = z.object({
	id: z
		.string({
			invalid_type_error: 'Tipo não válido para o ID do indicador.',
		})
		.optional()
		.nullable(),
	nome: z
		.string({
			invalid_type_error: 'Tipo não válido para o nome do indicador.',
		})
		.optional()
		.nullable(),
	contato: z
		.string({
			invalid_type_error: 'Tipo não válido para o contato do indicador.',
		})
		.optional()
		.nullable(),
});

export const ClientConectaSchema = z.object({
	admin: z
		.boolean({
			required_error: 'Status de admin não informado.',
			invalid_type_error: 'Tipo não válido para status de admin.',
		})
		.optional()
		.nullable(),
	usuario: z.string({
		required_error: 'Usuário não informado.',
		invalid_type_error: 'Tipo não válido para o usuário.',
	}),
	senha: z.string({
		required_error: 'Senha não informada.',
		invalid_type_error: 'Tipo não válido para a senha.',
	}),
	email: z
		.string({
			invalid_type_error: 'Tipo não válido para o email do usuário.',
		})
		.optional()
		.nullable(),
	avatar_url: z
		.string({
			invalid_type_error: 'Tipo não válido para avatar do usuário.',
		})
		.optional()
		.nullable(),
	conviteId: z.string({ invalid_type_error: 'Tipo não válido para ID do convite.' }).optional().nullable(),
	conviteDataAceite: z.string({ invalid_type_error: 'Tipo não válido para data de aceite do convite.' }).optional().nullable(),
	codigoIndicacaoVendedor: z.string({ invalid_type_error: 'Tipo não válido para código de indicação do vendedor.' }).optional().nullable(),
	creditos: z
		.number({
			invalid_type_error: 'Tipo não válido para o número de créditos do usuário.',
		})
		.optional()
		.nullable(),
	googleId: z
		.string({
			invalid_type_error: 'Tipo não válido para o ID google do cliente.',
		})
		.optional()
		.nullable(),
	googleRefreshToken: z
		.string({
			invalid_type_error: 'Tipo não válido para o token de revalidações google do cliente.',
		})
		.optional()
		.nullable(),
	dataInscricao: z
		.string({
			invalid_type_error: 'Tipo não válido para data de inscrição do cliente.',
		})
		.datetime({ message: 'Formato inválido para data de inscrição.' })
		.optional()
		.nullable(),
});

export const ClientSchema = z.object({
	nome: z
		.string({
			required_error: 'Nome do cliente não informado.',
			invalid_type_error: 'Tipo não válido para nome do cliente.',
		})
		.min(3, 'É necessário um nome de ao menos 3 letras para o cliente.'),
	idParceiro: z.string({
		required_error: 'Referência a parceiro não informado.',
		invalid_type_error: 'Tipo não válido para a referência de parceiro.',
	}),
	cpfCnpj: z.string({ invalid_type_error: 'Tipo não válido para CPF/CNPJ do cliente.' }).optional().nullable(),
	rg: z.string({ invalid_type_error: 'Tipo não válido para RG do cliente.' }).optional().nullable(),
	telefonePrimario: z
		.string({
			required_error: 'Telefone primário do cliente não informado.',
			invalid_type_error: 'Tipo não válido para nome do cliente.',
		})
		.min(14, 'Formato inválido para telefone primáiro. O mínimo de caracteres é 14.'),
	telefoneSecundario: z.string().optional().nullable(),
	email: z.string({ invalid_type_error: 'Tipo não válido para email do cliente.' }).optional().nullable(),
	sexo: z.enum(['MASCULINO', 'FEMININO', 'OUTRO']).optional().nullable(),
	cep: z.string({ invalid_type_error: 'Tipo não válido para CEP do cliente.' }).optional().nullable(),
	uf: z.string({
		required_error: 'UF do cliente não informada.',
		invalid_type_error: 'Tipo não válido para UF do cliente.',
	}),
	cidade: z.string({
		required_error: 'Cidade não informada.',
		invalid_type_error: 'Tipo não válido para cidade do cliente.',
	}),
	bairro: z.string({ invalid_type_error: 'Tipo não válido para bairro do cliente.' }).optional().nullable(),
	endereco: z.string({ invalid_type_error: 'Tipo não válido para endereço do cliente.' }).optional().nullable(),
	numeroOuIdentificador: z
		.string({
			invalid_type_error: 'Tipo não válido para número/identificador.',
		})
		.optional()
		.nullable(),
	complemento: z
		.string({
			invalid_type_error: 'Tipo não válido para complemento de endereço.',
		})
		.optional()
		.nullable(),
	dataNascimento: z
		.string({
			invalid_type_error: 'Tipo não válido para data de nascimento do cliente.',
		})
		.datetime({ message: 'Formato inválido para data de nascimento.' })
		.optional()
		.nullable(),
	profissao: z
		.string({
			invalid_type_error: 'Tipo não válido para profissão do cliente.',
		})
		.optional()
		.nullable(),
	ondeTrabalha: z
		.string({
			invalid_type_error: 'Tipo não válido para o lugar de trabalho do cliente.',
		})
		.optional()
		.nullable(),
	estadoCivil: z
		.string({
			invalid_type_error: 'Tipo não válido para estado civil do cliente.',
		})
		.optional()
		.nullable(),
	deficiencia: z.string({ invalid_type_error: 'Tipo inválido para deficiência.' }).optional().nullable(),
	canalAquisicao: z.string({
		required_error: 'Canal de aquisição não informado.',
		invalid_type_error: 'Tipo não válido para canal de aquisição.',
	}),
	dataInsercao: z
		.string({
			required_error: 'Data de inserção não informada.',
			invalid_type_error: 'Tipo não válido para data de inserção.',
		})
		.datetime({ message: 'Formato inválido para data de inserção.' }),
	idIndicacao: z
		.string({
			invalid_type_error: 'Tipo não válido para o ID da indicação.',
		})
		.optional()
		.nullable(),
	idMarketing: z
		.string({
			invalid_type_error: 'Tipo não válido para o ID de marketing do cliente.',
		})
		.optional()
		.nullable(),
	indicador: ClientIndicatorSchema,
	conecta: ClientConectaSchema.optional().nullable(),
	autor: z.object({
		id: z.string({
			required_error: 'ID do autor não informado.',
			invalid_type_error: 'Tipo não válido para ID do autor.',
		}),
		nome: z.string({
			required_error: 'Nome do autor não informado.',
			invalid_type_error: 'Tipo não válido para nome do autor.',
		}),
		avatar_url: z
			.string({
				invalid_type_error: 'Tipo não válido para avatar do autor.',
			})
			.optional()
			.nullable(),
	}),
});

export type TClient = z.infer<typeof ClientSchema>;
export type TClientDTO = TClient & { _id: string };
