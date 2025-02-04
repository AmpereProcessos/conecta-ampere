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
