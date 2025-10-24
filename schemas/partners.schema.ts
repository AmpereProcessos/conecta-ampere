import z from 'zod';

const LocationSchema = z.object({
	cep: z
		.string({
			invalid_type_error: 'Tipo não válido para o CEP do parceiro.',
			required_error: 'CEP do parceiro não informado.',
		})
		.optional()
		.nullable(),
	uf: z.string({
		required_error: 'UF de localização não informada.',
		invalid_type_error: 'Tipo não válido para a UF de localização.',
	}),
	cidade: z.string({
		required_error: 'Cidade de localização não informada.',
		invalid_type_error: 'Tipo não válido para a cidade de localização.',
	}),
	bairro: z
		.string({
			invalid_type_error: 'Tipo não válido para o bairro do parceiro.',
			required_error: 'Bairro do parceiro não informado.',
		})
		.optional()
		.nullable(),
	endereco: z
		.string({
			invalid_type_error: 'Tipo não válido para o endereço do parceiro.',
			required_error: 'Endereço do parceiro não informado.',
		})
		.optional()
		.nullable(),
	numeroOuIdentificador: z
		.string({
			invalid_type_error: 'Tipo não válido para o número ou identificador do parceiro.',
			required_error: 'Número ou identificador do parceiro não informado.',
		})
		.optional()
		.nullable(),
	complemento: z
		.string({
			invalid_type_error: 'Tipo não válido para o complemento do parceiro.',
			required_error: 'Complemento do parceiro não informado.',
		})
		.optional()
		.nullable(),
	// distancia: z.number().optional().nullable(),
});

const PartnerMediaSchema = z.object(
	{
		instagram: z.string({ required_error: 'Instagram não fornecido.', invalid_type_error: 'Tipo não válido para Instagram.' }),
		website: z.string({ required_error: 'Link do website não fornecido.', invalid_type_error: 'Tipo não válido para link do website.' }),
		facebook: z.string({ required_error: 'Facebook não fornecido.', invalid_type_error: 'Tipo não válido para Facebook.' }),
	},
	{ required_error: 'Informações de mídias sociais não fornecidas.', invalid_type_error: 'Tipo não válido para informações de mídias sociais.' }
);
export const PartnerSchema = z.object({
	nome: z.string({
		required_error: 'Nome do parceiro não informado.',
		invalid_type_error: 'Tipo não válido para o nome do parceiro.',
	}),
	ativo: z.boolean({
		required_error: 'Status de ativação do parceiro não informado.',
		invalid_type_error: 'Tipo não válido para o status de ativação do parceiro.',
	}),
	cpfCnpj: z.string({
		required_error: 'CPF ou CNPJ do parceiro não informado.',
		invalid_type_error: 'Tipo não válido para o CPF ou CNPJ do parceiro.',
	}),
	logo_url: z.string().optional().nullable(),
	descricao: z.string({
		required_error: 'Descrição do parceiro não informada.',
		invalid_type_error: 'Tipo não válido para a descrição do parceiro.',
	}),
	contatos: z.object({
		telefonePrimario: z.string({
			required_error: 'Telefone primário do parceiro não informado.',
			invalid_type_error: 'Tipo não válido para o telefone primário do parceiro.',
		}),
		telefoneSecundario: z
			.string({
				required_error: 'Telefone secundário do parceiro não informado.',
				invalid_type_error: 'Tipo não válido para o telefone secundário do parceiro.',
			})
			.optional()
			.nullable(),
		email: z.string({
			required_error: 'Email do parceiro não informado.',
			invalid_type_error: 'Tipo não válido para o email do parceiro.',
		}),
	}),
	slogan: z.string({ required_error: 'Slogan da empresa não fornecido.', invalid_type_error: 'Tipo não válido para slogan da empresa.' }),
	midias: PartnerMediaSchema,
	localizacao: LocationSchema,
	dataInsercao: z
		.string({
			required_error: 'Data de inserção do parceiro não informada.',
			invalid_type_error: 'Tipo não válido para a data de inserção do parceiro.',
		})
		.datetime({ message: 'Formato inválido para data de inserção do parceiro.' }),
});

export type TPartner = z.infer<typeof PartnerSchema>;

export type TPartnerDTO = TPartner & { _id: string };
