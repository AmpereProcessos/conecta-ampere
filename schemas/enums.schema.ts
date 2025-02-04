import { z } from "zod";

export const ElectricalInstallationGroupsEnumSchema = z.enum(["RESIDENCIAL", "COMERCIAL", "INDUSTRIAL", "RURAL"], {
  required_error: "Grupo da instalação elétrica não informado.",
  invalid_type_error: "Tipo não válido para grupo da instalação elétrica.",
});
export type TElectricalInstallationGroupsEnum = z.infer<typeof ElectricalInstallationGroupsEnumSchema>;

export const ElectricalInstallationLigationTypesEnumSchema = z.enum(["NOVA", "EXISTENTE"], {
  required_error: "Tipo da ligação da instalação não informado.",
  invalid_type_error: "Tipo não válido para o tipo da ligação da instalação.",
});
export type TElectricalInstallationLigationTypesEnum = z.infer<typeof ElectricalInstallationLigationTypesEnumSchema>;

export const ElectricalInstallationOwnerTypesEnumSchema = z.enum(["PESSOA FÍSICA", "PESSOA JURÍDICA"], {
  required_error: "Tipo de proprietário da instalação não informado.",
  invalid_type_error: "Tipo não válido para o tipo de proprietário da instalação.",
});
export type TElectricalInstallationOwnerTypesEnum = z.infer<typeof ElectricalInstallationOwnerTypesEnumSchema>;

export const SaleCategoryEnumSchema = z.enum(["KIT", "PLANO", "PRODUTOS", "SERVIÇOS"], {
  required_error: "Categoria de venda não fornecida.",
  invalid_type_error: "Tipo não válido para categoria de venda.",
});
export type TSaleCategoryEnum = z.infer<typeof SaleCategoryEnumSchema>;
