import createHttpError from 'http-errors';
import { ObjectId } from 'mongodb';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import type { TProject } from '@/schemas/projects.schema';
import { getCurrentSessionUncached } from '../authentication/session';
import { getProjectContractValue } from '../methods/utils';
import connectToProjectsDatabase from '../services/mongodb/projects-db-connection';

export async function getProjectJourneyById(id: string) {
	const { session } = await getCurrentSessionUncached();
	if (!session) throw new createHttpError.Unauthorized('Você não está autenticado.');
	const db = await connectToProjectsDatabase();
	const projectsCollection = db.collection<TProject>(DATABASE_COLLECTION_NAMES.PROJECTS);
	const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
	if (!project) throw new createHttpError.NotFound('Projeto não encontrado.');

	const journeyStartDate = project.contrato.dataAssinatura ? new Date(project.contrato.dataAssinatura) : null;
	const accessGrantingRequestDate = project.homologacao.acesso.dataSolicitacao ? new Date(project.homologacao.acesso.dataSolicitacao) : null;
	const accessGrantingApprovalDate = project.homologacao.acesso.dataResposta ? new Date(project.homologacao.acesso.dataResposta) : null;
	const equipmentOrderDate = project.compra.dataPedido ? new Date(project.compra.dataPedido) : null;
	const equipmentDeliveryDate = project.compra.dataEntrega ? new Date(project.compra.dataEntrega) : null;
	const serviceExecutionStartDate = project.obra.entrada ? new Date(project.obra.entrada) : null;
	const serviceExecutionEndDate = project.obra.saida ? new Date(project.obra.saida) : null;
	const vistoryRequestDate = project.homologacao.vistoria.dataSolicitacao ? new Date(project.homologacao.vistoria.dataSolicitacao) : null;
	const vistoryApprovalDate = project.homologacao.vistoria.dataEfetivacao ? new Date(project.homologacao.vistoria.dataEfetivacao) : null;
	const journeyEndDate = project.homologacao.vistoria.dataEfetivacao ? new Date(project.homologacao.vistoria.dataEfetivacao) : null;

	const journey = [
		{
			id: 'journey-start',
			date: journeyStartDate,
		},
		{
			id: 'access-granting-request',
			date: accessGrantingRequestDate,
		},
		{
			id: 'access-granting-approval',
			date: accessGrantingApprovalDate,
		},
		{
			id: 'equipment-order',
			date: equipmentOrderDate,
		},
		{
			id: 'equipment-delivery',
			date: equipmentDeliveryDate,
		},
		{
			id: 'service-execution-start',
			date: serviceExecutionStartDate,
		},
		{
			id: 'service-execution-end',
			date: serviceExecutionEndDate,
		},
		{
			id: 'vistory-request',
			date: vistoryRequestDate,
		},
		{
			id: 'vistory-approval',
			date: vistoryApprovalDate,
		},
		{
			id: 'journey-end',
			date: journeyEndDate,
		},
	];

	function getStatus(start: Date | null, end: Date | null) {
		if (end) return 'CONCLUÍDO';
		if (start) return 'EM ANDAMENTO';
		return 'NÃO INICIADO';
	}
	const status = getStatus(journeyStartDate, journeyEndDate);
	return {
		id: project._id.toString(),
		indexador: project.qtde,
		status,
		nome: project.nomeDoContrato,
		tipo: project.tipoDeServico,
		potencia: project.sistema.potPico,
		valor: getProjectContractValue({
			projectValue: project.sistema.valorProjeto,
			paValue: project.padrao.valor,
			structureValue: project.estruturaPersonalizada.valor,
			oemValue: project.oem.valor,
			insuranceValue: project.seguro.valor,
		}),
		vendedor: {
			nome: project.vendedor.nome,
			avatar_url: project.vendedor.avatar ?? undefined,
		},
		localizacao: {
			cep: project.cep?.toString(),
			uf: project.uf,
			cidade: project.cidade,
			bairro: project.bairro,
			endereco: project.logradouro,
			numeroOuIdentificador: project.numeroResidencia?.toString(),
			latitude: project.latitude,
			longitude: project.longitude,
		},
		app: {
			login: project.app.login,
			senha: project.app.senha,
			data: project.app.data,
		},
		jornada: journey,
	};
}

export type TGetProjectJourneyByIdOutput = Awaited<ReturnType<typeof getProjectJourneyById>>;
