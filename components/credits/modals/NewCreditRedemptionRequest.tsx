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
	sessionUser: TSessionUser;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function NewCreditRedemptionRequest({ sessionUser, closeModal, callbacks }: NewCreditRedemptionRequestProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const initialHolderState: TCreditRedemptionRequest = {
		creditosResgatados: 0,
		recompensaResgatada: {
			id: "",
			nome: "",
			creditosNecessarios: 0,
		},
		requerente: {
			id: sessionUser.id,
			nome: sessionUser.nome,
			avatar_url: sessionUser.avatar_url,
		},
		analista: {},
		pagamento: {
			observacoes: "",
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>NOVO RESGATE</DialogTitle>
					<DialogDescription>Preencha alguns dados para retirada de créditos.</DialogDescription>
				</DialogHeader>
				<ScrollArea className="w-full flex flex-col grow max-h-[500px]">
					<RewardSelection infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
					<TextareaInput
						labelText="INFORMAÇÕES AUXILIARES"
						placeholderText="Preencha aqui detalhes relevantes para esse resgate, como sua chave PIX, comentários e outros detalhes que possam ser relevantes..."
						value={infoHolder.pagamento.observacoes}
						handleChange={(value) => updateInfoHolder({ pagamento: { ...infoHolder.pagamento, observacoes: value } })}
						inputClassName="lg:min-h-[80px]"
					/>
				</ScrollArea>

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
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>NOVO RESGATE</DrawerTitle>
					<DrawerDescription>Preencha alguns dados para retirada de créditos.</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className="w-full flex flex-col grow max-h-[500px]">
					<RewardSelection infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
					<TextareaInput
						labelText="INFORMAÇÕES AUXILIARES"
						placeholderText="Preencha aqui detalhes relevantes para esse resgate, como sua chave PIX, comentários e outros detalhes que possam ser relevantes..."
						value={infoHolder.pagamento.observacoes}
						handleChange={(value) => updateInfoHolder({ pagamento: { ...infoHolder.pagamento, observacoes: value } })}
						inputClassName="lg:min-h-[100px]"
					/>
				</ScrollArea>

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
