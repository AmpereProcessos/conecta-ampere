import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import type { TSessionUser } from "@/lib/authentication/types";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import type { TSaleCategoryEnum } from "@/schemas/enums.schema";
import type { TIndication } from "@/schemas/indication.schema";
import React, { useState } from "react";
import ProjectTypeSelection from "./blocks/ProjectTypeSelection";
import TextInput from "@/components/inputs/TextInput";
import { formatToPhone } from "@/lib/methods/formatting";
import {
	BrazilianCitiesOptionsFromUF,
	BrazilianStatesOptions,
	BrazilStatesAndCities,
} from "@/configs/states_cities";
import SelectInput from "@/components/inputs/SelectInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingButton } from "@/components/buttons/loading-button";
import { useMutation } from "@tanstack/react-query";
import { createIndication } from "@/lib/mutations/indications";
import { getErrorMessage } from "@/lib/methods/errors";
import { toast } from "sonner";

type NewIndicationProps = {
	sessionUser: TSessionUser;
	projectType?: { id: string; title: string; saleCategory: TSaleCategoryEnum };
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function NewIndication({
	sessionUser,
	projectType,
	closeModal,
	callbacks,
}: NewIndicationProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const initialHolderState: TIndication = {
		nome: "",
		telefone: "",
		uf: "MG",
		cidade: "ITUIUTABA",
		tipo: {
			id: projectType?.id || "",
			titulo: projectType?.title || "",
			categoriaVenda: projectType?.saleCategory || "KIT",
		},
		autor: {
			id: sessionUser.id,
			nome: sessionUser.nome,
			avatar_url: sessionUser.avatar_url,
		},
		oportunidade: {
			id: "",
			nome: "",
			identificador: "",
		},
		dataInsercao: new Date().toISOString(),
	};
	const [infoHolder, setInfoHolder] = useState(initialHolderState);
	function updateInfoHolder(changes: Partial<TIndication>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutateCreateIndication, isPending } = useMutation({
		mutationKey: ["create-indication"],
		mutationFn: createIndication,
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			toast.success("Nova indicação criada com sucesso.");
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
		<Dialog open onOpenChange={closeModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>NOVA INDICAÇÃO</DialogTitle>
					<DialogDescription>
						Preencha alguns dados sobre a sua indicação.
					</DialogDescription>
				</DialogHeader>
				<IndicationData
					infoHolder={infoHolder}
					updateInfoHolder={updateInfoHolder}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">FECHAR</Button>
					</DialogClose>
					{infoHolder.tipo.id ? (
						<LoadingButton
							onClick={() => mutateCreateIndication(infoHolder)}
							loading={isPending}
						>
							INDICAR
						</LoadingButton>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	) : (
		<Drawer open onOpenChange={closeModal}>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>NOVA INDICAÇÃO</DrawerTitle>
					<DrawerDescription>
						Preencha alguns dados sobre a sua indicação.
					</DrawerDescription>
				</DrawerHeader>
				<IndicationData
					infoHolder={infoHolder}
					updateInfoHolder={updateInfoHolder}
				/>
				<DrawerFooter className="pt-2">
					{infoHolder.tipo?.id ? (
						<LoadingButton
							onClick={() => mutateCreateIndication(infoHolder)}
							loading={isPending}
						>
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
		<div className="w-full grow flex flex-col gap-3 px-2">
			{!infoHolder.tipo.id ? (
				<ProjectTypeSelection updateInfoHolder={updateInfoHolder} />
			) : (
				<>
					<div className="w-full flex items-center justify-center flex-col gap-1 py-2">
						<h1 className="text-sm lg:text-lg leading-none tracking-tight w-full text-center">
							Indicando para: <strong>{infoHolder.tipo.titulo}</strong>{" "}
						</h1>
						<button
							type="button"
							onClick={() => {
								updateInfoHolder({
									tipo: { id: "", titulo: "", categoriaVenda: "KIT" },
								});
							}}
							className="px-2 py-1 duration-300 ease-in-out hover:bg-primary/10 hover:text-primary font-medium rounded-lg text-[0.65rem] tracking-tight text-primary/80"
						>
							Clique aqui para escolher outro Tipo de Indicação
						</button>
					</div>
					<TextInput
						labelText="NOME DA PESSOA INDICADA"
						placeholderText="Preencha aqui o nome da pessoa que está indicando..."
						value={infoHolder.nome}
						handleChange={(value) => updateInfoHolder({ nome: value })}
					/>
					<TextInput
						labelText="TELEFONE DA PESSOA INDICADA"
						placeholderText="Preencha aqui o telefone da pessoa que está indicando..."
						value={infoHolder.telefone}
						handleChange={(value) =>
							updateInfoHolder({ telefone: formatToPhone(value) })
						}
					/>
					<SelectInput
						labelText="ESTADO(UF) DA PESSOA INDICADA"
						placeholderText="Preencha aqui o estado federativo da pessoa indicada..."
						value={infoHolder.uf}
						handleChange={(value) =>
							updateInfoHolder({
								uf: value,
								cidade: BrazilianCitiesOptionsFromUF(value)[0]?.value,
							})
						}
						handleReset={() =>
							updateInfoHolder({ uf: "MG", cidade: "ITUIUTABA" })
						}
						options={BrazilianStatesOptions}
						resetOptionText="NÃO DEFINIDO"
					/>
					<SelectInput
						labelText="CIDADE DA PESSOA INDICADA"
						placeholderText="Preencha aqui o cidade da pessoa indicada..."
						value={infoHolder.cidade}
						handleChange={(value) => updateInfoHolder({ cidade: value })}
						handleReset={() => updateInfoHolder({ cidade: "ITUIUTABA" })}
						options={BrazilianCitiesOptionsFromUF(infoHolder.uf)}
						resetOptionText="NÃO DEFINIDO"
					/>
				</>
			)}
		</div>
	);
}
