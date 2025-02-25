import { DATABASE_COLLECTION_NAMES, MATRIX_COMPANY_PARTNER_ID } from "@/configs/app-definitions";
import { apiHandler, type UnwrapNextResponse } from "@/lib/api/handler";
import { getCurrentSessionUncached, getValidCurrentSessionUncached } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TClient } from "@/schemas/client.schema";
import type { TFunnelReference } from "@/schemas/funnel-reference.schema";
import { IndicationSchema, type TIndication } from "@/schemas/indication.schema";
import type { TOpportunity } from "@/schemas/opportunity.schema";
import createHttpError from "http-errors";
import { ObjectId, type WithId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import type { NextRequest as NextRequestType, NextResponse as NextResponseType } from "next/server";
import type { TUser } from "@/schemas/users.schema";

export const CreateIndicationRouteInput = IndicationSchema;
export type TCreateIndicationRouteInput = z.infer<typeof CreateIndicationRouteInput>;
async function handleCreateIndication(req: NextRequestType) {
	const { session, user } = await getValidCurrentSessionUncached();
	const payload = await req.json();
	const indication = CreateIndicationRouteInput.parse(payload);

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const usersCollection = crmDb.collection<TUser>(DATABASE_COLLECTION_NAMES.USERS);
	const opportunitiesCollection = crmDb.collection<TOpportunity>(DATABASE_COLLECTION_NAMES.OPPORTUNITIES);
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);
	const funnelReferencesCollection = crmDb.collection<TFunnelReference>(DATABASE_COLLECTION_NAMES.FUNNEL_REFERENCES);
	// First, inserting the indication
	const insertIndicationResponse = await indicationsCollection.insertOne(indication);
	const indicationId = insertIndicationResponse.insertedId.toString();

	// Then, checking the existence of the same client

	let clientId: string | null = null;
	let clientName: string | null = null;
	let clientPhone: string | null = null;
	let clientEmail: string | null | undefined = null;
	let clientCpfCnpj: string | null = null;
	let clientAcquisitionChannel: string | null = null;
	const client = await clientsCollection.findOne({
		telefonePrimario: indication.telefone,
	});
	if (!client) {
		// If the client does not exist, we create it
		const newClient: TClient = {
			nome: indication.nome,
			idParceiro: MATRIX_COMPANY_PARTNER_ID,
			telefonePrimario: indication.telefone,
			uf: indication.uf,
			cidade: indication.cidade,
			canalAquisicao: "INDICAÇÃO",
			autor: {
				id: indication.autor.id,
				nome: indication.autor.nome,
				avatar_url: indication.autor.avatar_url,
			},
			idIndicacao: indicationId,
			indicador: {
				id: indication.autor.id,
				nome: indication.autor.nome,
				contato: indication.autor.nome,
			},
			dataInsercao: new Date().toISOString(),
		};
		const insertClientResponse = await clientsCollection.insertOne(newClient);
		if (!insertClientResponse.acknowledged) {
			console.error("Error inserting client");
			throw new createHttpError.InternalServerError("Oops, um erro desconhecido ocorreu ao criar a indicação.");
		}
		const insertedClientId = insertClientResponse.insertedId.toString();
		clientId = insertedClientId;
		clientName = newClient.nome;
		clientPhone = newClient.telefonePrimario;
		clientEmail = newClient.email;
		clientCpfCnpj = newClient.cpfCnpj || null;
		clientAcquisitionChannel = newClient.canalAquisicao;
	} else {
		console.log("FOUND EXISTING CLIENT");
		clientId = client._id.toString();
		clientName = client.nome;
		clientPhone = client.telefonePrimario;
		clientEmail = client.email;
		clientCpfCnpj = client.cpfCnpj || null;
		clientAcquisitionChannel = client.canalAquisicao;
	}

	let indicationSeller: WithId<TUser> | null = null;

	if (indication.codigoIndicacaoVendedor) {
		const sellerUser = await usersCollection.findOne({ codigoIndicacaoConecta: indication.codigoIndicacaoVendedor });
		indicationSeller = sellerUser;
	}
	const lastInsertedIdentificator = await opportunitiesCollection.aggregate([{ $project: { identificador: 1 } }, { $sort: { _id: -1 } }, { $limit: 1 }]).toArray();
	const lastIdentifierNumber = lastInsertedIdentificator[0] ? Number(lastInsertedIdentificator[0].identificador.split("-")[1]) : 0;
	const newIdentifierNumber = lastIdentifierNumber + 1;
	const newIdentifier = `CRM-${newIdentifierNumber}`;

	const opportunityToInsert: TOpportunity = {
		nome: indication.nome,
		idParceiro: MATRIX_COMPANY_PARTNER_ID,
		tipo: {
			id: indication.tipo.id,
			titulo: indication.tipo.titulo,
		},
		categoriaVenda: indication.tipo.categoriaVenda,
		descricao: "",
		identificador: newIdentifier,
		responsaveis: [
			indicationSeller
				? {
						id: indicationSeller._id.toString(),
						nome: indicationSeller.nome,
						papel: "VENDEDOR",
						avatar_url: indicationSeller.avatar_url,
						dataInsercao: new Date().toISOString(),
					}
				: {
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
			canalAquisicao: clientAcquisitionChannel || "INDICAÇÃO",
		},
		localizacao: {
			uf: indication.uf,
			cidade: indication.cidade,
		},
		ganho: {},
		perda: {},
		instalacao: {},
		autor: {
			id: indication.autor.id,
			nome: indication.autor.nome,
			avatar_url: indication.autor.avatar_url,
		},
		idIndicacao: indicationId,
		dataExclusao: null,
		dataInsercao: new Date().toISOString(),
	};
	const insertOpportunityResponse = await opportunitiesCollection.insertOne(opportunityToInsert);
	if (!insertOpportunityResponse.acknowledged) {
		console.error("Error inserting opportunity");
		throw new createHttpError.InternalServerError("Oops, um erro desconhecido ocorreu ao criar a indicação.");
	}
	const insertedOpportunityId = insertOpportunityResponse.insertedId.toString();

	const funnelReferenceToInsert: TFunnelReference = {
		idParceiro: "65454ba15cf3e3ecf534b308",
		idOportunidade: insertedOpportunityId,
		idFunil: "661eb0996dd818643c5334f5",
		idEstagioFunil: "1",
		estagios: {
			"1": { entrada: new Date().toISOString() },
		},
		dataInsercao: new Date().toISOString(),
	};
	await funnelReferencesCollection.insertOne(funnelReferenceToInsert);

	// Finally, updating the indication with its respective opportunity
	await indicationsCollection.updateOne(
		{ _id: new ObjectId(indicationId) },
		{
			$set: {
				"oportunidade.id": insertedOpportunityId,
				"oportunidade.nome": opportunityToInsert.nome,
				"oportunidade.identificador": opportunityToInsert.identificador,
			},
		},
	);
	return NextResponse.json(
		{
			data: { insertedId: indicationId },
			message: "Indicação criada com sucesso.",
		},
		{ status: 201 },
	);
}
export type TCreateIndicationRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleCreateIndication>>>;

export const POST = apiHandler({ POST: handleCreateIndication });

async function handleGetIndications(req: NextRequestType) {
	const { session, user } = await getValidCurrentSessionUncached();

	console.log(session, user);
	const crmDb = await connectToCRMDatabase();
	const indicationsCollection = crmDb.collection<TIndication>(DATABASE_COLLECTION_NAMES.INDICATIONS);

	const searchParams = req.nextUrl.searchParams;
	const id = searchParams.get("id");

	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		// Fetching the indication by id and the session user
		const indication = await indicationsCollection.findOne({
			_id: new ObjectId(id),
			"autor.id": user.id,
		});
		if (!indication) throw new createHttpError.NotFound("Indicação não encontrada.");
		return NextResponse.json(
			{
				data: {
					default: undefined,
					byId: { ...indication, _id: indication._id.toString() },
				},
				message: "Indicação encontrada com sucesso !",
			},
			{ status: 200 },
		);
	}

	// Fetching all indications by the session user
	const indications = await indicationsCollection.find({ "autor.id": user.id }).toArray();
	return NextResponse.json(
		{
			data: {
				default: indications.map((indication) => ({
					...indication,
					_id: indication._id.toString(),
				})),
				byId: undefined,
			},
			message: "Indicações encontradas com sucesso !",
		},
		{ status: 200 },
	);
}
export type TGetIndicationsRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleGetIndications>>>;
export type TGetIndicationsRouteOutputDataById = Exclude<TGetIndicationsRouteOutput["data"]["byId"], undefined>;
export type TGetIndicationsRouteOutputDataDefault = Exclude<TGetIndicationsRouteOutput["data"]["default"], undefined>;

export const GET = apiHandler({ GET: handleGetIndications });
