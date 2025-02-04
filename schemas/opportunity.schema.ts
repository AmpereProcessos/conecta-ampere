import { z } from "zod";
import { ElectricalInstallationGroupsEnumSchema, ElectricalInstallationLigationTypesEnumSchema, SaleCategoryEnumSchema } from "./enums.schema";

export const OpportunityInteractionTypesEnum = z.enum(["MENSAGEM", "EMAIL", "REUNIÃO", "VISITA", "ORÇAMENTOS/PROPOSTAS"], {
  required_error: "Tipo de interação não informado.",
  invalid_type_error: "Tipo não válido para o tipo de interação.",
});

const OpportunityResponsibleSchema = z.object({
  id: z.string({ required_error: "ID do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o ID do responsável." }),
  nome: z.string({ required_error: "Nome do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o nome do responsável." }),
  papel: z.string({
    required_error: "Papel do responsável da oportunidade não informado.",
    invalid_type_error: "Tipo não válido para o papel do responsável.",
  }),
  avatar_url: z
    .string({ required_error: "Avatar do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o avatar do responsável." })
    .optional()
    .nullable(),
  telefone: z
    .string({ required_error: "Telefone do responsável da oportunidade não informado.", invalid_type_error: "Tipo não válido para o Telefone do responsável." })
    .optional()
    .nullable(),
  dataInsercao: z
    .string({
      required_error: "Data de inserção do responsável da oportunidade não informado.",
      invalid_type_error: "Tipo não válido para a data de inserção do responsável.",
    })
    .datetime(),
});
export type TOpportunityResponsible = z.infer<typeof OpportunityResponsibleSchema>;

export const OpportunitySchema = z.object({
  nome: z
    .string({ required_error: "Nome da oportunidade não informado.", invalid_type_error: "Tipo não válido para nome da oportunidade." })
    .min(3, "É necessário um nome de ao menos 3 caractéres para a oportunidade."),
  idParceiro: z.string({
    required_error: "Referência a parceiro não informado.",
    invalid_type_error: "Tipo não válido para a referência de parceiro.",
  }),
  tipo: z.object({
    id: z
      .string({
        required_error: "ID de referência do tipo de projeto não encontrado.",
        invalid_type_error: "Tipo não válido para o ID de referência do tipo de projeto.",
      })
      .min(12, "Tipo inválido para ID de tipo deprojeto."),
    titulo: z.string({ required_error: "Titulo do tipo de projeto não encontrado.", invalid_type_error: "Tipo não válido para o titulo do tipo de projeto." }),
  }),
  categoriaVenda: SaleCategoryEnumSchema,
  descricao: z.string({
    required_error: "Descrição da oportunidade não informada.",
    invalid_type_error: "Tipo não válido para descrição da oportunidade.",
  }),
  identificador: z.string({
    required_error: "Identificador da oportunidade não informado.",
    invalid_type_error: "Tipo inválido para identificador da oportunidade.",
  }),
  responsaveis: z
    .array(OpportunityResponsibleSchema, {
      required_error: "Responsável(is) da oportunidade não informados.",
      invalid_type_error: "Tipo não válido para responsáveis da oportunidade.",
    })
    .min(1, "É necessário ao menos 1 responsável."),
  segmento: z
    .union([z.literal("RESIDENCIAL"), z.literal("RURAL"), z.literal("COMERCIAL"), z.literal("INDUSTRIAL")], {
      required_error: "Segmento da oportunidade não informado.",
      invalid_type_error: "Tipo não válido para o segmento da oportunidade.",
    })
    .optional()
    .nullable(),
  idCliente: z.string({ required_error: "Vínculo de cliente não informado.", invalid_type_error: "Tipo não válido para vínculo de cliente." }),
  cliente: z.object({
    nome: z.string({ required_error: "Nome do cliente não informado.", invalid_type_error: "Tipo não válido para nome do cliente." }),
    cpfCnpj: z
      .string({ required_error: "CPF ou CNPJ do cliente não informado.", invalid_type_error: "Tipo não válido para CPF ou CNPJ do cliente." })
      .optional()
      .nullable(),
    telefonePrimario: z.string({ required_error: "Telefone do cliente não informado.", invalid_type_error: "Tipo não válido para telefone do cliente." }),
    email: z.string({ required_error: "Email do cliente não informado.", invalid_type_error: "Tipo não válido para email do cliente." }).optional().nullable(),
    canalAquisicao: z.string({
      required_error: "Canal de aquisição do cliente não informado.",
      invalid_type_error: "Tipo não válido para canal de aquisição do cliente.",
    }),
  }),
  idPropostaAtiva: z.string().optional().nullable(),
  localizacao: z.object({
    cep: z.string().optional().nullable(),
    uf: z.string({
      required_error: "UF de localização da oportunidade não informada.",
      invalid_type_error: "Tipo não válido para a UF de localização da oportunidade.",
    }),
    cidade: z.string({
      required_error: "Cidade de localização da oportunidade não informada.",
      invalid_type_error: "Tipo não válido para a cidade de localização da oportunidade.",
    }),
    bairro: z.string().optional().nullable(),
    endereco: z.string().optional().nullable(),
    numeroOuIdentificador: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    latitude: z.string({ invalid_type_error: "Tipo não válido para latitude da localização da oportunidade." }).optional().nullable(),
    longitude: z.string({ invalid_type_error: "Tipo não válido para longitude da localização da oportunidade." }).optional().nullable(),
    // distancia: z.number().optional().nullable(),
  }),
  perda: z.object({
    idMotivo: z.string().optional().nullable(),
    descricaoMotivo: z.string().optional().nullable(),
    data: z.string().datetime({ message: "Formato inválido para data de perda." }).optional().nullable(),
  }),
  ganho: z.object({
    idProposta: z.string().optional().nullable(),
    idProjeto: z.string().optional().nullable(),
    data: z.string().datetime({ message: "Formato inválido para data de ganho." }).optional().nullable(),
    idSolicitacao: z.string().optional().nullable(),
    dataSolicitacao: z.string().datetime({ message: "Formato inválido para data de solicitação de contrato." }).optional().nullable(),
  }),
  instalacao: z.object({
    concessionaria: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    grupo: ElectricalInstallationGroupsEnumSchema.optional().nullable(),
    tipoLigacao: ElectricalInstallationLigationTypesEnumSchema.optional().nullable(),
    tipoTitular: z
      .union([z.literal("PESSOA FÍSICA"), z.literal("PESSOA JURÍDICA")])
      .optional()
      .nullable(),
    nomeTitular: z.string().optional().nullable(),
  }),
  autor: z.object({
    id: z.string({
      required_error: "ID do criador da oportunidade não informado.",
      invalid_type_error: "Tipo não válido para id do criador da oportunidade.",
    }),
    nome: z.string({
      required_error: "Nome do criador da oportunidade não informado.",
      invalid_type_error: "Tipo não válido para nome do criador da oportunidade.",
    }),
    avatar_url: z.string().optional().nullable(),
  }),
  idMarketing: z
    .string({
      invalid_type_error: "Tipo não válido para o ID de referência do Lead Marketing",
    })
    .optional()
    .nullable(),
  ultimaInteracao: z
    .object({
      tipo: OpportunityInteractionTypesEnum,
      data: z
        .string({ invalid_type_error: "Tipo não válido para data de última interação." })
        .datetime({ message: "Tipo não válido para data de última interação." })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  idIndicacao: z
    .string({
      invalid_type_error: "Tipo não válido para o ID de referência da indicação.",
    })
    .optional()
    .nullable(),
  dataExclusao: z
    .string({ invalid_type_error: "Tipo não válido para data de exclusão." })
    .datetime({ message: "Tipo não válido para data de exclusão." })
    .optional()
    .nullable(),
  dataInsercao: z.string().datetime(),
});
export type TOpportunity = z.infer<typeof OpportunitySchema>;
export type TOpportunityDTO = TOpportunity & { _id: string };
