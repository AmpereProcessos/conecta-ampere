import axios from "axios";
import { z } from "zod";

const NotificationOnNewIndicationInput = z.object({
	tipo: z.enum(["NEW_OPPORTUNITY"]),
	payload: z.object({
		responsaveisIds: z.array(
			z.string({
				required_error: "O ID do responsável é obrigatório",
			}),
		),
		autor: z.object({
			nome: z.string({
				required_error: "O nome do autor é obrigatório",
			}),
			avatar_url: z
				.string({
					required_error: "A URL do avatar do autor é obrigatória",
					invalid_type_error: "A URL do avatar do autor deve ser uma string",
				})
				.optional()
				.nullable(),
		}),
		oportunidade: z.object({
			id: z.string({
				required_error: "O ID da oportunidade é obrigatório",
			}),
			identificador: z.string({
				required_error: "O identificador da oportunidade é obrigatório",
			}),
			nome: z.string({
				required_error: "O nome da oportunidade é obrigatório",
			}),
		}),
	}),
});
export type TNotifyCRMResponsiblesOnNewIndicationParams = z.infer<typeof NotificationOnNewIndicationInput>;

async function notifyCRMResponsiblesOnNewIndication(input: TNotifyCRMResponsiblesOnNewIndicationParams) {
	try {
		console.log("[INFO] Notifying CRM responsible on new indication");

		const { data } = await axios.post(`https://crm.ampereenergias.com.br/api/notifications?apiKey=${process.env.SECRET_INTERNAL_COMMUNICATION_API_TOKEN}`, input);
		console.log("[INFO] Notification sent to CRM", data);
		return { success: true };
	} catch (error) {
		console.error("[ERROR] Error notifying CRM", error);
		return { success: false };
	}
}

export { notifyCRMResponsiblesOnNewIndication };
