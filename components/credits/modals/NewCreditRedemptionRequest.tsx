import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/buttons/loading-button';
import TextareaInput from '@/components/inputs/TextareaInput';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { TSessionUser } from '@/lib/authentication/types';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { getErrorMessage } from '@/lib/methods/errors';
import { createCreditRedemptionRequest } from '@/lib/mutations/credits';
import type { TCreditRedemptionRequest } from '@/schemas/credit-redemption-request.schema';
import RewardSelection from './blocks/RewardSelection';

type NewCreditRedemptionRequestProps = {
	initialState?: Partial<TCreditRedemptionRequest>;
	sessionUser: TSessionUser;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function NewCreditRedemptionRequest({ initialState, sessionUser, closeModal, callbacks }: NewCreditRedemptionRequestProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const initialHolderState: TCreditRedemptionRequest = {
		creditosResgatados: initialState?.creditosResgatados || 0,
		recompensaResgatada: {
			id: initialState?.recompensaResgatada?.id || '',
			nome: initialState?.recompensaResgatada?.nome || '',
			creditosNecessarios: initialState?.recompensaResgatada?.creditosNecessarios || 0,
		},
		requerente: {
			id: sessionUser.id,
			nome: sessionUser.nome,
			avatar_url: sessionUser.avatar_url,
		},
		analista: {},
		pagamento: {
			observacoes: initialState?.pagamento?.observacoes || '',
		},
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState(initialHolderState);
	function updateInfoHolder(changes: Partial<TCreditRedemptionRequest>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutateCreateCreditRedemptionRequest, isPending } = useMutation({
		mutationKey: ['create-indication'],
		mutationFn: createCreditRedemptionRequest,
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
			console.log('FRONTEND ERROR', error);
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});
	return isDesktop ? (
		<Dialog onOpenChange={closeModal} open>
			<DialogContent className="flex h-fit max-h-[80vh] min-h-[60vh] flex-col">
				<DialogHeader>
					<DialogTitle>NOVO RESGATE</DialogTitle>
					<DialogDescription>Preencha alguns dados para retirada de créditos.</DialogDescription>
				</DialogHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">
					<CreditRedemptionRequestData infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					{infoHolder.recompensaResgatada.id ? (
						<LoadingButton loading={isPending} onClick={() => mutateCreateCreditRedemptionRequest(infoHolder)}>
							RESGATAR
						</LoadingButton>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer onOpenChange={closeModal} open>
			<DrawerContent className="flex max-h-[85vh] flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>NOVO RESGATE</DrawerTitle>
					<DrawerDescription>Preencha alguns dados para retirada de créditos.</DrawerDescription>
				</DrawerHeader>
				<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">
					<CreditRedemptionRequestData infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
				</div>

				<DrawerFooter className="pt-2">
					{infoHolder.recompensaResgatada?.id ? (
						<LoadingButton loading={isPending} onClick={() => mutateCreateCreditRedemptionRequest(infoHolder)}>
							RESGATAR
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

export default NewCreditRedemptionRequest;

type CreditRedemptionRequestDataProps = {
	infoHolder: TCreditRedemptionRequest;
	updateInfoHolder: (changes: Partial<TCreditRedemptionRequest>) => void;
};
function CreditRedemptionRequestData({ infoHolder, updateInfoHolder }: CreditRedemptionRequestDataProps) {
	return (
		<div className="flex h-full w-full flex-col gap-3 px-4">
			{infoHolder.recompensaResgatada.id ? (
				<>
					<div className="flex w-full flex-col items-center justify-center gap-1 py-2">
						<h1 className="w-full text-center text-sm leading-none tracking-tight lg:text-lg">
							Resgatando a recompensa: <br /> <strong>{infoHolder.recompensaResgatada.nome}</strong>
						</h1>
						<button
							className="cursor-pointer rounded-lg px-2 py-1 font-medium text-[0.65rem] text-primary/80 tracking-tight duration-300 ease-in-out hover:bg-primary/10 hover:text-primary"
							onClick={() => {
								updateInfoHolder({
									recompensaResgatada: { id: '', nome: '', creditosNecessarios: 0 },
								});
							}}
							type="button"
						>
							Clique aqui para escolher outra recompensa
						</button>
					</div>
					<TextareaInput
						handleChange={(value) => updateInfoHolder({ pagamento: { ...infoHolder.pagamento, observacoes: value } })}
						inputClassName="lg:min-h-[100px]"
						labelText="INFORMAÇÕES AUXILIARES"
						placeholderText="Preencha aqui detalhes relevantes para esse resgate, como sua chave PIX, comentários e outros detalhes que possam ser relevantes..."
						value={infoHolder.pagamento.observacoes}
					/>
				</>
			) : (
				<RewardSelection infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
			)}
		</div>
	);
}
