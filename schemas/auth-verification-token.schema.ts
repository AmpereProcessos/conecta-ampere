import { z } from "zod";

const AuthVerificationTokenSchema = z.object({
	token: z.string({
		required_error: "Token de verificação não informado.",
		invalid_type_error: "Tipo não válido para o token de verificação.",
	}),
	usuarioId: z.string({
		required_error: "ID de referência do usuário.",
		invalid_type_error: "Tipo não válido para o ID de referência do usuário.",
	}),
	usuarioEmail: z.string({
		required_error: "Email de referência do usuário.",
		invalid_type_error:
			"Tipo não válido para o email de referência do usuário.",
	}),
	dataExpiracao: z.string({
		required_error: "Data de expiração não informada.",
		invalid_type_error: "Tipo não válido para a data de expiração.",
	}),
	dataInsercao: z.string({
		required_error: "Data de inserção não informada.",
		invalid_type_error: "Tipo não válido para a data de inserção.",
	}),
});

export type TAuthVerificationToken = z.infer<
	typeof AuthVerificationTokenSchema
>;
