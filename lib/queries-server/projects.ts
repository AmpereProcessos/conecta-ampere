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
			title: 'Início da sua Jornada',
			description: 'O início da sua jornada começa com a assinatura do contrato. À partir daí, iniciamos os processos que levarão à entrega do seu sistema fotovoltaico.',
			date: journeyStartDate,
		},
		{
			id: 'access-granting-request',
			title: 'Solicitação do Parecer de Acesso',
			description: 'O momento em que solicitamos à concessionária local o parecer de acesso ao seu sistema fotovoltaico.',
			date: accessGrantingRequestDate,
		},
		{
			id: 'access-granting-approval',
			title: 'Parecer de Acesso',
			description: 'A aprovação do parecer de acesso do seu projeto junto à sua concessionária local.',
			date: accessGrantingApprovalDate,
		},
		{
			id: 'equipment-order',
			title: 'Compra dos Equipamentos',
			description: 'O momento em que realizamos a compra dos seus equipamentos.',
			date: equipmentOrderDate,
		},
		{
			id: 'equipment-delivery',
			title: 'Entrega dos Equipamentos',
			description: 'Marca a entrega dos seus equipamentos ao seu endereço.',
			date: equipmentDeliveryDate,
		},
		{
			id: 'service-execution-start',
			title: 'Início da Execução do Serviço',
			description: 'O momento em que iniciamos a execução do serviço de instalação do seu sistema fotovoltaico.',
			date: serviceExecutionStartDate,
		},
		{
			id: 'service-execution-end',
			title: 'Conclusão da Execução do Serviço',
			description: 'Marca a conclusão da execução do serviço de instalação do seu sistema fotovoltaico.',
			date: serviceExecutionEndDate,
		},
		{
			id: 'vistory-request',
			title: 'Solicitação de Vistoria',
			description: 'O momento em que solicitamos à concessionária local a vistoria do seu sistema fotovoltaico.',
			date: vistoryRequestDate,
		},
		{
			id: 'vistory-approval',
			title: 'Vistoria',
			description: 'A aprovação da vistoria do seu sistema fotovoltaico junto à sua concessionária local.',
			date: vistoryApprovalDate,
		},
		{
			id: 'journey-end',
			title: 'Conclusão da sua Jornada',
			description: 'Finalização e entrega do seu tão desejado sistema fotovoltaico.',
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
		status,
		nome: project.nomeDoProjeto,
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
		jornada: journey,
	};
}
