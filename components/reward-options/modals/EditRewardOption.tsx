import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/buttons/loading-button';
import ErrorComponent from '@/components/layout/ErrorComponent';
import LoadingComponent from '@/components/layout/LoadingComponent';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { TSessionUser } from '@/lib/authentication/types';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatAsSlug } from '@/lib/methods/formatting';
import type { TSimpleAttachment } from '@/lib/methods/uploading';
import { editRewardOption } from '@/lib/mutations/reward-options';
import { useAdminRewardOptionByIdQuery } from '@/lib/queries/reward-options';
import { uploadFileToFirebaseStorage } from '@/lib/services/firebase';
import type { TRewardOption } from '@/schemas/reward-option.schema';
import RewardOptionConfiguration from './blocks/Configuration';
import RewardOptionGeneral from './blocks/General';

type EditRewardOptionProps = {
	rewardOptionId: string;
	sessionUser: TSessionUser;
	closeModal: () => void;
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function EditRewardOption({ rewardOptionId, sessionUser, closeModal, callbacks }: EditRewardOptionProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	const {
		data: rewardOptionById,
		isLoading,
		isError,
		isSuccess,
		error,
	} = useAdminRewardOptionByIdQuery({
		id: rewardOptionId,
	});
	const initialHolderState: TRewardOption = {
		titulo: '',
		descricao: '',
		chamada: '',
		creditosNecessarios: 0,
		autor: { id: sessionUser.id, nome: sessionUser.nome, avatarUrl: sessionUser.avatar_url },
		dataInsercao: new Date().toISOString(),
	};

	const [infoHolder, setInfoHolder] = useState(initialHolderState);
	const [imageHolder, setImageHolder] = useState<TSimpleAttachment>({ file: null, previewUrl: null });
	function updateInfoHolder(changes: Partial<TRewardOption>) {
		setInfoHolder((prev) => ({ ...prev, ...changes }));
	}

	async function handleEditRewardOptionWithUpload({ rewardOption, attachment }: { rewardOption: TRewardOption; attachment: TSimpleAttachment }) {
		let imageUrl = rewardOption.imagemCapaUrl;
		if (attachment.file) {
			const { url } = await uploadFileToFirebaseStorage({
				fileName: `${formatAsSlug(rewardOption.titulo)}-imagem-principal`,
				file: attachment.file,
			});
			imageUrl = url;
		}
		const payload = { ...rewardOption, imagemCapaUrl: imageUrl };
		return editRewardOption({ payload: { id: rewardOptionId, changes: payload } });
	}
	const { mutate: mutateEditRewardOption, isPending } = useMutation({
		mutationKey: ['edit-reward-option'],
		mutationFn: handleEditRewardOptionWithUpload,
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
		onError: (mutationError) => {
			const msg = getErrorMessage(mutationError);
			toast.error(msg);
		},
	});
	const TITLE = 'EDITAR RECOMPENSA';
	const DESCRIPTION = 'Atualize os dados sobre a recompensa.';
	const BUTTON_TEXT = 'ATUALIZAR RECOMPENSA';

	useEffect(() => {
		if (rewardOptionById) {
			setInfoHolder(rewardOptionById);
		}
	}, [rewardOptionById]);
	return isDesktop ? (
		<Dialog onOpenChange={closeModal} open>
			<DialogContent className="flex h-fit max-h-[80vh] min-h-[60vh] flex-col">
				<DialogHeader>
					<DialogTitle>{TITLE}</DialogTitle>
					<DialogDescription>{DESCRIPTION}</DialogDescription>
				</DialogHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">
							<RewardOptionData imageHolder={imageHolder} infoHolder={infoHolder} updateImageHolder={setImageHolder} updateInfoHolder={updateInfoHolder} />
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DialogClose>
							<LoadingButton loading={isPending} onClick={() => mutateEditRewardOption({ rewardOption: infoHolder, attachment: imageHolder })}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	) : (
		<Drawer onOpenChange={closeModal} open>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{TITLE}</DrawerTitle>
					<DrawerDescription>{DESCRIPTION}</DrawerDescription>
				</DrawerHeader>
				{isLoading ? <LoadingComponent /> : null}
				{isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
				{isSuccess ? (
					<>
						<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex-1 overflow-auto overflow-y-auto overscroll-y-auto p-2">
							<RewardOptionData imageHolder={imageHolder} infoHolder={infoHolder} updateImageHolder={setImageHolder} updateInfoHolder={updateInfoHolder} />
						</div>
						<DrawerFooter className="pt-2">
							<DrawerClose asChild>
								<Button variant="outline">FECHAR</Button>
							</DrawerClose>
							<LoadingButton loading={isPending} onClick={() => mutateEditRewardOption({ rewardOption: infoHolder, attachment: imageHolder })}>
								{BUTTON_TEXT}
							</LoadingButton>
						</DrawerFooter>
					</>
				) : null}
			</DrawerContent>
		</Drawer>
	);
}
export default EditRewardOption;

type RewardOptionDataProps = {
	infoHolder: TRewardOption;
	updateInfoHolder: (changes: Partial<TRewardOption>) => void;
	imageHolder: TSimpleAttachment;
	updateImageHolder: (image: TSimpleAttachment) => void;
};
function RewardOptionData({ infoHolder, updateInfoHolder, imageHolder, updateImageHolder }: RewardOptionDataProps) {
	return (
		<div className="flex h-full w-full flex-col gap-3 px-4">
			<RewardOptionGeneral imageHolder={imageHolder} infoHolder={infoHolder} updateImageHolder={updateImageHolder} updateInfoHolder={updateInfoHolder} />
			<RewardOptionConfiguration infoHolder={infoHolder} updateInfoHolder={updateInfoHolder} />
		</div>
	);
}
