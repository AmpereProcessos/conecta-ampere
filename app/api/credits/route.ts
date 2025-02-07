import { DATABASE_COLLECTION_NAMES } from "@/configs/app-definitions";
import { EarnRewardsOptions, ReferEarnOptions } from "@/configs/constants";
import { apiHandler, type UnwrapNextResponse } from "@/lib/api/handler";
import { getValidCurrentSessionUncached } from "@/lib/authentication/session";
import connectToCRMDatabase from "@/lib/services/mongodb/crm-db-connection";
import type { TClient } from "@/schemas/client.schema";
import { CreditRedemptionRequestSchema, type TCreditRedemptionRequest } from "@/schemas/credit-redemption-request.schema";
import createHttpError from "http-errors";
import { ObjectId } from "mongodb";
import { NextResponse, type NextRequest as NextRequestType } from "next/server";
import type { z } from "zod";

/**
 *
 * POST ROUTE RELATED
 *
 */
export const CreateCreditRedemptionRequestRouteInput = CreditRedemptionRequestSchema;
export type TCreateCreditRedemptionRequestRouteInput = z.infer<typeof CreateCreditRedemptionRequestRouteInput>;
async function handleCreateCreditRedemptionRequest(req: NextRequestType) {
	const { session, user } = await getValidCurrentSessionUncached();

	const payload = await req.json();
	const creditRedemptionRequest = CreateCreditRedemptionRequestRouteInput.parse(payload);

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);
	const creditRedemptionRequestsCollection = crmDb.collection<TCreditRedemptionRequest>(DATABASE_COLLECTION_NAMES.CREDIT_REDEMPTION_REQUESTS);

	const applicant = await clientsCollection.findOne({ _id: new ObjectId(user.id) });
	if (!applicant) throw new createHttpError.BadRequest("Usuário não encontrado.");

	// Getting reward data on the server for proper validation
	const selectedRewardData = EarnRewardsOptions.find((i) => i.id === creditRedemptionRequest.recompensaResgatada.id);
	if (!selectedRewardData) throw new createHttpError.BadRequest("Recompensa escolhida é inválida.");
	const currentApplicantCreditsAmmount = applicant.conecta?.creditos || 0;
	if (selectedRewardData.requiredCredits > currentApplicantCreditsAmmount) throw new createHttpError.BadRequest("Créditos insuficientes para a recompensa escolhida.");

	// If validations passed, creating the credit redemption request
	const newRequest: TCreditRedemptionRequest = {
		creditosResgatados: selectedRewardData.requiredCredits,
		recompensaResgatada: {
			id: selectedRewardData.id,
			nome: selectedRewardData.label,
			creditosNecessarios: selectedRewardData.requiredCredits,
		},
		requerente: {
			id: applicant._id.toString(),
			nome: applicant.nome,
			avatar_url: applicant.conecta?.avatar_url,
			telefone: applicant.telefonePrimario,
			email: applicant.conecta?.email,
		},
		analista: {},
		pagamento: creditRedemptionRequest.pagamento,
		dataUltimaAtualizacao: creditRedemptionRequest.dataUltimaAtualizacao,
		dataEfetivacao: creditRedemptionRequest.dataEfetivacao,
		dataInsercao: new Date().toISOString(),
	};

	const insertCreditRedemptionRequestResponse = await creditRedemptionRequestsCollection.insertOne(newRequest);

	if (!insertCreditRedemptionRequestResponse.acknowledged) throw new createHttpError.InternalServerError("Oops, houve um erro desconhecido ao criar pedido de resgate de créditos.");

	const insertedId = insertCreditRedemptionRequestResponse.insertedId.toString();

	return NextResponse.json(
		{
			data: { insertedId },
			message: "Pedido de resgate de créditos criado com sucesso !",
		},
		{
			status: 201,
		},
	);
}
export type TCreateCreditRedemptionRequestRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleCreateCreditRedemptionRequest>>>;
export const POST = apiHandler({ POST: handleCreateCreditRedemptionRequest });
/**
 *
 * GET ROUTE RELATED
 *
 */

async function handleGetCreditRedemptionRequests(req: NextRequestType) {
	const { session, user } = await getValidCurrentSessionUncached();

	const searchParams = req.nextUrl.searchParams;
	const id = searchParams.get("id");

	const crmDb = await connectToCRMDatabase();
	const creditRedemptionRequestsCollection = crmDb.collection<TCreditRedemptionRequest>(DATABASE_COLLECTION_NAMES.CREDIT_REDEMPTION_REQUESTS);

	if (id) {
		if (typeof id !== "string" || !ObjectId.isValid(id)) throw new createHttpError.BadRequest("ID inválido.");

		const creditRedemptionRequest = await creditRedemptionRequestsCollection.findOne({
			_id: new ObjectId(id),
			"requerente.id": user.id,
		});
		if (!creditRedemptionRequest) throw new createHttpError.NotFound("Pedido de resgate de créditos não encontrado.");

		return NextResponse.json(
			{
				data: {
					default: undefined,
					byId: { ...creditRedemptionRequest, _id: creditRedemptionRequest._id.toString() },
				},
				message: "Pedido de resgate de créditos encontrado com sucesso !",
			},
			{ status: 200 },
		);
	}

	const creditRedemptionRequests = await creditRedemptionRequestsCollection.find({ "requerente.id": user.id }).toArray();

	return NextResponse.json(
		{
			data: {
				default: creditRedemptionRequests.map((request) => ({
					...request,
					_id: request._id.toString(),
				})),
				byId: undefined,
			},
			message: "Pedidos de resgate de créditos encontrados com sucesso !",
		},
		{ status: 200 },
	);
}

export type TGetCreditRedemptionRequestsRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleGetCreditRedemptionRequests>>>;
export type TGetCreditRedemptionRequestsRouteOutputDataById = Exclude<TGetCreditRedemptionRequestsRouteOutput["data"]["byId"], undefined>;
export type TGetCreditRedemptionRequestsRouteOutputDataDefault = Exclude<TGetCreditRedemptionRequestsRouteOutput["data"]["default"], undefined>;

export const GET = apiHandler({ GET: handleGetCreditRedemptionRequests });
