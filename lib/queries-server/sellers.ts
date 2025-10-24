import { ObjectId } from 'mongodb';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import type { TProject } from '@/schemas/projects.schema';
import type { TUser } from '@/schemas/users.schema';
import connectToCRMDatabase from '../services/mongodb/crm-db-connection';
import connectToProjectsDatabase from '../services/mongodb/projects-db-connection';

export async function getSellerPublicProfileById(id: string) {
	const appDb = await connectToProjectsDatabase();
	const crmDb = await connectToCRMDatabase();
	const usersCollection = crmDb.collection<TUser>(DATABASE_COLLECTION_NAMES.USERS);
	const projectsCollection = appDb.collection<TProject>(DATABASE_COLLECTION_NAMES.PROJECTS);
	const seller = await usersCollection.findOne({
		_id: new ObjectId(id),
	});
	if (!seller) throw new Error('Vendedor não encontrado.');

	const sellerUFVProjects = await projectsCollection
		.find(
			{
				'vendedor.idCRM': seller._id.toString(),
				tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
				imagemCapaUrl: { $ne: null },
			},
			{
				projection: {
					_id: 1,
					qtde: 1,
					uf: 1,
					cidade: 1,
					tipoDeServico: 1,
					'sistema.potPico': 1,
					imagemCapaUrl: 1,
				},
			}
		)
		.toArray();

	const sellerUFVProjectsData = sellerUFVProjects.map((project) => {
		return {
			id: project._id.toString(),
			tipo: project.tipoDeServico,
			indexador: project.qtde,
			localizacaoUF: project.uf,
			localizacaoCidade: project.cidade,
			imagemCapaUrl: project.imagemCapaUrl,
		};
	});

	const sellerUFVStatsAggregation = (await projectsCollection
		.aggregate([
			{
				$match: {
					'vendedor.idCRM': seller._id.toString(),
					tipoDeServico: { $in: ['SISTEMA FOTOVOLTAICO', 'AUMENTO DE SISTEMA FOTOVOLTAICO'] },
				},
			},
			{
				$group: {
					_id: null,
					qtdeVendida: {
						$count: {},
					},
					potenciaVendida: {
						$sum: '$sistema.potPico',
					},
				},
			},
		])
		.toArray()) as {
		qtdeVendida: number;
		potenciaVendida: number;
	}[];

	const sellerUFVStats = sellerUFVStatsAggregation[0];
	return {
		vendedor: {
			nome: seller.nome,
			telefone: seller.telefone,
			email: seller.email,
			avatarUrl: seller.avatar_url,
		},
		projetos: sellerUFVProjectsData,
		estatisticas: {
			qtdeVendida: sellerUFVStats?.qtdeVendida ?? 0,
			potenciaVendida: sellerUFVStats?.potenciaVendida ?? 0,
		},
	};
}
export type TGetSellerPublicProfileByIdOutput = Awaited<ReturnType<typeof getSellerPublicProfileById>>;
