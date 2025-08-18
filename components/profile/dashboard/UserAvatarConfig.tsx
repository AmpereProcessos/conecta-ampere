import { useMutation } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';
import { toast } from 'sonner';
import type { TGetUserProfileRouteOutput } from '@/app/api/configurations/profile/route';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatNameAsInitials } from '@/lib/methods/formatting';
import { updateProfile } from '@/lib/mutations/profile';
import { uploadFileToFirebaseStorage } from '@/lib/services/firebase';

type UserAvatarConfigProps = {
	profile: TGetUserProfileRouteOutput['data'];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function UserAvatarConfig({ profile, callbacks }: UserAvatarConfigProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleInputButtonClick() {
		fileInputRef.current?.click();
	}
	async function handleUpdateAvatar(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) throw new Error('Nenhum arquivo selecionado.');
		const fileName = `avatar-${profile.nome.replaceAll(' ', '-')}`;
		const { url } = await uploadFileToFirebaseStorage({ file, fileName, vinculationId: profile.id });

		return await updateProfile({
			avatar: url,
		});
	}

	const { mutate: mutateUpdateProfileAvatar, isPending } = useMutation({
		mutationKey: ['updateProfile', profile.id],
		mutationFn: handleUpdateAvatar,
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			toast.success(data.message);
			if (callbacks?.onSuccess) callbacks.onSuccess();
		},
		onSettled: () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});
	return (
		<div className="flex w-full flex-col items-center gap-3">
			<Avatar className="h-12 min-h-20 w-12 min-w-20 lg:h-20 lg:w-20">
				<AvatarImage src={profile.avatar || undefined} />
				<AvatarFallback className="text-xs">{formatNameAsInitials(profile.nome)}</AvatarFallback>
			</Avatar>
			<button
				className="flex cursor-pointer items-center gap-1 rounded-lg bg-primary/10 px-1.5 py-1 text-primary/80 transition-colors hover:bg-primary/20"
				disabled={isPending}
				onClick={handleInputButtonClick}
				type="button"
			>
				<Pencil className="h-3 min-h-4 w-3 min-w-4 lg:h-4 lg:w-4" />
				<p className="font-bold text-xs">ALTERAR IMAGEM DE PERFIL</p>
			</button>
			<input accept="image/*" className="hidden" onChange={mutateUpdateProfileAvatar} ref={fileInputRef} type="file" />
		</div>
	);
}

export default UserAvatarConfig;
