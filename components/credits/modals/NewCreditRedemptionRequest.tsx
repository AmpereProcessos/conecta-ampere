import { LoadingButton } from "@/components/buttons/loading-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import type { TSessionUser } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { getErrorMessage } from "@/lib/methods/errors";
import { createCreditRedemptionRequest } from "@/lib/mutations/credits";
import type { TCreditRedemptionRequest } from "@/schemas/credit-redemption-request.schema";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import RewardSelection from "./blocks/RewardSelection";
import TextareaInput from "@/components/inputs/TextareaInput";
import { ScrollArea } from "@/components/ui/scroll-area";

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
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const initialHolderState: TCreditRedemptionRequest = {
		creditosResgatados: initialState?.creditosResgatados || 0,
		recompensaResgatada: {
			id: initialState?.recompensaResgatada?.id || "",
			nome: initialState?.recompensaResgatada?.nome || "",
			creditosNecessarios: initialState?.recompensaResgatada?.creditosNecessarios || 0,
		},
		requerente: {
			id: sessionUser.id,
			nome: sessionUser.nome,
			avatar_url: sessionUser.avatar_url,
		},
		analista: {},
		pagamento: {
			observacoes: initialState?.pagamento?.observacoes || "",
		},
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState(initialHolderState);
	function updateInfoHolder(changes: Partial<TCreditRedemptionRequest>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutateCreateCreditRedemptionRequest, isPending } = useMutation({
		mutationKey: ["create-indication"],
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
			console.log("FRONTEND ERROR", error);
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});
	return isDesktop ? (
		<Dialog open onOpenChange={closeModal}>
			<DialogContent className="flex flex-col h-fit min-h-[60vh] max-h-[80vh]">
				<DialogHeader>
					<DialogTitle>NOVO RESGATE</DialogTitle>
					<DialogDescription>Preencha alguns dados para retirada de créditos.</DialogDescription>
				</DialogHeader>
				<div className="flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
					<div className="w-full h-full flex flex-col gap-6 px-2">
						<RewardSelection infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
						<TextareaInput
							labelText="INFORMAÇÕES AUXILIARES"
							placeholderText="Preencha aqui detalhes relevantes para esse resgate, como sua chave PIX, comentários e outros detalhes que possam ser relevantes..."
							value={infoHolder.pagamento.observacoes}
							handleChange={(value) => updateInfoHolder({ pagamento: { ...infoHolder.pagamento, observacoes: value } })}
							inputClassName="lg:min-h-[80px]"
						/>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					{infoHolder.recompensaResgatada.id ? (
						<LoadingButton onClick={() => mutateCreateCreditRedemptionRequest(infoHolder)} loading={isPending}>
							RESGATAR
						</LoadingButton>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={closeModal}>
			<DrawerContent className="max-h-[85vh] flex flex-col">
				<DrawerHeader className="text-left">
					<DrawerTitle>NOVO RESGATE</DrawerTitle>
					<DrawerDescription>Preencha alguns dados para retirada de créditos.</DrawerDescription>
				</DrawerHeader>
				<div className="flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2 scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30">
					<div className="w-full h-full flex flex-col gap-6 px-2">
						<RewardSelection infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
						<TextareaInput
							labelText="INFORMAÇÕES AUXILIARES"
							placeholderText="Preencha aqui detalhes relevantes para esse resgate, como sua chave PIX, comentários e outros detalhes que possam ser relevantes..."
							value={infoHolder.pagamento.observacoes}
							handleChange={(value) => updateInfoHolder({ pagamento: { ...infoHolder.pagamento, observacoes: value } })}
							inputClassName="lg:min-h-[100px]"
						/>
					</div>
				</div>

				<DrawerFooter className="pt-2">
					{infoHolder.recompensaResgatada?.id ? (
						<LoadingButton onClick={() => mutateCreateCreditRedemptionRequest(infoHolder)} loading={isPending}>
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
