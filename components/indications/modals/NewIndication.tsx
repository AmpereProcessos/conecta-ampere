import { useMutation } from '@tanstack/react-query';
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
import type { TSaleCategoryEnum } from '@/schemas/enums.schema';
import type { TIndication } from '@/schemas/indication.schema';
import IndicationDataSeller from './blocks/IndicationDataSeller';
import ProjectTypeSelection from './blocks/ProjectTypeSelection';

type NewIndicationProps = {
	initialState?: Partial<TIndication>;
	sessionUser: TSessionUser;
	projectType?: { id: string; title: string; saleCategory: TSaleCategoryEnum };
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function NewIndication({ sessionUser, projectType, closeModal, callbacks, initialState }: NewIndicationProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const initialHolderState: TIndication = {
		nome: initialState?.nome || '',
		telefone: initialState?.telefone || '',
		uf: initialState?.uf || 'MG',
		cidade: initialState?.cidade || 'ITUIUTABA',
		tipo: {
			id: initialState?.tipo?.id || projectType?.id || '',
			titulo: initialState?.tipo?.titulo || projectType?.title || '',
			categoriaVenda: initialState?.tipo?.categoriaVenda || projectType?.saleCategory || 'KIT',
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
		codigoIndicacaoVendedor: initialState?.codigoIndicacaoVendedor || sessionUser.codigoIndicacaoVendedor,
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState(initialHolderState);
	function updateInfoHolder(changes: Partial<TIndication>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutateCreateIndication, isPending } = useMutation({
		mutationKey: ['create-indication'],
		mutationFn: createIndication,
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			toast.success(data.message);
			if (callbacks?.onSuccess) callbacks.onSuccess();
			setInfoHolder(initialHolderState);
		},
		onSettled: () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});
	return isDesktop ? (
		<Dialog onOpenChange={closeModal} open>
			<DialogContent className="flex h-fit max-h-[80vh] min-h-[60vh] flex-col">
				<DialogHeader>
					<DialogTitle>NOVA INDICAÇÃO</DialogTitle>
					<DialogDescription>Preencha alguns dados sobre a sua indicação.</DialogDescription>
				</DialogHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">
					<IndicationData infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					{infoHolder.tipo.id ? (
						<LoadingButton loading={isPending} onClick={() => mutateCreateIndication(infoHolder)}>
							INDICAR
						</LoadingButton>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer onOpenChange={closeModal} open>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>NOVA INDICAÇÃO</DrawerTitle>
					<DrawerDescription>Preencha alguns dados sobre a sua indicação.</DrawerDescription>
				</DrawerHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">
					<IndicationData infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>
				<DrawerFooter className="pt-2">
					{infoHolder.tipo?.id ? (
						<LoadingButton loading={isPending} onClick={() => mutateCreateIndication(infoHolder)}>
							INDICAR
						</LoadingButton>
					) : null}
					<DrawerClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default NewIndication;

type IndicationDataProps = {
	infoHolder: TIndication;
	updateInfoHolder: (changes: Partial<TIndication>) => void;
};
function IndicationData({ infoHolder, updateInfoHolder }: IndicationDataProps) {
	return (
		<div className="flex h-full w-full flex-col gap-3 px-4">
			{infoHolder.tipo.id ? (
				<>
					<div className="flex w-full flex-col items-center justify-center gap-1 py-2">
						<h1 className="w-full text-center text-sm leading-none tracking-tight lg:text-lg">
							Indicando para: <strong>{infoHolder.tipo.titulo}</strong>{' '}
						</h1>
						<button
							className="cursor-pointer rounded-lg px-2 py-1 font-medium text-[0.65rem] text-primary/80 tracking-tight duration-300 ease-in-out hover:bg-primary/10 hover:text-primary"
							onClick={() => {
								updateInfoHolder({
									tipo: { id: '', titulo: '', categoriaVenda: 'KIT' },
								});
							}}
							type="button"
						>
							Clique aqui para escolher outro Tipo de Indicação
						</button>
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
					<IndicationDataSeller infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</>
			) : (
				<ProjectTypeSelection updateInfoHolder={updateInfoHolder} />
			)}
		</div>
	);
}
