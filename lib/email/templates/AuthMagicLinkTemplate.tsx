import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

type AuthMagicLinkEmaiTemplateProps = {
	magicLink: string;
	expiresInMinutes: number;
};
const AuthMagicLinkEmaiTemplate = ({
	magicLink,
	expiresInMinutes,
}: AuthMagicLinkEmaiTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>Seu link de acesso chegou!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Heading style={heading}>Entre na sua conta Conecta Ampére.</Heading>
					<Section style={buttonContainer}>
						<Button
							href={magicLink}
							style={{
								...button,
								backgroundColor: "#15599a",
							}}
						>
							CLIQUE AQUI PARA ACESSAR
						</Button>
					</Section>
					<Text style={text}>
						Se você não solicitou este email, por favor ignore-o.
					</Text>
					<Text style={text}>
						Este link expira em {expiresInMinutes} minutos.
					</Text>
					<Text style={footer}>
						Se o botão não funcionar, copie e cole este link no seu navegador:
						<br />
						<Link
							href={magicLink}
							style={{
								color: "#15599a",
								textDecoration: "underline",
							}}
						>
							{magicLink}
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily: "Helvetica,Arial,sans-serif",
};

const container = {
	backgroundColor: "#ffffff",
	border: "1px solid #f0f0f0",
	borderRadius: "5px",
	margin: "40px auto",
	padding: "20px",
	width: "465px",
};

const heading = {
	color: "#15599a",
	fontSize: "24px",
	fontWeight: "bold",
	textAlign: "center",
	margin: "30px 0",
};

const buttonContainer = {
	textAlign: "center",
	margin: "30px 0",
};

const button = {
	borderRadius: "5px",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center",
	display: "inline-block",
	padding: "12px 30px",
	cursor: "pointer",
};

const text = {
	color: "#444",
	fontSize: "15px",
	lineHeight: "24px",
	textAlign: "center",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
	lineHeight: "22px",
	marginTop: "30px",
	textAlign: "center",
};

export default AuthMagicLinkEmaiTemplate;
