import { z } from "zod";

export const UserPermissionsSchema = z.object({
	usuarios: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de visualização de usuários não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de usuários.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de usuários não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de usuários.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de usuários não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de usuários.",
		}),
	}),
	comissoes: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de visualização de comissões não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de comissões.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de comissões não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de comissões.",
		}),
	}),
	kits: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de visualização de kits não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de kits.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de kits não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de kits.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de kits não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de kits.",
		}),
	}),
	produtos: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de visualização de produtos não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de produtos.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de produtos não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de produtos.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de produtos não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de produtos.",
		}),
	}),
	servicos: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de visualização de serviços não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de serviços.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de serviços não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de serviços.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de serviços não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de serviços.",
		}),
	}),
	planos: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de visualização de planos comerciais não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de planos comerciais.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de planos comerciais não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de planos comerciais.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de planos comerciais não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de planos comerciais.",
		}),
	}),
	propostas: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de proposta não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de proposta.",
				}),
				{
					required_error: "Escopo de visualização de propostas não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de propostas.",
				},
			)
			.optional()
			.nullable(),
		visualizar: z.boolean({
			required_error: "Permissão de visualização de propostas não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de propostas.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de propostas não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de propostas.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de propostas não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de propostas.",
		}),
	}),
	oportunidades: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de oportunidades não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de oportunidades.",
				}),
				{
					required_error: "Escopo de visualização de oportunidades não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de oportunidades.",
				},
			)
			.optional()
			.nullable(), // refere-se ao escopo de atuação
		visualizar: z.boolean({
			required_error: "Permissão de visualização de oportunidades não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de oportunidades.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de oportunidades não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de oportunidades.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de oportunidades não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de oportunidades.",
		}),
	}),
	analisesTecnicas: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de análises técnicas não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de análises técnicas.",
				}),
				{
					required_error: "Escopo de visualização de análises técnicas não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de análises técnicas.",
				},
			)
			.optional()
			.nullable(), // refere-se ao escopo de atuação
		visualizar: z.boolean({
			required_error: "Permissão de visualização de análises técnicas não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de análises técnicas.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de análises técnicas não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de análises técnicas.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de análises técnicas não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de análises técnicas.",
		}),
	}),
	homologacoes: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de homologações não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de homologações.",
				}),
				{
					required_error: "Escopo de visualização de homologações não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de homologações.",
				},
			)
			.optional()
			.nullable(), // refere-se ao escopo de atuação
		visualizar: z.boolean({
			required_error: "Permissão de visualização de homologações não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de homologações.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de homologações não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de homologações.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de homologações não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de homologações.",
		}),
	}),
	clientes: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de clientes não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de clientes.",
				}),
				{
					required_error: "Escopo de visualização de clientes não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de clientes.",
				},
			)
			.optional()
			.nullable(),
		visualizar: z.boolean({
			required_error: "Permissão de visualização de clientes não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de clientes.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de clientes não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de clientes.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de clientes não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de clientes.",
		}),
	}),
	projetos: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de projetos não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de projetos.",
				}),
				{
					required_error: "Escopo de visualização de projetos não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de projetos.",
				},
			)
			.optional()
			.nullable(), // refere-se ao escopo de atuação
		visualizar: z.boolean({
			required_error: "Permissão de visualização de projetos não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de projetos.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de projetos não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de projetos.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de projetos não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de projetos.",
		}),
	}),
	parceiros: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de parceiros não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de parceiros.",
				}),
				{
					required_error: "Escopo de visualização de parceiros não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de parceiros.",
				},
			)
			.optional()
			.nullable(),
		visualizar: z.boolean({
			required_error: "Permissão de visualização de parceiros não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de parceiros.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de parceiros não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de parceiros.",
		}),
		criar: z.boolean({
			required_error: "Permissão de criação de parceiros não informada.",
			invalid_type_error: "Tipo não válido para permissão de criação de parceiros.",
		}),
	}),
	precos: z.object({
		visualizar: z.boolean({
			required_error: "Permissão de edição de preços não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de preços.",
		}),
		editar: z.boolean({
			required_error: "Permissão de edição de preços não informada.",
			invalid_type_error: "Tipo não válido para permissão de edição de preços.",
		}),
	}),
	resultados: z.object({
		escopo: z
			.array(
				z.string({
					required_error: "Item do escopo de visualização de resultados não informado.",
					invalid_type_error: "Tipo não válido para item do escopo de visualização de resultados.",
				}),
				{
					required_error: "Escopo de visualização de resultados não fornecido.",
					invalid_type_error: "Tipo não válido para escopo de visualização de resultados.",
				},
			)
			.optional()
			.nullable(),
		visualizarComercial: z.boolean({
			required_error: "Permissão de visualização de resultados comerciais não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de resultados comerciais.",
		}),
		visualizarOperacional: z.boolean({
			required_error: "Permissão de visualização de resultados operacionais não informada.",
			invalid_type_error: "Tipo não válido para permissão de visualização de resultados operacionais.",
		}),
	}),
	configuracoes: z.object({
		parceiro: z.boolean({
			required_error: "Permissão de configuração de parceiro não informada.",
			invalid_type_error: "Tipo não válido para permissão de configuração de parceiro.",
		}), // able to edit logo, name, etc...
		precificacao: z.boolean({
			required_error: "Permissão de configuração de precificação não informada.",
			invalid_type_error: "Tipo não válido para permissão de configuração de precificação.",
		}), // able to edit margin percentage and tax aliquot
		metodosPagamento: z.boolean({
			required_error: "Permissão de configuração de métodos de pagamento não informada.",
			invalid_type_error: "Tipo não válido para permissão de configuração de métodos de pagamento.",
		}),
		tiposProjeto: z.boolean({
			required_error: "Permissão de configuração de tipos de projeto não informada.",
			invalid_type_error: "Tipo não válido para permissão de configuração de tipos de projeto.",
		}),
		funis: z.boolean({
			required_error: "Permissão de configuração de funis não informada.",
			invalid_type_error: "Tipo não válido para permissão de configuração de funis.",
		}),
		gruposUsuarios: z.boolean({
			required_error: "Permissão de configuração de grupos de usuários não informada.",
			invalid_type_error: "Tipo não válido para configuração de grupos de usuários.",
		}),
	}),
	integracoes: z.object({
		receberLeads: z.boolean({
			required_error: "Permissão de recebimento de leads por integração não informada.",
			invalid_type_error: "Tipo não válido para permissão de recebimento de leads por integração.",
		}),
	}),
});
export type TUserPermissions = z.infer<typeof UserPermissionsSchema>;

export const UserSchema = z.object({
	nome: z
		.string({
			required_error: "Nome do usuário não informado.",
			invalid_type_error: "Tipo não válido para nome do usuário.",
		})
		.min(3, "É necessário que o nome do usuário tenha ao menos 3 letras."),
	administrador: z.boolean({
		required_error: "Tag de administrador não informada.",
		invalid_type_error: "Tipo não válido para tag de administrador.",
	}),
	telefone: z
		.string({
			invalid_type_error: "Tipo não válido para telefone do usuário.",
		})
		.optional()
		.nullable(),
	email: z
		.string({
			required_error: "Email do usuário não informado.",
			invalid_type_error: "Tipo não válido para email do usuário.",
		})
		.email({ message: "Formato inválido de email." }),
	senha: z
		.string({
			required_error: "Senha do usuário não informada.",
			invalid_type_error: "Tipo não válido para senha do usuário.",
		})
		.min(5, "É necessário que a senha do usuário tenha ao menos 5 caracteres."),
	avatar_url: z
		.string({
			invalid_type_error: "Tipo não válido para URL do avatar do usuário.",
		})
		.optional()
		.nullable(),
	idParceiro: z.string({
		required_error: "ID do parceiro do usuário não informado.",
		invalid_type_error: "Tipo não válido para ID do parceiro do usuário.",
	}),
	idGrupo: z
		.string({
			required_error: "Grupo do usuário não informado.",
			invalid_type_error: "Tipo não válido para o grupo do usuário.",
		})
		.min(15, "ID de grupo de usuário inválido."),
	permissoes: UserPermissionsSchema,
	comissoes: z.object({
		semSDR: z.number({ invalid_type_error: "Tipo não válido para comissão sem SDR." }).optional().nullable(),
		comSDR: z.number({ invalid_type_error: "Tipo não válido para comissão com SDR" }).optional().nullable(),
	}),
	// comissionamento: ComissionSchema,
	codigoIndicacaoConecta: z
		.string({
			invalid_type_error: "Tipo não válido para o código de indicação do Conecta.",
		})
		.optional()
		.nullable(),
	ativo: z.boolean(),
	dataInsercao: z
		.string({
			invalid_type_error: "Tipo não válido para data de inserção do usuário.",
		})
		.datetime({
			message: "Data de inserção inválida.",
		})
		.optional()
		.nullable(),
	dataAlteracao: z
		.string({
			invalid_type_error: "Tipo não válido para data de alteração do usuário.",
		})
		.datetime({
			message: "Data de alteração inválida.",
		})
		.optional()
		.nullable(),
});
export type TUser = z.infer<typeof UserSchema>;
