import type { TSession } from "@/schemas/session.schema";
import { z } from "zod";

export type TSessionUser = {
	id: string;
	nome: string;
	cpfCnpj?: string | null;
	email?: string | null;
	avatar_url?: string | null;
	codigoIndicacaoVendedor?: string | null;
};

export type TAuthSession = {
	session: TSession;
	user: TSessionUser;
};

export const LoginSchema = z.object({
	username: z.string({
		required_error: "Usuário não informado.",
		invalid_type_error: "Tipo não válido para o usuário.",
	}),
});
export type TLoginSchema = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
	name: z.string({
		required_error: "Nome não informado.",
		invalid_type_error: "Tipo não válido para nome.",
	}),
	email: z
		.string({
			required_error: "Email não fornecido.",
			invalid_type_error: "Tipo não válido para email.",
		})
		.email({ message: "Formato inválido para email." }),
	phone: z.string({
		required_error: "Telefone não informado.",
		invalid_type_error: "Tipo não válido para telefone.",
	}),
	uf: z.string({
		required_error: "Estado não informado.",
		invalid_type_error: "Tipo não válido para estado.",
	}),
	city: z.string({
		required_error: "Cidade não informada.",
		invalid_type_error: "Tipo não válido para cidade.",
	}),
	inviteId: z
		.string({
			invalid_type_error: "Tipo não válido para referência do convite.",
		})
		.optional()
		.nullable(),
	termsAndPrivacyPolicyAcceptanceDate: z
		.string({
			required_error: "Data de aceitação dos termos de uso e política de privacidade não informada.",
			invalid_type_error: "Tipo não válido para a data de aceitação dos termos de uso e política de privacidade",
		})
		.optional()
		.nullable(),
});
export type TSignUpSchema = z.infer<typeof SignUpSchema>;

export const SignUpViaPromoterSchema = z.object({
	name: z.string({
		required_error: "Nome não informado.",
		invalid_type_error: "Tipo não válido para nome.",
	}),
	email: z
		.string({
			required_error: "Email não fornecido.",
			invalid_type_error: "Tipo não válido para email.",
		})
		.email({ message: "Formato inválido para email." }),
	phone: z.string({
		required_error: "Telefone não informado.",
		invalid_type_error: "Tipo não válido para telefone.",
	}),
	uf: z.string({
		required_error: "Estado não informado.",
		invalid_type_error: "Tipo não válido para estado.",
	}),
	city: z.string({
		required_error: "Cidade não informada.",
		invalid_type_error: "Tipo não válido para cidade.",
	}),
	invitesPromoterId: z.string({
		invalid_type_error: "Tipo não válido para referência do promotor do convite.",
	}),
	termsAndPrivacyPolicyAcceptanceDate: z
		.string({
			required_error: "Data de aceitação dos termos de uso e política de privacidade não informada.",
			invalid_type_error: "Tipo não válido para a data de aceitação dos termos de uso e política de privacidade",
		})
		.optional()
		.nullable(),
});
export type TSignUpViaPromoterSchema = z.infer<typeof SignUpViaPromoterSchema>;

export const ResendVerificationTokenSchema = z.object({
	userId: z.string({
		required_error: "Referência do usuário não informada.",
		invalid_type_error: "Tipo não válido para referência do usuário.",
	}),
});
export type TResendVerificationTokenSchema = z.infer<typeof ResendVerificationTokenSchema>;
