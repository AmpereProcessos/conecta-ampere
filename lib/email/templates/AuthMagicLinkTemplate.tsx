import { Body, Button, Container, Head, Heading, Html, Link, Preview, Section, Text, Img } from "@react-email/components";
import * as React from "react";
import LogoAmpere from "@/assets/images/ampere-vertical-blue-logo-icon-text.png";

const AMPERE_BLUE = "#15599a";
const AMPERE_BG = "#f6f9fc";
const AMPERE_FONT = "'Raleway', Arial, Helvetica, sans-serif";

type AuthMagicLinkEmaiTemplateProps = {
	magicLink: string;
	verificationCode?: string;
	expiresInMinutes: number;
};
const AuthMagicLinkEmaiTemplate = ({ magicLink, verificationCode, expiresInMinutes }: AuthMagicLinkEmaiTemplateProps) => {
	return (
		<Html>
			<Head>
				<link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" />
			</Head>
			<Preview>Seu acesso ao Conecta Ampère</Preview>
			<Body style={main}>
				<Container style={container}>
					{/* Logo e saudação */}
					<Section style={logoSection}>
						{/* <Img src={LogoAmpere.src} alt="Logo Ampère" width={60} height={60} style={{ margin: "0 auto 8px auto", display: "block" }} /> */}
						<Heading style={heading}>Acesse sua conta Conecta Ampère</Heading>
					</Section>

					<Text style={introText}>Olá! Para acessar sua conta, escolha uma das opções abaixo:</Text>

					{/* Código OTP */}
					{verificationCode && (
						<Section style={codeContainer}>
							<Text style={codeLabel}>Digite este código no site:</Text>
							<Text style={codeText}>{verificationCode}</Text>
							<Text style={codeHelp}>Você pode copiar e colar, ou digitar manualmente.</Text>
						</Section>
					)}

					{/* Botão de acesso */}
					<Section style={buttonContainer}>
						<Button href={magicLink} style={button}>
							Acessar com link mágico
						</Button>
					</Section>

					<Text style={expiresText}>
						O código e o link expiram em <b>{expiresInMinutes} minutos</b>.
					</Text>

					{/* Fallback do link */}
					<Section style={fallbackSection}>
						<Text style={fallbackLabel}>Se o botão não funcionar, copie e cole este link no seu navegador:</Text>
						<Link href={magicLink} style={fallbackLink}>
							{magicLink}
						</Link>
					</Section>

					{/* Aviso de segurança */}
					<Text style={securityText}>Se você não solicitou este acesso, pode ignorar este email com segurança.</Text>

					{/* Rodapé */}
					<Text style={footer}>
						Equipe Ampère Energias
						<br />
						<a href="https://conecta.ampereenergias.com.br" style={{ color: AMPERE_BLUE, textDecoration: "underline" }}>
							conecta.ampereenergias.com.br
						</a>
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

const main = {
	backgroundColor: AMPERE_BG,
	fontFamily: AMPERE_FONT,
	padding: 0,
	margin: 0,
};

const container = {
	backgroundColor: "#fff",
	border: "1px solid #e6e6e6",
	borderRadius: "8px",
	margin: "40px auto",
	padding: "32px 24px 24px 24px",
	width: "100%",
	maxWidth: "420px",
	boxShadow: "0 2px 8px rgba(21,89,154,0.04)",
};

const logoSection = {
	textAlign: "center" as const,
	marginBottom: "8px",
};

const heading = {
	color: AMPERE_BLUE,
	fontSize: "22px",
	fontWeight: 700,
	textAlign: "center" as const,
	margin: "0 0 8px 0",
	letterSpacing: "-0.5px",
};

const introText = {
	color: "#222",
	fontSize: "15px",
	textAlign: "center" as const,
	margin: "16px 0 8px 0",
	lineHeight: "22px",
};

const codeContainer = {
	textAlign: "center" as const,
	margin: "24px 0 16px 0",
	padding: "18px 0 10px 0",
	backgroundColor: "#f8f9fa",
	borderRadius: "6px",
	border: "1px solid #e9ecef",
};

const codeLabel = {
	color: AMPERE_BLUE,
	fontSize: "14px",
	fontWeight: 600,
	margin: "0 0 8px 0",
	textAlign: "center" as const,
	letterSpacing: "0.5px",
};

const codeText = {
	color: AMPERE_BLUE,
	fontSize: "32px",
	fontWeight: 700,
	letterSpacing: "8px",
	margin: "0 0 4px 0",
	textAlign: "center" as const,
	fontFamily: "monospace,Consolas,Menlo,monaco,monospace",
};

const codeHelp = {
	color: "#666",
	fontSize: "12px",
	textAlign: "center" as const,
	margin: "4px 0 0 0",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "24px 0 8px 0",
};

const button = {
	borderRadius: "5px",
	color: "#fff",
	fontSize: "16px",
	fontWeight: 700,
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "14px 32px",
	cursor: "pointer",
	backgroundColor: AMPERE_BLUE,
	boxShadow: "0 2px 8px rgba(21,89,154,0.08)",
	border: "none",
	margin: 0,
};

const expiresText = {
	color: "#444",
	fontSize: "13px",
	textAlign: "center" as const,
	margin: "8px 0 0 0",
};

const fallbackSection = {
	margin: "24px 0 0 0",
	padding: 0,
};

const fallbackLabel = {
	color: "#666",
	fontSize: "12px",
	margin: "0 0 4px 0",
	textAlign: "center" as const,
};

const fallbackLink = {
	color: AMPERE_BLUE,
	fontSize: "13px",
	wordBreak: "break-all" as const,
	display: "block",
	textAlign: "center" as const,
	textDecoration: "underline",
	margin: "0 0 8px 0",
};

const securityText = {
	color: "#b71c1c",
	fontSize: "12px",
	textAlign: "center" as const,
	margin: "24px 0 0 0",
	fontWeight: 500,
};

const footer = {
	color: "#8898aa",
	fontSize: "11px",
	lineHeight: "18px",
	marginTop: "32px",
	textAlign: "center" as const,
};

export default AuthMagicLinkEmaiTemplate;
