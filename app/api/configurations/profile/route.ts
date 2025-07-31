import createHttpError from 'http-errors';
import { ObjectId, type UpdateFilter } from 'mongodb';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DATABASE_COLLECTION_NAMES } from '@/configs/app-definitions';
import { apiHandler, type UnwrapNextResponse } from '@/lib/api/handler';
import { getValidCurrentSessionUncached } from '@/lib/authentication/session';
import connectToCRMDatabase from '@/lib/services/mongodb/crm-db-connection';
import type { TClient } from '@/schemas/client.schema';

async function handleGetProfile() {
	const { user } = await getValidCurrentSessionUncached();

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);

	const client = await clientsCollection.findOne({ _id: new ObjectId(user.id) });
	if (!client) throw new createHttpError.NotFound('Perfil não encontrado.');

	const profile = {
		id: client._id.toString(),
		avatar: client.conecta?.avatar_url,
		// General information
		nome: client.nome,
		cpfCnpj: client.cpfCnpj,
		dataNascimento: client.dataNascimento,
		sexo: client.sexo,
		rg: client.rg,
		email: client.conecta?.email,
		telefone: client.telefonePrimario,
		profissao: client.profissao,
		ondeTrabalha: client.ondeTrabalha,
		estadoCivil: client.estadoCivil,
		// Location information
		cep: client.cep,
		uf: client.uf,
		cidade: client.cidade,
		bairro: client.bairro,
		endereco: client.endereco,
		numeroOuIdentificador: client.numeroOuIdentificador,
		complemento: client.complemento,
	};

	return NextResponse.json(
		{
			data: profile,
			message: 'Perfil encontrado com sucesso !',
		},
		{
			status: 200,
		}
	);
}
export type TGetUserProfileRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleGetProfile>>>;
export const GET = apiHandler({ GET: handleGetProfile });

export const UpdateProfileRouteInput = z
	.object({
		nome: z
			.string({
				required_error: 'Nome do cliente não informado.',
				invalid_type_error: 'Tipo não válido para nome do cliente.',
			})
			.min(3, 'É necessário um nome de ao menos 3 letras para o cliente.'),
		avatar: z.string({ invalid_type_error: 'Tipo não válido para avatar do cliente.' }).optional().nullable(),
		cpfCnpj: z.string({ invalid_type_error: 'Tipo não válido para CPF/CNPJ do cliente.' }).optional().nullable(),
		dataNascimento: z.string({ invalid_type_error: 'Tipo não válido para data de nascimento do cliente.' }).optional().nullable(),
		sexo: z.enum(['MASCULINO', 'FEMININO', 'OUTRO']).optional().nullable(),
		rg: z.string({ invalid_type_error: 'Tipo não válido para RG do cliente.' }).optional().nullable(),
		email: z.string({ invalid_type_error: 'Tipo não válido para email do cliente.' }).optional().nullable(),
		telefone: z
			.string({
				required_error: 'Telefone do cliente não informado.',
				invalid_type_error: 'Tipo não válido para telefone do cliente.',
			})
			.min(14, 'Formato inválido para telefone. O mínimo de caracteres é 14.'),
		cep: z.string({ invalid_type_error: 'Tipo não válido para CEP do cliente.' }).optional().nullable(),
		uf: z.string({
			required_error: 'UF do cliente não informada.',
			invalid_type_error: 'Tipo não válido para UF do cliente.',
		}),
		cidade: z.string({
			required_error: 'Cidade não informada.',
			invalid_type_error: 'Tipo não válido para cidade do cliente.',
		}),
		bairro: z.string({ invalid_type_error: 'Tipo não válido para bairro do cliente.' }).optional().nullable(),
		endereco: z.string({ invalid_type_error: 'Tipo não válido para endereço do cliente.' }).optional().nullable(),
		numeroOuIdentificador: z.string({ invalid_type_error: 'Tipo não válido para número/identificador.' }).optional().nullable(),
		complemento: z.string({ invalid_type_error: 'Tipo não válido para complemento de endereço.' }).optional().nullable(),
		profissao: z.string({ invalid_type_error: 'Tipo não válido para profissão do cliente.' }).optional().nullable(),
		ondeTrabalha: z.string({ invalid_type_error: 'Tipo não válido para o lugar de trabalho do cliente.' }).optional().nullable(),
		estadoCivil: z.string({ invalid_type_error: 'Tipo não válido para estado civil do cliente.' }).optional().nullable(),
	})
	.partial();
export type TUpdateUserProfileRouteInput = z.infer<typeof UpdateProfileRouteInput>;
async function handleUpdateProfile(req: NextRequest) {
	const { user } = await getValidCurrentSessionUncached();
	const userId = user.id;

	const payload = await req.json();
	const changes = UpdateProfileRouteInput.parse(payload);

	const crmDb = await connectToCRMDatabase();
	const clientsCollection = crmDb.collection<TClient>(DATABASE_COLLECTION_NAMES.CLIENTS);

	const client = await clientsCollection.findOne({ _id: new ObjectId(user.id) });
	if (!client) throw new createHttpError.NotFound('Perfil não encontrado.');

	const clientChanges: UpdateFilter<TClient>['$set'] = Object.entries({
		nome: changes.nome,
		'conecta.avatar_url': changes.avatar,
		cpfCnpj: changes.cpfCnpj,
		dataNascimento: changes.dataNascimento,
		sexo: changes.sexo,
		rg: changes.rg,
		email: changes.email,
		telefonePrimario: changes.telefone,
		cep: changes.cep,
		uf: changes.uf,
		cidade: changes.cidade,
		bairro: changes.bairro,
		endereco: changes.endereco,
		numeroOuIdentificador: changes.numeroOuIdentificador,
		complemento: changes.complemento,
		profissao: changes.profissao,
		ondeTrabalha: changes.ondeTrabalha,
		estadoCivil: changes.estadoCivil,
	}).reduce(
		(acc, [key, value]) => {
			// Only add the field if value is not undefined
			if (value !== undefined && acc) acc[key as keyof typeof acc] = value;
			return acc;
		},
		{} as UpdateFilter<TClient>['$set']
	);

	console.log('CLIENT CHANGES', clientChanges);

	const updateResponse = await clientsCollection.updateOne(
		{
			_id: new ObjectId(user.id),
		},
		{
			$set: { ...clientChanges },
		}
	);

	if (!updateResponse.acknowledged) throw new createHttpError.InternalServerError('Oops, um erro desconhecido ocorreu ao atualizar o perfil.');

	return NextResponse.json({
		data: { updatedId: userId },
		message: 'Perfil atualizado com sucesso !',
	});
}
export type TUpdateUserProfileRouteOutput = UnwrapNextResponse<Awaited<ReturnType<typeof handleUpdateProfile>>>;
export const PUT = apiHandler({ PUT: handleUpdateProfile });
