import type { TSession } from "@/schemas/session.schema";
import { z } from "zod";

export type TSessionUser = {
	id: string;
	nome: string;
	email?: string | null;
	avatar_url?: string | null;
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
	password: z.string({
		required_error: "Senha não informada.",
		invalid_type_error: "Tipo não válido para a senha.",
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
});
export type TSignUpSchema = z.infer<typeof SignUpSchema>;
