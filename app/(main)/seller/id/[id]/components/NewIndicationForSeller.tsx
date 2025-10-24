'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/buttons/loading-button';
import SelectInput from '@/components/inputs/SelectInput';
import TextInput from '@/components/inputs/TextInput';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions } from '@/configs/states_cities';
import type { TSessionUser } from '@/lib/authentication/types';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatToPhone } from '@/lib/methods/formatting';
import { createIndication } from '@/lib/mutations/indications';
import type { TIndication } from '@/schemas/indication.schema';

type NewIndicationForSellerProps = {
	sessionUser: TSessionUser;
	sellerId: string;
	sellerName: string;
	closeModal: () => void;
};
export default function NewIndicationForSeller({ sessionUser, sellerId, sellerName, closeModal }: NewIndicationForSellerProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const queryClient = useQueryClient();

	const initialHolderState: TIndication = {
		nome: '',
		telefone: '',
		uf: 'MG',
		cidade: 'ITUIUTABA',
		tipo: {
			id: '661dc2e36dd818643c532cda',
			titulo: 'SISTEMA FOTOVOLTAICO',
			categoriaVenda: 'KIT',
		},
		autor: {
			id: sessionUser.id,
			nome: sessionUser.nome,
			avatar_url: sessionUser.avatar_url,
		},
		oportunidade: {
			id: '',
			nome: '',
			identificador: '',
		},
		codigoIndicacaoVendedor: sellerId,
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState(initialHolderState);
	function updateInfoHolder(changes: Partial<TIndication>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutateCreateIndication, isPending } = useMutation({
		mutationKey: ['create-indication-for-seller', sellerId],
		mutationFn: createIndication,
		onSuccess: (data) => {
			toast.success(data.message);
			setInfoHolder(initialHolderState);
			queryClient.invalidateQueries({ queryKey: ['indications'] });
			closeModal();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});

	const content = (
		<div className="flex h-full w-full flex-col gap-3 px-4">
			<div className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-primary/5 py-3">
				<p className="w-full text-center text-sm leading-none tracking-tight">
					Indicando para: <strong>{sellerName}</strong>
				</p>
				<p className="text-primary/70 text-xs">Esta indicação será atribuída diretamente a este vendedor</p>
			</div>
			<TextInput
				handleChange={(value) => updateInfoHolder({ nome: value })}
				labelText="NOME DA PESSOA INDICADA"
				placeholderText="Preencha aqui o nome da pessoa que está indicando..."
				value={infoHolder.nome}
			/>
			<TextInput
				handleChange={(value) => updateInfoHolder({ telefone: formatToPhone(value) })}
				labelText="TELEFONE DA PESSOA INDICADA"
				placeholderText="Preencha aqui o telefone da pessoa que está indicando..."
				value={infoHolder.telefone}
			/>
			<SelectInput
				handleChange={(value) =>
					updateInfoHolder({
						uf: value,
						cidade: BrazilianCitiesOptionsFromUF(value)[0]?.value,
					})
				}
				handleReset={() => updateInfoHolder({ uf: 'MG', cidade: 'ITUIUTABA' })}
				labelText="ESTADO(UF) DA PESSOA INDICADA"
				options={BrazilianStatesOptions}
				placeholderText="Preencha aqui o estado federativo da pessoa indicada..."
				resetOptionText="NÃO DEFINIDO"
				value={infoHolder.uf}
			/>
			<SelectInput
				handleChange={(value) => updateInfoHolder({ cidade: value })}
				handleReset={() => updateInfoHolder({ cidade: 'ITUIUTABA' })}
				labelText="CIDADE DA PESSOA INDICADA"
				options={BrazilianCitiesOptionsFromUF(infoHolder.uf)}
				placeholderText="Preencha aqui o cidade da pessoa indicada..."
				resetOptionText="NÃO DEFINIDO"
				value={infoHolder.cidade}
			/>
		</div>
	);

	return isDesktop ? (
		<Dialog onOpenChange={closeModal} open>
			<DialogContent className="flex h-fit max-h-[80vh] min-h-[60vh] flex-col">
				<DialogHeader>
					<DialogTitle>INDICAR ALGUÉM PARA {sellerName.toUpperCase()}</DialogTitle>
					<DialogDescription>Preencha os dados da pessoa que você está indicando.</DialogDescription>
				</DialogHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">{content}</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					<LoadingButton loading={isPending} onClick={() => mutateCreateIndication(infoHolder)}>
						INDICAR
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer onOpenChange={closeModal} open>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>INDICAR ALGUÉM</DrawerTitle>
					<DrawerDescription>Preencha os dados da pessoa que você está indicando para {sellerName}.</DrawerDescription>
				</DrawerHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">{content}</div>
				<DrawerFooter className="pt-2">
					<LoadingButton loading={isPending} onClick={() => mutateCreateIndication(infoHolder)}>
						INDICAR
					</LoadingButton>
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
