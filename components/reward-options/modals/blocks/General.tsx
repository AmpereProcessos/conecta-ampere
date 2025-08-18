import { LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import { MdAttachFile } from 'react-icons/md';
import TextareaInput from '@/components/inputs/TextareaInput';
import TextInput from '@/components/inputs/TextInput';
import type { TSimpleAttachment } from '@/lib/methods/uploading';
import type { TRewardOption } from '@/schemas/reward-option.schema';

type RewardOptionGeneralProps = {
	infoHolder: TRewardOption;
	updateInfoHolder: (changes: Partial<TRewardOption>) => void;
	imageHolder: TSimpleAttachment;
	updateImageHolder: (image: TSimpleAttachment) => void;
};
function RewardOptionGeneral({ infoHolder, updateInfoHolder, imageHolder, updateImageHolder }: RewardOptionGeneralProps) {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex w-fit items-center gap-2 rounded bg-primary/20 px-2 py-1">
				<LayoutGrid className="h-4 min-h-4 w-4 min-w-4" />
				<h1 className="w-fit text-start font-medium text-xs tracking-tight">INFORMAÇÕES GERAIS</h1>
			</div>
			<div className="flex w-full flex-col gap-1.5">
				<ImageContent imageHolder={imageHolder} imageUrl={infoHolder.imagemCapaUrl} updateImageHolder={updateImageHolder} />
				<TextInput
					handleChange={(value) => updateInfoHolder({ titulo: value })}
					labelText="TÍTULO"
					placeholderText="Preencha aqui o título da recompensa..."
					value={infoHolder.titulo}
				/>
				<TextareaInput
					handleChange={(value) => updateInfoHolder({ descricao: value })}
					labelText="DESCRIÇÃO"
					placeholderText="Preencha aqui a descrição da recompensa..."
					value={infoHolder.descricao}
				/>
			</div>
		</div>
	);
}
export default RewardOptionGeneral;
function ImageContent({
	imageUrl,
	imageHolder,
	updateImageHolder,
}: {
	imageUrl: TRewardOption['imagemCapaUrl'];
	imageHolder: TSimpleAttachment;
	updateImageHolder: (image: TSimpleAttachment) => void;
}) {
	return (
		<div className="flex w-full items-center justify-center">
			<label className="relative aspect-video w-full max-w-full cursor-pointer overflow-hidden rounded-lg" htmlFor="dropzone-file">
				<ImagePreview imageHolder={imageHolder} imageUrl={imageUrl} />
				<input
					accept=".png,.jpeg,.jpg"
					className="absolute h-full w-full cursor-pointer opacity-0"
					id="dropzone-file"
					multiple={false}
					onChange={(e) => {
						const file = e.target.files?.[0] ?? null;
						updateImageHolder({ file, previewUrl: file ? URL.createObjectURL(file) : null });
					}}
					tabIndex={-1}
					type="file"
				/>
			</label>
		</div>
	);
}

function ImagePreview({ imageUrl, imageHolder }: { imageUrl: TRewardOption['imagemCapaUrl']; imageHolder: TSimpleAttachment }) {
	if (imageUrl) {
		return <Image alt="Imagem principal do item." fill={true} objectFit="cover" src={imageUrl} />;
	}
	if (imageHolder.previewUrl) {
		return <Image alt="Imagem principal do item." fill={true} objectFit="cover" src={imageHolder.previewUrl} />;
	}
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-primary/20">
			<MdAttachFile className="h-6 w-6" />
			<p className="text-center font-medium text-xs">DEFINIR IMAGEM PRINCIPAL</p>
		</div>
	);
}
