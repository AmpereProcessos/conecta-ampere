"use server";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import {
	LoginSchema,
	ResendVerificationTokenSchema,
	SignUpSchema,
	type TResendVerificationTokenSchema,
	type TLoginSchema,
	type TSignUpSchema,
	type TSignUpViaPromoterSchema,
	SignUpViaPromoterSchema,
	type TSignUpViaSellerInviteSchema,
	SignUpViaSellerInviteSchema,
} from "./types";
import type { TClient } from "@/schemas/client.schema";
import { createSession, generateSessionToken, setSetSessionCookie } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import { ObjectId, type Collection, type Filter } from "mongodb";
import { CONECTA_AMPERE_CRM_USER_DATA, DATABASE_COLLECTION_NAMES, MATRIX_COMPANY_PARTNER_ID } from "@/configs/app-definitions";
import type { TOpportunity } from "@/schemas/opportunity.schema";
import { ReferEarnOptions } from "@/configs/constants";
import type { TFunnelReference } from "@/schemas/funnel-reference.schema";
import { sendEmailWithResend, EmailTemplate } from "../email";
import type { TAuthVerificationToken } from "@/schemas/auth-verification-token.schema";
import { randomBytes } from "node:crypto";
import dayjs from "dayjs";
import type { TInvite } from "@/schemas/invites.schema";
import type { TIndication } from "@/schemas/indication.schema";
import type { TUser } from "@/schemas/users.schema";

type TLoginResult = {
	formError?: string;
	fieldError?: {
		[key in keyof TLoginSchema]?: string;
	};
};
export async function login(_: TLoginResult, data: TLoginSchema): Promise<TLoginResult> {
	const validationParsed = LoginSchema.safeParse(data);
	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		return {
			fieldError: {
				username: err.fieldErrors.username?.[0],
			},
		};
	}

	const { username } = validationParsed.data;

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const authVerificationTokensCollection = crmDb.collection<TAuthVerificationToken>(DATABASE_COLLECTION_NAMES.VERIFICATION_TOKENS);

	const user = await clientsCollection.findOne({ "conecta.usuario": username }, { projection: { conecta: 1 } });
	if (!user || !user.conecta || !user.conecta.email) {
		return {
			formError: "Usuário incorreto.",
		};
	}

	const verificationToken = randomBytes(32).toString("hex");
	const verificationTokenExpiresInMinutes = 30;
	const newVerificationToken: TAuthVerificationToken = {
		token: verificationToken,
		usuarioId: user._id.toString(),
		usuarioEmail: user.conecta.email,
		dataExpiracao: dayjs().add(verificationTokenExpiresInMinutes, "minute").toISOString(),
		dataInsercao: new Date().toISOString(),
	};
	const insertAuthVerificationTokenResponse = await authVerificationTokensCollection.insertOne(newVerificationToken);
	if (!insertAuthVerificationTokenResponse.acknowledged)
		return {
			formError: "Oops, um erro desconhecido ocorreu, tente novamente.",
		};

	const insertedAuthVerificationTokenId = insertAuthVerificationTokenResponse.insertedId.toString();

	await sendEmailWithResend(user.conecta?.email, EmailTemplate.AuthMagicLink, {
		magicLink: `${process.env.NEXT_PUBLIC_URL}/magic-link/verify/callback?token=${verificationToken}`,
		expiresInMinutes: verificationTokenExpiresInMinutes,
	});

	return redirect(`/magic-link/verify?id=${insertedAuthVerificationTokenId}`);
}

type TSignResult = {
	formError?: string;
	fieldError?: {
		[key in keyof TSignUpSchema]?: string;
	};
};
export async function signUp(_: TSignResult, data: TSignUpSchema): Promise<TSignResult> {
	const validationParsed = SignUpSchema.safeParse(data);

	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		return {
			fieldError: {
				name: err.fieldErrors.name?.[0],
				email: err.fieldErrors.email?.[0],
				phone: err.fieldErrors.name?.[0],
				uf: err.fieldErrors.uf?.[0],
				city: err.fieldErrors.city?.[0],
				termsAndPrivacyPolicyAcceptanceDate: err.fieldErrors.termsAndPrivacyPolicyAcceptanceDate?.[0],
			},
		};
	}

	const { name, email, phone, uf, city, termsAndPrivacyPolicyAcceptanceDate, inviteId } = validationParsed.data;

	if (!termsAndPrivacyPolicyAcceptanceDate) {
		return {
			formError: "Para criar sua conta, é necessário aceitar os Termos de Uso e a Política de Privacidade.",
		};
	}
	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const invitesCollection = crmDb.collection<TInvite>(DATABASE_COLLECTION_NAMES.INVITES);
	const opportunitiesCollection = crmDb.collection<TOpportunity>(DATABASE_COLLECTION_NAMES.OPPORTUNITIES);
	const funnelReferencesCollection = crmDb.collection<TFunnelReference>(DATABASE_COLLECTION_NAMES.FUNNEL_REFERENCES);
	let clientId: string | null = null;
	let clientName: string | null = null;
	let clientPhone: string | null = null;
	let clientEmail: string | null | undefined = null;
	let clientCpfCnpj: string | null = null;
	let clientAcquisitionChannel: string | null = null;
	// First, checking for possible existing client in db
	const query: Filter<TClient> = {
		$or: [{ email: email }, { telefonePrimario: phone }],
	};
	const existingClientInDb = await clientsCollection.findOne({ ...query });

	let invite: TInvite | null = null;
	if (inviteId) invite = await invitesCollection.findOne({ _id: new ObjectId(inviteId) });
	const invitePromoterSellerCode = invite && invite.promotor.tipo === "VENDEDOR" ? invite.promotor.codigoIndicacao : null;

	if (existingClientInDb) {
		console.log("CLIENT FOUND", existingClientInDb._id, existingClientInDb.nome);
		await clientsCollection.updateOne(
			{ _id: new ObjectId(existingClientInDb._id) },
			{
				$set: {
					"conecta.codigoIndicacaoVendedor": invitePromoterSellerCode,
				},
			},
		);
		// In case there is an existing client in db
		clientId = existingClientInDb._id.toString();
		clientName = existingClientInDb.nome;
		clientPhone = existingClientInDb.telefonePrimario;
		clientEmail = existingClientInDb.email;
		clientCpfCnpj = existingClientInDb.cpfCnpj || null;
		clientAcquisitionChannel = existingClientInDb.canalAquisicao;
	} else {
		console.log("CLIENT NOT FOUND, CREATING CLIENT");
		// In case there is no existing client in db
		const newClient: TClient = {
			nome: name,
			idParceiro: MATRIX_COMPANY_PARTNER_ID,
			telefonePrimario: phone,
			email: email,
			uf: uf,
			cidade: city,
			canalAquisicao: "CONECTA AMPÈRE",
			indicador: {},
			conecta: {
				usuario: phone,
				email: email,
				senha: "",
				conviteId: inviteId,
				conviteDataAceite: invite ? new Date().toISOString() : null,
				codigoIndicacaoVendedor: invitePromoterSellerCode,
			},
			autor: CONECTA_AMPERE_CRM_USER_DATA,
			dataInsercao: new Date().toISOString(),
		};
		try {
			const insertClientResponse = await clientsCollection.insertOne(newClient);
			if (!insertClientResponse.acknowledged)
				return {
					formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
				};
			const insertedClientId = insertClientResponse.insertedId.toString();
			clientId = insertedClientId;
			clientName = newClient.nome;
			clientPhone = newClient.telefonePrimario;
			clientEmail = newClient.email;
			clientCpfCnpj = newClient.cpfCnpj || null;
			clientAcquisitionChannel = newClient.canalAquisicao;
		} catch (error) {
			console.log("INSERT CLIENT ERROR", error);
			return {
				formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
			};
		}
	}

	// Handling the CRM opportunity automation for new registers on Conecta Ampère
	try {
		const newOpportunityIdentifier = await getNewOpportunityIdentifier(opportunitiesCollection);

		let opportunityId: string | null = null;
		const newOpportunity: TOpportunity = {
			nome: name,
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
				nome: clientName,
				cpfCnpj: clientCpfCnpj,
				telefonePrimario: clientPhone,
				email: clientEmail,
				canalAquisicao: clientAcquisitionChannel || "CONECTA AMPÈRE",
			},
			localizacao: {
				uf: uf,
				cidade: city,
			},
			ganho: {},
			perda: {},
			instalacao: {},
			autor: CONECTA_AMPERE_CRM_USER_DATA,
			dataExclusao: null,
			dataInsercao: new Date().toISOString(),
		};
		const insertOpportunityResponse = await opportunitiesCollection.insertOne(newOpportunity);
		if (!insertOpportunityResponse.acknowledged)
			return {
				formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
			};
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

		// Updating the invite if it exists
		if (inviteId)
			await invitesCollection.updateOne(
				{ _id: new ObjectId(inviteId) },
				{
					$set: {
						convidado: {
							id: clientId,
							nome: name,
							telefone: phone,
							email: email,
							uf: uf,
							cidade: city,
						},
						dataInformacoesDefinidas: new Date().toISOString(),
						dataAceite: new Date().toISOString(),
					},
				},
			);
		// In case the opportunity creation succedded, redirecting the user
		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return redirect("/dashboard");
	} catch (error) {
		console.log("Error during opportunity automation of signup", error);
		// In case the opportunity creation failed, just redirecting the user
		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return redirect("/dashboard");
	}
}

type TSignUpViaPromoterResult = {
	formError?: string;
	fieldError?: {
		[key in keyof TSignUpViaPromoterSchema]?: string;
	};
};
export async function signUpViaPromoter(_: TSignResult, data: TSignUpViaPromoterSchema): Promise<TSignUpViaPromoterResult> {
	const validationParsed = SignUpViaPromoterSchema.safeParse(data);

	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		return {
			fieldError: {
				name: err.fieldErrors.name?.[0],
				email: err.fieldErrors.email?.[0],
				phone: err.fieldErrors.name?.[0],
				uf: err.fieldErrors.uf?.[0],
				city: err.fieldErrors.city?.[0],
				termsAndPrivacyPolicyAcceptanceDate: err.fieldErrors.termsAndPrivacyPolicyAcceptanceDate?.[0],
			},
		};
	}

	const { name, email, phone, uf, city, termsAndPrivacyPolicyAcceptanceDate, invitesPromoterId } = validationParsed.data;

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const usersCollection = crmDb.collection<TUser>(DATABASE_COLLECTION_NAMES.USERS);
	const opportunitiesCollection = crmDb.collection<TOpportunity>(DATABASE_COLLECTION_NAMES.OPPORTUNITIES);
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);
	const funnelReferencesCollection = crmDb.collection<TFunnelReference>(DATABASE_COLLECTION_NAMES.FUNNEL_REFERENCES);

	const promoter = await clientsCollection.findOne({ _id: new ObjectId(invitesPromoterId) });
	if (!promoter)
		return {
			formError: "Promotor não encontrado.",
		};
	const newIndication: TIndication = {
		nome: name,
		telefone: phone,
		uf: uf,
		cidade: city,
		tipo: {
			id: ReferEarnOptions[0].projectTypeId,
			titulo: ReferEarnOptions[0].projectType,
			categoriaVenda: ReferEarnOptions[0].projectTypeSaleCategory,
		},
		oportunidade: {
			id: "",
			nome: "",
			identificador: "",
			dataGanho: null,
			dataPerda: null,
			dataInteracao: null,
		},
		codigoIndicacaoVendedor: null,
		dataInsercao: new Date().toISOString(),
		autor: CONECTA_AMPERE_CRM_USER_DATA,
	};
	const insertIndicationResponse = await indicationsCollection.insertOne(newIndication);
	const indicationId = insertIndicationResponse.insertedId.toString();

	let clientId: string | null = null;
	let clientName: string | null = null;
	let clientPhone: string | null = null;
	let clientEmail: string | null | undefined = null;
	let clientCpfCnpj: string | null = null;
	let clientAcquisitionChannel: string | null = null;
	// First, checking for possible existing client in db
	const query: Filter<TClient> = {
		$or: [{ email: email }, { telefonePrimario: phone }],
	};
	const existingClientInDb = await clientsCollection.findOne({ ...query });

	if (existingClientInDb) {
		console.log("CLIENT FOUND", existingClientInDb._id, existingClientInDb.nome);
		// In case there is an existing client in db
		clientId = existingClientInDb._id.toString();
		clientName = existingClientInDb.nome;
		clientPhone = existingClientInDb.telefonePrimario;
		clientEmail = existingClientInDb.email;
		clientCpfCnpj = existingClientInDb.cpfCnpj || null;
		clientAcquisitionChannel = existingClientInDb.canalAquisicao;
	} else {
		console.log("CLIENT NOT FOUND, CREATING CLIENT");
		// In case there is no existing client in db
		const newClient: TClient = {
			nome: name,
			idParceiro: MATRIX_COMPANY_PARTNER_ID,
			telefonePrimario: phone,
			email: email,
			uf: uf,
			cidade: city,
			canalAquisicao: "CONECTA AMPÈRE",
			idIndicacao: indicationId,
			indicador: {
				id: promoter._id.toString(),
				nome: promoter.nome,
				contato: promoter.telefonePrimario,
			},
			conecta: {
				usuario: phone,
				email: email,
				senha: "",
			},
			autor: CONECTA_AMPERE_CRM_USER_DATA,
			dataInsercao: new Date().toISOString(),
		};
		try {
			const insertClientResponse = await clientsCollection.insertOne(newClient);
			if (!insertClientResponse.acknowledged)
				return {
					formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
				};
			const insertedClientId = insertClientResponse.insertedId.toString();
			clientId = insertedClientId;
			clientName = newClient.nome;
			clientPhone = newClient.telefonePrimario;
			clientEmail = newClient.email;
			clientCpfCnpj = newClient.cpfCnpj || null;
			clientAcquisitionChannel = newClient.canalAquisicao;
		} catch (error) {
			console.log("INSERT CLIENT ERROR", error);
			return {
				formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
			};
		}
	}
	// Handling the CRM opportunity automation for new registers on Conecta Ampère
	try {
		const newOpportunityIdentifier = await getNewOpportunityIdentifier(opportunitiesCollection);

		let opportunityId: string | null = null;
		const newOpportunity: TOpportunity = {
			nome: name,
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
				nome: clientName,
				cpfCnpj: clientCpfCnpj,
				telefonePrimario: clientPhone,
				email: clientEmail,
				canalAquisicao: clientAcquisitionChannel || "CONECTA AMPÈRE",
			},
			localizacao: {
				uf: uf,
				cidade: city,
			},
			ganho: {},
			perda: {},
			instalacao: {},
			idIndicacao: indicationId,
			autor: CONECTA_AMPERE_CRM_USER_DATA,
			dataExclusao: null,
			dataInsercao: new Date().toISOString(),
		};
		const insertOpportunityResponse = await opportunitiesCollection.insertOne(newOpportunity);
		if (!insertOpportunityResponse.acknowledged)
			return {
				formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
			};
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

		// Finally, updating the indication with its respective opportunity
		await indicationsCollection.updateOne(
			{ _id: new ObjectId(indicationId) },
			{
				$set: {
					"oportunidade.id": opportunityId,
					"oportunidade.nome": newOpportunity.nome,
					"oportunidade.identificador": newOpportunity.identificador,
				},
			},
		);

		// In case the opportunity creation succedded, redirecting the user
		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return redirect("/dashboard");
	} catch (error) {
		console.log("Error during opportunity automation of signup", error);
		// In case the opportunity creation failed, just redirecting the user
		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return redirect("/dashboard");
	}
}

export type TSignUpViaSellerInviteResult = {
	formError?: string;
	fieldError?: {
		[key in keyof TSignUpViaSellerInviteSchema]?: string;
	};
};
export async function signUpViaSellerInvite(_: TSignUpViaSellerInviteResult, data: TSignUpViaSellerInviteSchema): Promise<TSignUpViaSellerInviteResult> {
	const validationParsed = SignUpViaSellerInviteSchema.safeParse(data);

	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		return {
			fieldError: {
				name: err.fieldErrors.name?.[0],
				email: err.fieldErrors.email?.[0],
				phone: err.fieldErrors.name?.[0],
				uf: err.fieldErrors.uf?.[0],
				city: err.fieldErrors.city?.[0],
				termsAndPrivacyPolicyAcceptanceDate: err.fieldErrors.termsAndPrivacyPolicyAcceptanceDate?.[0],
			},
		};
	}

	const { name, email, phone, uf, city, termsAndPrivacyPolicyAcceptanceDate, invitesSellerId } = validationParsed.data;

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const usersCollection = crmDb.collection<TUser>(DATABASE_COLLECTION_NAMES.USERS);
	const opportunitiesCollection = crmDb.collection<TOpportunity>(DATABASE_COLLECTION_NAMES.OPPORTUNITIES);
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);
	const funnelReferencesCollection = crmDb.collection<TFunnelReference>(DATABASE_COLLECTION_NAMES.FUNNEL_REFERENCES);

	const seller = await usersCollection.findOne({ _id: new ObjectId(invitesSellerId) });
	if (!seller)
		return {
			formError: "Vendedor não encontrado.",
		};
	const newIndication: TIndication = {
		nome: name,
		telefone: phone,
		uf: uf,
		cidade: city,
		tipo: {
			id: ReferEarnOptions[0].projectTypeId,
			titulo: ReferEarnOptions[0].projectType,
			categoriaVenda: ReferEarnOptions[0].projectTypeSaleCategory,
		},
		oportunidade: {
			id: "",
			nome: "",
			identificador: "",
			dataGanho: null,
			dataPerda: null,
			dataInteracao: null,
		},
		codigoIndicacaoVendedor: null,
		dataInsercao: new Date().toISOString(),
		autor: CONECTA_AMPERE_CRM_USER_DATA,
	};
	const insertIndicationResponse = await indicationsCollection.insertOne(newIndication);
	const indicationId = insertIndicationResponse.insertedId.toString();

	let clientId: string | null = null;
	let clientName: string | null = null;
	let clientPhone: string | null = null;
	let clientEmail: string | null | undefined = null;
	let clientCpfCnpj: string | null = null;
	let clientAcquisitionChannel: string | null = null;
	// First, checking for possible existing client in db
	const query: Filter<TClient> = {
		$or: [{ email: email }, { telefonePrimario: phone }],
	};
	const existingClientInDb = await clientsCollection.findOne({ ...query });

	if (existingClientInDb) {
		console.log("CLIENT FOUND", existingClientInDb._id, existingClientInDb.nome);
		// In case there is an existing client in db
		clientId = existingClientInDb._id.toString();
		clientName = existingClientInDb.nome;
		clientPhone = existingClientInDb.telefonePrimario;
		clientEmail = existingClientInDb.email;
		clientCpfCnpj = existingClientInDb.cpfCnpj || null;
		clientAcquisitionChannel = existingClientInDb.canalAquisicao;
	} else {
		console.log("CLIENT NOT FOUND, CREATING CLIENT");
		// In case there is no existing client in db
		const newClient: TClient = {
			nome: name,
			idParceiro: MATRIX_COMPANY_PARTNER_ID,
			telefonePrimario: phone,
			email: email,
			uf: uf,
			cidade: city,
			canalAquisicao: "CONECTA AMPÈRE",
			idIndicacao: indicationId,
			indicador: {},
			conecta: {
				usuario: phone,
				email: email,
				senha: "",
			},
			autor: CONECTA_AMPERE_CRM_USER_DATA,
			dataInsercao: new Date().toISOString(),
		};
		try {
			const insertClientResponse = await clientsCollection.insertOne(newClient);
			if (!insertClientResponse.acknowledged)
				return {
					formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
				};
			const insertedClientId = insertClientResponse.insertedId.toString();
			clientId = insertedClientId;
			clientName = newClient.nome;
			clientPhone = newClient.telefonePrimario;
			clientEmail = newClient.email;
			clientCpfCnpj = newClient.cpfCnpj || null;
			clientAcquisitionChannel = newClient.canalAquisicao;
		} catch (error) {
			console.log("INSERT CLIENT ERROR", error);
			return {
				formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
			};
		}
	}
	// Handling the CRM opportunity automation for new registers on Conecta Ampère
	try {
		const newOpportunityIdentifier = await getNewOpportunityIdentifier(opportunitiesCollection);

		let opportunityId: string | null = null;
		const newOpportunity: TOpportunity = {
			nome: name,
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
					id: seller._id.toString(),
					nome: seller.nome,
					papel: "VENDEDOR",
					avatar_url: seller.avatar_url,
					dataInsercao: new Date().toISOString(),
				},
			],
			segmento: "RESIDENCIAL" as TOpportunity["segmento"],
			idCliente: clientId as string,
			cliente: {
				nome: clientName,
				cpfCnpj: clientCpfCnpj,
				telefonePrimario: clientPhone,
				email: clientEmail,
				canalAquisicao: clientAcquisitionChannel || "CONECTA AMPÈRE",
			},
			localizacao: {
				uf: uf,
				cidade: city,
			},
			ganho: {},
			perda: {},
			instalacao: {},
			idIndicacao: indicationId,
			autor: CONECTA_AMPERE_CRM_USER_DATA,
			dataExclusao: null,
			dataInsercao: new Date().toISOString(),
		};
		const insertOpportunityResponse = await opportunitiesCollection.insertOne(newOpportunity);
		if (!insertOpportunityResponse.acknowledged)
			return {
				formError: "Oops, houve um erro desconhecido ao realizar cadastro.",
			};
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

		// Finally, updating the indication with its respective opportunity
		await indicationsCollection.updateOne(
			{ _id: new ObjectId(indicationId) },
			{
				$set: {
					"oportunidade.id": opportunityId,
					"oportunidade.nome": newOpportunity.nome,
					"oportunidade.identificador": newOpportunity.identificador,
				},
			},
		);

		// In case the opportunity creation succedded, redirecting the user
		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return redirect("/dashboard");
	} catch (error) {
		console.log("Error during opportunity automation of signup", error);
		// In case the opportunity creation failed, just redirecting the user
		const sessionToken = await generateSessionToken();
		const session = await createSession({
			token: sessionToken,
			userId: clientId,
		});
		setSetSessionCookie({
			token: sessionToken,
			expiresAt: session.dataExpiracao,
		});
		return redirect("/dashboard");
	}
}

async function getNewOpportunityIdentifier(collection: Collection<TOpportunity>) {
	const lastInsertedIdentificator = await collection.aggregate([{ $project: { identificador: 1 } }, { $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
	const lastIdentifierNumber = lastInsertedIdentificator[0] ? Number(lastInsertedIdentificator[0].identificador.split("-")[1]) : 0;
	const newIdentifierNumber = lastIdentifierNumber + 1;
	const newIdentifier = `CRM-${newIdentifierNumber}`;

	return newIdentifier;
}

type TResendVerificationTokenResult = {
	actionError?: string;
};

export async function resendVerificationToken(_: TResendVerificationTokenResult, data: TResendVerificationTokenSchema): Promise<TResendVerificationTokenResult> {
	const validationParsed = ResendVerificationTokenSchema.safeParse(data);

	if (!validationParsed.success) {
		const err = validationParsed.error.flatten();
		return {
			actionError: err.fieldErrors.userId?.[0],
		};
	}

	const { userId } = validationParsed.data;
	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const authVerificationTokensCollection = crmDb.collection<TAuthVerificationToken>(DATABASE_COLLECTION_NAMES.VERIFICATION_TOKENS);

	const client = await clientsCollection.findOne({ _id: new ObjectId(userId) });
	if (!client || !client.conecta?.email)
		return {
			actionError: "Usuário não encontrado.",
		};

	await authVerificationTokensCollection.deleteMany({ usuarioId: userId });

	const verificationToken = randomBytes(32).toString("hex");
	const verificationTokenExpiresInMinutes = 30;
	const newVerificationToken: TAuthVerificationToken = {
		token: verificationToken,
		usuarioId: client._id.toString(),
		usuarioEmail: client.conecta.email,
		dataExpiracao: dayjs().add(verificationTokenExpiresInMinutes, "minute").toISOString(),
		dataInsercao: new Date().toISOString(),
	};
	const insertAuthVerificationTokenResponse = await authVerificationTokensCollection.insertOne(newVerificationToken);
	if (!insertAuthVerificationTokenResponse.acknowledged)
		return {
			actionError: "Oops, um erro desconhecido ocorreu, tente novamente.",
		};

	const insertedAuthVerificationTokenId = insertAuthVerificationTokenResponse.insertedId.toString();

	await sendEmailWithResend(client.conecta?.email, EmailTemplate.AuthMagicLink, {
		magicLink: `${process.env.NEXT_PUBLIC_URL}/magic-link/verify/callback?token=${verificationToken}`,
		expiresInMinutes: verificationTokenExpiresInMinutes,
	});

	return redirect(`/magic-link/verify?id=${insertedAuthVerificationTokenId}`);
}
