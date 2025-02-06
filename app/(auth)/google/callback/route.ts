import {
	CONECTA_AMPERE_CRM_USER_DATA,
	DATABASE_COLLECTION_NAMES,
	MATRIX_COMPANY_PARTNER_ID,
} from "@/configs/app-definitions";
import { ReferEarnOptions } from "@/configs/constants";
import {
	google,
	GOOGLE_OAUTH_STATE_COOKIE_NAME,
	GOOGLE_OAUTH_VERIFIER_COOKIE_NAME,
	type GoogleUserOpenIDConnect,
} from "@/lib/authentication/providers";
import {
	createSession,
	generateSessionToken,
	setSetSessionCookie,
} from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TClient } from "@/schemas/client.schema";
import type { TFunnelReference } from "@/schemas/funnel-reference.schema";
import type { TOpportunity } from "@/schemas/opportunity.schema";
import type { TSession } from "@/schemas/session.schema";
import { OAuth2RequestError } from "arctic";
import { type Collection, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { geolocation } from "@vercel/functions";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
	// const userRequestLocation = geolocation(request);
	const cookieStore = await cookies();

	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const storedState =
		cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE_NAME)?.value ?? null;
	const codeVerifier =
		cookieStore.get(GOOGLE_OAUTH_VERIFIER_COOKIE_NAME)?.value ?? null;

	if (
		!code ||
		!state ||
		!storedState ||
		state !== storedState ||
		!codeVerifier
	) {
		return new Response(null, {
			status: 400,
			headers: { Location: "/login" },
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);

		// console.log("GOOGLE OAUTH TOKENS", tokens);
		const accessToken = tokens.accessToken();
		const refreshToken = tokens.hasRefreshToken()
			? tokens.refreshToken()
			: null;
		// console.log("GOOGLE OAUTH ACCESS TOKEN", accessToken);
		// console.log("GOOGLE OAUTH REFRESH TOKEN", refreshToken);
		const googleOpenIdConnectResponse = await fetch(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		const googleUser: GoogleUserOpenIDConnect =
			await googleOpenIdConnectResponse.json();

		// console.log("GOOGLE USER", googleUser);

		if (!googleUser.email || !googleUser.email_verified) {
			return new Response(
				JSON.stringify({
					error: "Sua conta precisa de um email verificado.",
				}),
				{ status: 400, headers: { Location: "/login" } },
			);
		}

		const crmDb = await connectToCRMDatabase();
		const clientsCollection = crmDb.collection<TClient>(
			DATABASE_COLLECTION_NAMES.CLIENTS,
		);
		const opportunitiesCollection = crmDb.collection<TOpportunity>(
			DATABASE_COLLECTION_NAMES.OPPORTUNITIES,
		);
		const funnelReferencesCollection = crmDb.collection<TFunnelReference>(
			DATABASE_COLLECTION_NAMES.FUNNEL_REFERENCES,
		);
		const conectaSessionsCollection = crmDb.collection<TSession>(
			DATABASE_COLLECTION_NAMES.SESSIONS,
		);

		let clientId: string | null = null;
		const existingUser = await clientsCollection.findOne({
			$or: [
				{ email: googleUser.email },
				{ "conecta.googleId": googleUser.sub },
			],
		});

		if (!existingUser) {
			const newClient: TClient = {
				nome: googleUser.name,
				idParceiro: MATRIX_COMPANY_PARTNER_ID,
				telefonePrimario: "",
				uf: "",
				cidade: "",
				email: googleUser.email,
				canalAquisicao: "CONECTA AMPÈRE",
				indicador: {},
				conecta: {
					usuario: googleUser.email,
					email: googleUser.email,
					avatar_url: googleUser.picture,
					senha: "",
					googleId: googleUser.sub,
					googleRefreshToken: tokens.refreshToken(),
				},
				autor: CONECTA_AMPERE_CRM_USER_DATA,
				dataInsercao: new Date().toISOString(),
			};

			const insertClientResponse = await clientsCollection.insertOne(newClient);
			if (!insertClientResponse.acknowledged)
				return new Response(
					JSON.stringify({
						error: "Oops, um erro desconhecido ocorreu.",
					}),
					{ status: 400, headers: { Location: "/login" } },
				);
			const insertedClientId = insertClientResponse.insertedId.toString();
			clientId = insertedClientId;

			const newOpportunityIdentifier = await getNewOpportunityIdentifier(
				opportunitiesCollection,
			);

			let opportunityId: string | null = null;
			const newOpportunity: TOpportunity = {
				nome: newClient.nome,
				idParceiro: MATRIX_COMPANY_PARTNER_ID,
				tipo: {
					id: ReferEarnOptions[0].projectTypeId,
					titulo: ReferEarnOptions[0].projectType,
				},
				categoriaVenda: ReferEarnOptions[0].projectTypeSaleCategory,
				descricao: "",
				identificador: newOpportunityIdentifier,
				responsaveis: [
					{
						id: "6463ccaa8c5e3e227af54d89",
						nome: "LUCAS FERNANDES",
						papel: "VENDEDOR",
						avatar_url:
							"https://firebasestorage.googleapis.com/v0/b/sistemaampere.appspot.com/o/saas-crm%2Fusuarios%2FLUCAS%20FERNANDES?alt=media&token=3b345c22-c4d2-46cc-865e-8544e29e76a4",
						dataInsercao: new Date().toISOString(),
					},
				],
				segmento: "RESIDENCIAL" as TOpportunity["segmento"],
				idCliente: clientId as string,
				cliente: {
					nome: newClient.nome,
					cpfCnpj: newClient.cpfCnpj,
					telefonePrimario: newClient.telefonePrimario,
					email: newClient.email,
					canalAquisicao: "CONECTA AMPÈRE",
				},
				localizacao: {
					uf: "",
					cidade: "",
				},
				ganho: {},
				perda: {},
				instalacao: {},
				autor: CONECTA_AMPERE_CRM_USER_DATA,
				dataExclusao: null,
				dataInsercao: new Date().toISOString(),
			};
			const insertOpportunityResponse =
				await opportunitiesCollection.insertOne(newOpportunity);

			opportunityId = insertOpportunityResponse.insertedId.toString();

			const newFunnelReference: TFunnelReference = {
				idParceiro: "65454ba15cf3e3ecf534b308",
				idOportunidade: opportunityId,
				idFunil: "661eb0996dd818643c5334f5",
				idEstagioFunil: "1",
				estagios: {
					"1": { entrada: new Date().toISOString() },
				},
				dataInsercao: new Date().toISOString(),
			};
			await funnelReferencesCollection.insertOne(newFunnelReference);
		} else {
			clientId = existingUser._id.toString();

			await clientsCollection.updateOne(
				{
					_id: new ObjectId(clientId),
				},
				{
					$set: {
						"conecta.usuario":
							existingUser.conecta?.usuario || googleUser.email,
						"conecta.avatar_url":
							existingUser.conecta?.avatar_url || googleUser.picture,
						"conecta.email": existingUser.conecta?.email || googleUser.email,
						"conecta.googleId":
							existingUser.conecta?.googleId || googleUser.sub,
						"conecta.googleRefreshToken":
							existingUser.conecta?.googleRefreshToken || refreshToken,
					},
				},
			);
		}

		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});

		return new Response(null, {
			status: 302,
			headers: { Location: "/" },
		});
	} catch (error) {
		// the specific error message depends on the provider
		if (error instanceof OAuth2RequestError) {
			// invalid code
			return new Response(JSON.stringify({ error: "Código inválido." }), {
				status: 400,
			});
		}
		console.error(error);

		return new Response(
			JSON.stringify({ error: "Oops, um erro desconhecido ocorreu." }),
			{
				status: 500,
			},
		);
	}
}

async function getNewOpportunityIdentifier(
	collection: Collection<TOpportunity>,
) {
	const lastInsertedIdentificator = await collection
		.aggregate([
			{ $project: { identificador: 1 } },
			{ $sort: { _id: -1 } },
			{ $limit: 1 },
		])
		.toArray();
	const lastIdentifierNumber = lastInsertedIdentificator[0]
		? Number(lastInsertedIdentificator[0].identificador.split("-")[1])
		: 0;
	const newIdentifierNumber = lastIdentifierNumber + 1;
	const newIdentifier = `CRM-${newIdentifierNumber}`;

	return newIdentifier;
}
