import type { TGetUserProfileRouteOutput } from "@/app/api/configurations/profile/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getErrorMessage } from "@/lib/methods/errors";
import { formatNameAsInitials } from "@/lib/methods/formatting";
import { updateProfile } from "@/lib/mutations/profile";
import { uploadFileToFirebaseStorage } from "@/lib/services/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Pencil } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

type UserAvatarConfigProps = {
	profile: TGetUserProfileRouteOutput["data"];
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
		if (!file) throw new Error("Nenhum arquivo selecionado.");
		const fileName = `avatar-${profile.nome.replaceAll(" ", "-")}`;
		const { url } = await uploadFileToFirebaseStorage({ file, fileName, vinculationId: profile.id });

		return await updateProfile({
			avatar: url,
		});
	}

	const { mutate: mutateUpdateProfileAvatar, isPending } = useMutation({
		mutationKey: ["updateProfile", profile.id],
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
		<div className="w-full flex flex-col items-center gap-3">
			<Avatar className="w-12 h-12 lg:w-20 lg:h-20 min-w-20 min-h-20">
				<AvatarImage src={profile.avatar || undefined} />
				<AvatarFallback className="text-xs">{formatNameAsInitials(profile.nome)}</AvatarFallback>
			</Avatar>
			<button
				onClick={handleInputButtonClick}
				disabled={isPending}
				type="button"
				className="flex items-center gap-1 px-1.5 py-1 bg-primary/10 hover:bg-primary/20 transition-colors text-primary/80 rounded-lg"
			>
				<Pencil className="w-3 h-3 lg:w-4 lg:h-4 min-w-4 min-h-4" />
				<p className="text-xs font-bold">ALTERAR IMAGEM DE PERFIL</p>
			</button>
			<input ref={fileInputRef} type="file" accept="image/*" onChange={mutateUpdateProfileAvatar} className="hidden" />
		</div>
	);
}

export default UserAvatarConfig;
