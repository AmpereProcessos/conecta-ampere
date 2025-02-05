import type { ComponentProps } from "react";
import AuthMagicLinkEmaiTemplate from "./templates/AuthMagicLinkTemplate";
import { render } from "@react-email/components";
import { resend } from "../services/email/resend";

export enum EmailTemplate {
	AuthMagicLink = "AuthMagicLink",
	PasswordReset = "PasswordReset",
}

export type PropsMap = {
	[EmailTemplate.AuthMagicLink]: ComponentProps<
		typeof AuthMagicLinkEmaiTemplate
	>;
	// [EmailTemplate.PasswordReset]: ComponentProps<typeof ResetPasswordTemplate>;
};

const getEmailTemplate = <T extends EmailTemplate>(
	template: T,
	props: PropsMap[NoInfer<T>],
) => {
	switch (template) {
		case EmailTemplate.AuthMagicLink:
			return {
				subject: "Verify your email address",
				body: render(
					// @ts-ignore
					<EmailVerificationTemplate
						{...(props as PropsMap[EmailTemplate.AuthMagicLink])}
					/>,
				),
			};
		default:
			throw new Error("Invalid email template");
	}
};

function getReactEmailTemplateAndSubject<T extends EmailTemplate>(
	template: T,
	props: PropsMap[NoInfer<T>],
) {
	switch (template) {
		case EmailTemplate.AuthMagicLink:
			console.log(props);
			return {
				templateComponent: (
					<AuthMagicLinkEmaiTemplate
						{...(props as PropsMap[EmailTemplate.AuthMagicLink])}
					/>
				),
				subject: "Aqui está seu link de acesso ao Conecta Ampère.",
			};
		default:
			throw new Error("Template de email inválido.");
	}
}

export const sendEmailWithResend = async <T extends EmailTemplate>(
	to: string,
	template: T,
	props: PropsMap[NoInfer<T>],
) => {
	try {
		const { templateComponent, subject } = getReactEmailTemplateAndSubject(
			template,
			props,
		);
		const { data, error } = await resend.emails.send({
			from: "Ampère Energias <noreply@ampereenergias.com.br>",
			to: [to],
			subject: subject,
			react: templateComponent,
		});
		console.log("RESPONSE RESEND", data);
		console.log("ERROR RESEND", error);
		return { success: true };
	} catch (error) {
		console.log(error);
	}
};
