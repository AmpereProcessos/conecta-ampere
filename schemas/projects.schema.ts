import z from 'zod';
import { HomologationSchema } from './homologations.schema';

export const ProductItemSchema = z.object({
	id: z.string({ invalid_type_error: 'Tipo não válido para ID do módulo.' }).optional().nullable(),
	categoria: z.union([z.literal('MÓDULO'), z.literal('INVERSOR'), z.literal('INSUMO'), z.literal('ESTRUTURA'), z.literal('PADRÃO'), z.literal('OUTROS')]),
	fabricante: z.string({
		required_error: 'Fabricante do produto não informado.',
		invalid_type_error: 'Tipo não válido para o fabricante do produto.',
	}),
	modelo: z.string({ required_error: 'Modelo do produto não informado.', invalid_type_error: 'Tipo não válido para o modelo do produto.' }),
	qtde: z.number({ required_error: 'Quantidade do produto não informada.', invalid_type_error: 'Tipo não válido para a quantidade do produto.' }),
	potencia: z.number({ required_error: 'Potência do produto não informada.', invalid_type_error: 'Tipo não válido para a potência do produto.' }).optional().nullable(),
	garantia: z.number({ required_error: 'Garantia do produto não informada.', invalid_type_error: 'Tipo não válido para a garantia do produto.' }),
	valor: z.number({ required_error: 'Valor do produto não informado.', invalid_type_error: 'Tipo não válido para o valor do produto.' }).optional().nullable(),
});
export const ServiceItemSchema = z.object({
	id: z.string({ invalid_type_error: 'Tipo não válido para ID do módulo.' }).optional().nullable(),
	descricao: z.string({ required_error: 'Descrição do serviço não informada.', invalid_type_error: 'Tipo não válido para a descrição do serviço.' }),
	observacoes: z.string({ required_error: 'Observações do serviço não informadas.', invalid_type_error: 'Tipo não válido para observações ' }),
	garantia: z.number({ required_error: 'Garantia do serviço não fornecida.', invalid_type_error: 'Tipo não válido para garantia do serviço.' }),
	valor: z.number({ required_error: 'Valor do serviço não informado.', invalid_type_error: 'Tipo não válido para o valor do serviço.' }).optional().nullable(),
});

export const RestrictionSchema = z.object({
	aplicavel: z.boolean({ invalid_type_error: 'Tipo não válido para a aplicabilidade da restrição.' }).optional().nullable(),
	observacoes: z.string({ invalid_type_error: 'Tipo não válido para as observações da restrição.' }).optional().nullable(),
	data: z.string({ invalid_type_error: 'Tipo não válido para a data da restrição.' }).datetime().optional().nullable(),
	autor: z.object({
		id: z.string({ invalid_type_error: 'Tipo não válido para o ID do autor da restrição.' }),
		nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do autor da restrição.' }),
		avatar_url: z.string({ invalid_type_error: 'Tipo não válido para o avatar do autor da restrição.' }).optional().nullable(),
	}),
});
export type TProjectRestriction = z.infer<typeof RestrictionSchema>;

export const ResourceItemSchema = z.object({
	idMaterial: z.string({ required_error: 'ID do material não informado.', invalid_type_error: 'Tipo não válido para o ID do material.' }),
	nome: z.string({ required_error: 'Nome do material não informado.', invalid_type_error: 'Tipo não válido para o nome do material.' }),
	quantidade: z.number({
		required_error: 'Quantidade do material não informada.',
		invalid_type_error: 'Tipo não válido para a quantidade do material.',
	}),
	quantidadePrevista: z.number({
		required_error: 'Quantidade prevista do material não informada.',
		invalid_type_error: 'Tipo não válido para a quantidade prevista do material.',
	}),
	unidade: z.string({ required_error: 'Unidade do material não informada.', invalid_type_error: 'Tipo não válido para a unidade do material.' }),
	precoUnitario: z.number({
		required_error: 'Preço unitário do material não informado.',
		invalid_type_error: 'Tipo não válido para o preço unitário do material.',
	}),
	movimentacoes: z.array(
		z.object({
			titulo: z.string({
				required_error: 'Título da movimentação não informado.',
				invalid_type_error: 'Tipo não válido para o título da movimentação.',
			}),
			quantidade: z.number({
				required_error: 'Quantidade da movimentação não informada.',
				invalid_type_error: 'Tipo não válido para a quantidade da movimentação.',
			}),
			precoUnitario: z.number({
				required_error: 'Preço unitário da movimentação não informado.',
				invalid_type_error: 'Tipo não válido para o preço unitário da movimentação.',
			}),
			data: z.string({ required_error: 'Data da movimentação não informada.', invalid_type_error: 'Tipo não válido para a data da movimentação.' }),
			idCompra: z.string({ invalid_type_error: 'Tipo não válido para o ID da compra.' }).optional().nullable(),
			idFormularioSaida: z.string({ invalid_type_error: 'Tipo não válido para o ID do formulário de saída.' }).optional().nullable(),
		})
	),
});

export const ProjectTagSchema = z.object({
	id: z.string({ required_error: 'ID da etiqueta inválido.', invalid_type_error: 'Tipo não válido para o ID da etiqueta.' }),
	titulo: z.string({ required_error: 'Título da tag de compra não informado.', invalid_type_error: 'Tipo não válido para o título da tag.' }),
	cores: z.object({
		primaria: z.string({
			required_error: 'Código da cor da etiqueta não fornecido.',
			invalid_type_error: 'Tipo não válido para o código de cor da etiqueta.',
		}),
		secundaria: z.string({
			required_error: 'Código da cor secundária da etiqueta não fornecido.',
			invalid_type_error: 'Tipo não válido para o código de cor secundária da etiqueta.',
		}),
	}),
	dataInsercao: z.string({
		required_error: 'Data de inserção da tag não informada.',
		invalid_type_error: 'Tipo não válido para a data de inserção.',
	}),
});
const MaintenanceItem = z.object({
	titulo: z.string({ required_error: 'Título da manutenção não informado.', invalid_type_error: 'Tipo não válido para o título da manutenção.' }),
	dataEfetivacao: z
		.string({
			required_error: 'Data de efetivação da manutenção não informada.',
			invalid_type_error: 'Tipo não válido para a data de efetivação da manutenção.',
		})
		.optional()
		.nullable(),
});
export const ProjectComissionedUserSchema = z.object({
	idCrm: z.string({ invalid_type_error: 'Tipo não válido para o ID do comissionado.' }).optional().nullable(),
	nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do comissionado.' }),
	papel: z.enum(['VENDEDOR', 'INSIDER', 'INDICADOR', 'ANALISTA TÉCNICO']),
	porcentagem: z.number({ invalid_type_error: 'Tipo não válido para a porcentagem do comissionado.' }),
	valor: z.number({ invalid_type_error: 'Tipo não válido para o valor do comissionado.' }).optional().nullable(),
	avatar_url: z.string({ invalid_type_error: 'Tipo não válido para o avatar do comissionado.' }).optional().nullable(),
	dataEfetivacao: z.string({ invalid_type_error: 'Tipo não válido para a efetivação do comissionado.' }).optional().nullable(),
	dataPagamento: z.string({ invalid_type_error: 'Tipo não válido para o pagamento realizado do comissionado.' }).optional().nullable(),
	dataValidacao: z.string({ invalid_type_error: 'Tipo não válido para a data de validação do comissionado.' }).optional().nullable(),
});
export type TProjectComissionedUser = z.infer<typeof ProjectComissionedUserSchema>;

const ProjectSchema = z.object({
	app: z.object({
		data: z.string({ invalid_type_error: 'Tipo não válido para a data de configuração do app do cliente.' }).optional().nullable(),
		login: z.string({ invalid_type_error: 'Tipo não válido para o login do app do cliente.' }).optional().nullable(),
		senha: z
			.union([z.string({ invalid_type_error: 'Tipo não válido para a senha do app do cliente.' }), z.number()])
			.optional()
			.nullable(),
	}),
	bairro: z.string(),
	canalVenda: z.string(),
	cep: z.union([z.string(), z.number()]).optional().nullable(),
	cidade: z.string(),
	longitude: z.string().optional().nullable(),
	latitude: z.string().optional().nullable(),
	codigoSVB: z.union([z.string(), z.number()]),
	etiquetas: z.array(ProjectTagSchema).optional().nullable(),
	dataValidacaoComercial: z.string({ invalid_type_error: 'Tipo não válido para a data de validação comercial.' }).optional().nullable(),
	comissionamento: z
		.object({
			comercial: z.boolean().optional().nullable(),
			suprimentos: z.boolean().optional().nullable(),
			projetos: z.boolean().optional().nullable(),
		})
		.optional()
		.nullable(),
	comissoes: z
		.object({
			dataReferencia: z.string({ invalid_type_error: 'Tipo não válido para a data de referência da comissão.' }).optional().nullable(),
			valorComissionavel: z.number({ invalid_type_error: 'Tipo não válido para o valor comissionável.' }).optional().nullable(),
			itensComissionaveis: z
				.array(z.enum(['SISTEMA', 'PADRÃO', 'ESTRUTURA PERSONALIZADA', 'OEM', 'SEGURO']))
				.optional()
				.nullable(),
			comissionados: z.array(ProjectComissionedUserSchema).optional().nullable(),

			// Deprecated fields
			efetivado: z
				.boolean({
					invalid_type_error: 'Tipo não válido para a efetivação da comissão.',
				})
				.optional()
				.nullable(),
			pagamentoRealizado: z
				.boolean({
					invalid_type_error: 'Tipo não válido para o pagamento realizado da comissão.',
				})
				.optional()
				.nullable(),
			porcentagemVendedor: z
				.number({
					invalid_type_error: 'Tipo não válido para a porcentagem do vendedor da comissão.',
				})
				.optional()
				.nullable(),
			porcentagemInsider: z
				.number({
					invalid_type_error: 'Tipo não válido para a porcentagem do insider da comissão.',
				})
				.optional()
				.nullable(),

			dataValidacaoVendedor: z.string({ invalid_type_error: 'Tipo não válido para a data de validação do vendedor.' }).optional().nullable(),
			dataValidacaoInsider: z.string({ invalid_type_error: 'Tipo não válido para a data de validação do insider.' }).optional().nullable(),
		})
		.optional()
		.nullable(),
	compra: z.object({
		localizacaoEntrega: z
			.object({
				cep: z.string().optional().nullable(),
				uf: z.string().optional().nullable(),
				cidade: z.string().optional().nullable(),
				bairro: z.string().optional().nullable(),
				endereco: z.string().optional().nullable(),
				numeroOuIdentificador: z.string().optional().nullable(),
				distancia: z.number().optional().nullable(),
				complemento: z.string().optional().nullable(),
				latitude: z.string().optional().nullable(),
				longitude: z.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		atualizacoes: z
			.array(
				z.object({
					data: z
						.string({ required_error: 'Data da atualização não informada.', invalid_type_error: 'Tipo inválido para a data de atualização.' })
						.datetime({ message: 'Formato inválido para a data da atualização.' }),
					descricao: z.string({
						required_error: 'Descrição da atualização não informada.',
						invalid_type_error: 'Tipo não válido para a descrição da atualização.',
					}),
					autor: z.object({
						id: z.string({ invalid_type_error: 'Tipo não válido para o ID do autor da atualização.' }),
						nome: z.string({ invalid_type_error: 'Tipo não válido para o nome do autor da atualização.' }),
						avatar_url: z.string({ invalid_type_error: 'Tipo não válido para o avatar do autor da atualização.' }).optional().nullable(),
					}),
				})
			)
			.optional()
			.nullable(),
		dataEntrega: z.string().optional().nullable(),
		dataLiberacao: z.string().optional().nullable(),
		dataMaxPagamento: z.string().optional().nullable(),
		dataRequisicaoPagamento: z.string().optional().nullable(), // Payment request was sent to client
		dataPagamento: z.string().optional().nullable(), // Money received from client
		dataPagamentoEquipamentos: z.string().optional().nullable(), // Payment to supplier
		dataPedido: z.string().optional().nullable(),
		fornecedor: z.string().optional().nullable(),
		informacoes: z.string().optional().nullable(),
		kitInfo: z.string().optional().nullable(),
		liberacao: z.boolean().optional().nullable(),
		localEntrega: z.string().optional().nullable(),
		previsaoEntrega: z.string().optional().nullable(),
		previsaoValorDoKit: z.number().optional().nullable(),
		rastreio: z.string().optional().nullable(),
		status: z.string().optional().nullable(), // select-options
		statusEntrega: z.string().optional().nullable(), // select-options,
		statusLiberacao: z.string().optional().nullable(), // select-options,
		tipoDoKit: z.string().optional().nullable(), // select-options,
		valorDoKit: z.number().optional().nullable(),
	}),
	alocacoes: z.array(ResourceItemSchema).optional().nullable(),
	conferencias: z.object({
		status: z.enum(['CONCLUÍDO', 'PENDÊNCIAS']).optional().nullable(),
		observacoes: z.string({ invalid_type_error: 'Tipo não válido para as observações da conferência.' }).optional().nullable(),
		energiaInjetada: z.object({ data: z.string().optional().nullable(), status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]) }),
		monitoramentoFeito: z.object({
			data: z.string().optional().nullable(),
			status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
		}),
		usinaLigada: z.object({ data: z.string().optional().nullable(), status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]) }),
	}),
	contrato: z.object({
		dataAssinatura: z.string().optional().nullable(),
		dataLiberacao: z.string().optional().nullable(),
		dataSolicitacao: z.string().optional().nullable(),
		formaAssinatura: z.union([z.literal('FISICO'), z.literal('DIGITAL'), z.literal('NÃO DEFINIDO')]),
		status: z.string().optional().nullable(),
	}),
	cpf_cnpj: z.union([z.string(), z.number()]),
	inscricaoRural: z.string().optional().nullable(),
	dadosCemig: z.object({
		distCreditos: z.union([z.literal('NÃO'), z.literal('SIM'), z.literal('NÃO DEFINIDO')]),
		numeroInstalacao: z.union([z.string(), z.number()]),
		qtdeDistCreditos: z.number().optional().nullable(),
		titularProjeto: z.string(),
	}),
	dataNascimento: z.string().optional().nullable(),
	email: z.string().optional().nullable(),
	produtos: z.array(ProductItemSchema).optional().nullable(),
	servicos: z.array(ServiceItemSchema).optional().nullable(),
	estruturaPersonalizada: z.object({
		aplicavel: z
			.union([z.literal('SIM'), z.literal('NÃO')])
			.optional()
			.nullable(),
		dataEntrega: z.string().optional().nullable(),
		dataMontagem: z.string().optional().nullable(),
		respPagamento: z
			.union([z.literal('CLIENTE'), z.literal('AMPERE'), z.literal('NÃO SE APLICA')])
			.optional()
			.nullable(),
		status: z.string().optional().nullable(),
		statusEntrega: z.string(),
		tipo: z.string().optional().nullable(),
		valor: z.number().optional().nullable(),
	}),
	faturamento: z.object({
		necessarioNotaFiscalAdiantada: z.boolean().optional().nullable(),
		necessarioCodigoFiname: z.boolean().optional().nullable(),
		necessarioInscricaoRural: z.boolean().optional().nullable(),
		cnpjFaturamento: z.union([z.number(), z.string()]),
		concluido: z.boolean().optional().nullable(),
		dataFaturamento: z.string().optional().nullable(),
		empresaFaturamento: z
			.union([z.literal('AMPERE ENERGIAS'), z.literal('ANALISE DO FINANCEIRO'), z.literal('IZAIRA SERVIÇOS')])
			.optional()
			.nullable(),
		observacoes: z.string().optional().nullable(),
		previsaoFaturamento: z.string().optional().nullable(),
	}),
	nomeParceiro: z.string().optional().nullable(),
	idParceiro: z.string().optional().nullable(),
	idProjetoCRM: z.string().optional().nullable(),
	idMarketing: z.string().optional().nullable(),
	idPropostaCRM: z.string().optional().nullable(),
	idClienteCRM: z.string().optional().nullable(),
	idContaAzulVenda: z.string({ invalid_type_error: 'Tipo não válido para ID de referência da venda em Conta Azul.' }).optional().nullable(),
	idContaAzulCliente: z.string({ invalid_type_error: 'Tipo não válido para ID de referência do cliente em Conta Azul.' }).optional().nullable(),
	idSolicitacaoContrato: z.string().optional().nullable(),
	idVisitaTecnica: z.string().optional().nullable(),
	indicacao: z.object({
		contato: z.string().optional().nullable(),
		quemIndicou: z.string().optional().nullable(),
	}),
	insider: z.string().optional().nullable(),
	jornada: z.object({
		assDocumentacoes: z.boolean().optional().nullable(),
		boasVindas: z.boolean().optional().nullable(),
		compraDoKit: z.boolean().optional().nullable(),
		dataEntregaTecnicaPresencial: z.string().optional().nullable(),
		dataEntregaTecnicaRemota: z.string().optional().nullable(),
		dataNps: z.string().optional().nullable(),
		dataUltimoContato: z.string().optional().nullable(),
		entregaDoKit: z.boolean().optional().nullable(),
		entregaTecnica: z.boolean().optional().nullable(),
		entregaTecnicaPresencial: z.boolean().optional().nullable(),
		instalacaoAgendada: z.boolean().optional().nullable(),
		instalacaoRealizada: z.boolean().optional().nullable(),
		jornadaConcluida: z.boolean().optional().nullable(),
		nfFaturada: z.boolean().optional().nullable(),
		obsJornada: z.string().optional().nullable(),
		obsNps: z.string().optional().nullable(),
		prevChegada: z.boolean().optional().nullable(),
		respConcessionaria: z.boolean().optional().nullable(),
		sistemaLigado: z.boolean().optional().nullable(),
		tipoEntregaTecnica: z.union([z.literal('REMOTO'), z.literal('PRESENCIAL')]),
		vistoriaConcessionaria: z.boolean().optional().nullable(),
		contatos: z.string().optional().nullable(),
		cuidados: z.string().optional().nullable(),
		dataConclusao: z.string().optional().nullable(),
	}),
	linkDrive: z.string(),
	links: z.object({
		chamadosSuporte: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		chamadosSuprimentos: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		contratos: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		documentos: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		equipamentos: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		manutencaoPreventiva: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		obras: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		projetos: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
		visitaTecnica: z
			.array(
				z.object({
					title: z.string(),
					link: z.string(),
					format: z.string(),
					category: z.string(),
					// Define the schema for LinksItem here
				})
			)
			.optional()
			.nullable(),
	}),
	logradouro: z.string(),
	manutencaoPreventiva: z.object({
		data: z.string().optional().nullable(),
		status: z.union([z.literal('NÃO REALIZADO'), z.literal('REALIZADO')]),
	}),
	manutencoes: z.array(MaintenanceItem),
	material: z.object({
		avarias: z.boolean().optional().nullable(),
		chamadoIrregularidade: z.boolean().optional().nullable(), // EXCLUIR,
		conferenciaFeita: z.boolean().optional().nullable(),
		descricaoProblema: z.string().optional().nullable(),
		disjuntores: z
			.array(
				z.object({
					corrente: z.number(),
					qtde: z.number(),
					tipo: z.union([z.literal('MONOFÁSICO'), z.literal('BIFÁSICO'), z.literal('TRIFÁSICO')]),
				})
			)
			.optional()
			.nullable(),
		previsaoCustos: z.number().optional().nullable(),
		efetivoCustos: z.number().optional().nullable(),
		entregaFaltando: z.boolean().optional().nullable(),
		materialFaltante: z.string().optional().nullable(),
		statusSeparacao: z.union([z.literal('SEPARADO'), z.literal('NÃO DEFINIDO'), z.literal('INICIAR SEPARAÇÃO')]),
	}),
	medidor: z.object({
		data: z.string().optional().nullable(),
		status: z.string().optional().nullable(),
	}),
	nomeDoContrato: z.string(),
	nomeDoProjeto: z.string(),
	nps: z.number().optional().nullable(),
	satisfacao: z.object({
		venda: z.number().optional().nullable(),
		entrega: z.number().optional().nullable(),
		execucao: z.number().optional().nullable(),
		posVenda: z.number().optional().nullable(),
	}),
	numeroResidencia: z.union([z.string(), z.number()]).optional().nullable(),
	// Define a principal ordem de serviço do projeto (ou seja, aquela que define o serviço principal do projeto, ex: Montagem do Sistema Fotovoltaico p/ projetos de SISTEMA FOTOVOLTAICO)
	idOrdemServico: z.string({ invalid_type_error: 'Tipo não válido para o ID da ordem de serviço.' }).optional().nullable(),
	obra: z.object({
		checklist: z
			.union([z.literal('SIM'), z.literal('NÃO')])
			.optional()
			.nullable(),
		entrada: z.string().optional().nullable(),
		equipeResp: z.string().optional().nullable(),
		laudo: z
			.union([z.literal('EMITIDO'), z.literal('EM ESTUDO'), z.literal('NÃO DEFINIDO')])
			.optional()
			.nullable(),
		observacoes: z.string(),
		saida: z.string().optional().nullable(),
		statusDaObra: z.string().optional().nullable(), // select-options
		statusSolicitacao: z.string().optional().nullable(),
		pendencias: z.string().optional().nullable(),
		trafo: z.string().optional().nullable(),
	}),
	obsComercial: z.string().optional().nullable(),
	oem: z.object({
		aplicavel: z.boolean().optional().nullable(),
		diagnostico: z.string().optional().nullable(),
		duracao: z.number().optional().nullable(),
		dataInicio: z.string().datetime().optional().nullable(),
		dataFim: z.string().datetime().optional().nullable(),
		oemConcluido: z.boolean().optional().nullable(),
		plano: z.string().optional().nullable(),

		qtdeModulos: z.number().optional().nullable(),
		qtdeInversores: z.number().optional().nullable(),

		qtdeManutencoes: z.number().optional().nullable(),
		valor: z.number().optional().nullable(),
	}),
	seguro: z.object({
		aplicavel: z.boolean(),
		valor: z.number().optional().nullable(),
		duracao: z.number().optional().nullable(),
		dataInicio: z.string().optional().nullable(),
		dataFim: z.string().optional().nullable(),
	}),
	ondeTrabalha: z.string(),
	padrao: z.object({
		aumentoCarga: z.object({
			aplicavel: z.boolean(),
			dataEfetivacao: z.string().optional().nullable(),
		}),
		caixaConjugada: z.string().optional().nullable(),
		respInstalacao: z
			.union([z.literal('CLIENTE'), z.literal('AMPERE'), z.literal('NÃO SE APLICA')])
			.optional()
			.nullable(),
		respPagamento: z.string().optional().nullable(),
		tipo: z.string().optional().nullable(),
		tipoEntrada: z
			.union([z.literal('AÉREA'), z.literal('SUBTERRÂNEO')])
			.optional()
			.nullable(),
		valor: z.number().optional().nullable(),
	}),
	pagamento: z.object({
		cobrancaFeita: z.boolean(),
		contatoPagador: z.string(),
		credor: z.string().optional().nullable(), // select options
		credorNomeGerente: z.string().optional().nullable(),
		credorContatoGerente: z.string().optional().nullable(),
		dataRecebimento: z.string().optional().nullable(),
		forma: z
			.union([z.literal('FINANCIAMENTO'), z.literal('CAPITAL PRÓPRIO')])
			.optional()
			.nullable(),
		pagador: z.string(),
		cpf_cnpjPagador: z.string().optional().nullable(),
		retorno: z.number().optional().nullable(),
		status: z.string().optional().nullable(), // select options
		negociacao: z.string().optional().nullable(),
		metodo: z.string().optional().nullable(),
	}),
	parecer: z.object({
		dataParecerDeAcesso: z.string().optional().nullable(),
		motivoReprova: z.string().optional().nullable(),
		parecerReprovado: z.string().optional().nullable(),
		pendencias: z.string().optional().nullable(),
		qtdeDiasObraDeRede: z.number().optional().nullable(),
		qtdeReprovas: z.number().optional().nullable(),
		statusDoParecerDeAcesso: z.string().optional().nullable(), // select options
	}),
	possuiaGD: z.boolean().optional().nullable(),
	possuiDeficiencia: z
		.union([z.literal('SIM'), z.literal('NÃO')])
		.optional()
		.nullable(),
	projeto: z.object({
		acStatus: z.string().optional().nullable(), // select options
		aumentoDeCarga: z.union([z.literal('SIM'), z.literal('NÃO')]),
		dataLiberacaoDocumentacao: z.string().optional().nullable(),
		dataAssDocumentacao: z.string().optional().nullable(),
		dataSolicitacaoAcesso: z.string().optional().nullable(),
		desenhoTelhado: z.string().optional().nullable(),
		diagramaUnifilar: z.string().optional().nullable(),
		mapaDeMicro: z.string().optional().nullable(),
		fechamentoAC: z.string().optional().nullable(),
		formaAssDocumentacao: z
			.union([z.literal('DIGITAL'), z.literal('FISICA')])
			.optional()
			.nullable(),
		iniciar: z
			.union([z.literal('SIM'), z.literal('NÃO'), z.literal('NÃO DEFINIDO')])
			.optional()
			.nullable(),
		projetista: z.object({
			nome: z.string(),
			codigo: z.string(),
		}),
		projetoConcluido: z.union([z.literal('SIM'), z.literal('NÃO')]),
		realizarHomologacao: z.boolean().optional().nullable(),
	}),
	homologacao: HomologationSchema,
	qtde: z.number(),
	qualDeficiencia: z.string().optional().nullable(),
	regional: z.string().nullable(),
	relatorios: z.object({
		envioUm: z.object({
			data: z.string().optional().nullable(),
			status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
		}),
		envioDois: z.object({
			data: z.string().optional().nullable(),
			status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
		}),
		envioTres: z.object({
			data: z.string().optional().nullable(),
			status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
		}),
		envioQuatro: z.object({
			data: z.string().optional().nullable(),
			status: z.union([z.literal('REALIZADO'), z.literal('NÃO REALIZADO')]),
		}),
	}),
	segmento: z.union([z.literal('RESIDENCIAL'), z.literal('RURAL'), z.literal('COMERCIAL'), z.literal('INDUSTRIAL'), z.literal('NÃO DEFINIDO')]),
	sistema: z.object({
		capacidadeBateria: z.number().optional().nullable(),
		marcaBateria: z.string(),
		qtdeBateria: z.number().optional().nullable(),
		tipoBateria: z.string(),
		marcaBomba: z.string(),
		potBomba: z.number().optional().nullable(),
		qtdeBomba: z.number().optional().nullable(),
		marcaControlador: z.string(),
		correnteControlador: z.number().optional().nullable(),
		qtdeControlador: z.number().optional().nullable(),
		tipoControlador: z.string(),
		inversor: z.string(),
		potModulos: z.union([z.number(), z.string()]).optional().nullable(),
		qtdeModulos: z.number().optional().nullable(),
		potPico: z.number(),
		topologia: z
			.union([z.literal('MICRO'), z.literal('INVERSOR'), z.literal('OTIMIZADOR')])
			.optional()
			.nullable(),
		valorProjeto: z.number(),
	}),
	telefone: z.string().optional().nullable(),
	uf: z.string(), // select options
	vendedor: z.object({
		idCRM: z
			.string({
				invalid_type_error: 'Tipo não válido para o ID de referência do CRM.',
			})
			.optional()
			.nullable(),
		codigo: z
			.number({
				required_error: 'Código do vendedor não informado.',
				invalid_type_error: 'Tipo não válido para o código do vendedor.',
			})
			.optional()
			.nullable(),
		nome: z.string({
			required_error: 'Nome do vendedor não informado.',
			invalid_type_error: 'Tipo não válido para o nome do vendedor.',
		}),
		avatar: z
			.string({
				invalid_type_error: 'Tipo não válido para o avatar do vendedor.',
			})
			.optional()
			.nullable(),
	}),
	tipoDeServico: z.string(),
	visitaTecnica: z.object({
		amperagem: z.string().optional().nullable(),
		saidaDoCliente: z
			.union([z.literal('AEREO'), z.literal('SUBTERRANEO')])
			.optional()
			.nullable(),
		status: z.string().optional().nullable(),
		tecnico: z.string().optional().nullable(),
		tipoDaTelha: z.string().optional().nullable(),
	}),
	vistoria: z.object({
		dataPedido: z.string().optional().nullable(),
		equipeDeCampoNecessaria: z
			.union([z.literal('SIM'), z.literal('NÃO')])
			.optional()
			.nullable(),
		motivoReprova: z.string().optional().nullable(),
		qtdeReprovas: z.number().optional().nullable(),
		status: z.string().optional().nullable(), // select options
		vistoriaReprovada: z
			.union([z.literal('SIM'), z.literal('NÃO')])
			.optional()
			.nullable(),
	}),
	restricao: RestrictionSchema.optional().nullable(),
});

export type TProject = z.infer<typeof ProjectSchema>;
export type TProjectDTO = TProject & { _id: string };
