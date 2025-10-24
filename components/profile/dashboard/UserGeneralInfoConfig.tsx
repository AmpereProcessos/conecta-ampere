import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { BriefcaseBusiness, Building, Cake, ChevronsDownUp, Contact, IdCard, Mail, Phone, VenusAndMars } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { TGetUserProfileRouteOutput, TUpdateUserProfileRouteInput } from '@/app/api/configurations/profile/route';
import { LoadingButton } from '@/components/buttons/loading-button';
import DateInput from '@/components/inputs/DateInput';
import SelectInput from '@/components/inputs/SelectInput';
import TextInput from '@/components/inputs/TextInput';
import { Button } from '@/components/ui/button';
import { getAgeFromBirthdayDate } from '@/lib/methods/dates';
import { getErrorMessage } from '@/lib/methods/errors';
import { formatDateAsLocale, formatDateForInput, formatDateInputChange, formatToCPForCNPJ, formatToPhone } from '@/lib/methods/formatting';
import { updateProfile } from '@/lib/mutations/profile';
import { cn } from '@/lib/utils';

type UserGeneralInfoConfigProps = {
	profile: TGetUserProfileRouteOutput['data'];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function UserGeneralInfoConfig({ profile, callbacks }: UserGeneralInfoConfigProps) {
	const [holder, setHolder] = useState<TUpdateUserProfileRouteInput>({});
	const [editInformationMenuIsOpen, setEditInformationMenuIsOpen] = useState(false);
	function updateHolder(changes: Partial<TGetUserProfileRouteOutput['data']>) {
		setHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutationUpdateProfile, isPending } = useMutation({
		mutationKey: ['update-profile', profile.id],
		mutationFn: updateProfile,
		onMutate: () => {
			if (callbacks?.onMutate) callbacks.onMutate();
		},
		onSuccess: (data) => {
			toast.success(data.message);
			if (callbacks?.onSuccess) callbacks.onSuccess();
			setHolder({});
		},
		onSettled: () => {
			if (callbacks?.onSettled) callbacks.onSettled();
		},
		onError: (error) => {
			const msg = getErrorMessage(error);
			toast.error(msg);
		},
	});
	console.log('HOLDER', holder);
	return (
		<div className="flex w-full flex-col items-center gap-1.5">
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="font-bold text-sm leading-none tracking-tight">INFORMAÇÕES GERAIS</h1>
				</div>
				<Button onClick={() => setEditInformationMenuIsOpen((prev) => !prev)} size={'icon'} variant={'ghost'}>
					<ChevronsDownUp className="h-2 w-2" />
				</Button>
			</div>
			<AnimatePresence mode="wait">
				{/** VIEW MODE */}
				{editInformationMenuIsOpen ? (
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex w-full flex-col gap-1.5"
						exit={{ opacity: 0, y: -20 }}
						initial={{ opacity: 0, y: 20 }}
						key="edit-mode"
						transition={{ duration: 0.2 }}
					>
						<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<TextInput
									handleChange={(value) =>
										updateHolder({
											nome: value,
										})
									}
									labelText="NOME"
									placeholderText="Preencha aqui o seu nome completo..."
									value={holder.nome || profile.nome}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									handleChange={(value) =>
										updateHolder({
											cpfCnpj: formatToCPForCNPJ(value),
										})
									}
									labelText="CPF/CNPJ"
									placeholderText="Preencha aqui o seu CPF (ou CNPJ)..."
									value={holder.cpfCnpj || profile.cpfCnpj || ''}
								/>
							</div>
						</div>
						<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<TextInput
									handleChange={(value) =>
										updateHolder({
											telefone: formatToPhone(value),
										})
									}
									labelText="TELEFONE"
									placeholderText="Preencha aqui o seu telefone..."
									value={holder.telefone || profile.telefone || ''}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									handleChange={(value) =>
										updateHolder({
											email: value,
										})
									}
									labelText="EMAIL"
									placeholderText="Preencha aqui o seu email..."
									value={holder.email || profile.email || ''}
								/>
							</div>
						</div>
						<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<DateInput
									handleChange={(value) => updateHolder({ dataNascimento: formatDateInputChange(value, 'string') as string })}
									labelText="DATA DE NASCIMENTO"
									value={formatDateForInput(holder.dataNascimento || profile.dataNascimento)}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<SelectInput
									handleChange={(value) => updateHolder({ sexo: value as TGetUserProfileRouteOutput['data']['sexo'] })}
									handleReset={() => updateHolder({ sexo: null })}
									labelText="SEXO"
									options={[
										{ id: 1, label: 'MASCULINO', value: 'MASCULINO' },
										{ id: 2, label: 'FEMININO', value: 'FEMININO' },
										{ id: 3, label: 'OUTRO', value: 'OUTRO' },
									]}
									placeholderText="Preencha aqui o seu sexo..."
									resetOptionText="NÃO DEFINIDO"
									value={holder.sexo || profile.sexo || null}
								/>
							</div>
						</div>
						<div className="flex w-full flex-col items-center gap-1.5 lg:flex-row">
							<div className="w-full lg:w-1/2">
								<TextInput
									handleChange={(value) =>
										updateHolder({
											profissao: value,
										})
									}
									labelText="PROFISSÃO"
									placeholderText="Preencha aqui a sua profissão..."
									value={holder.profissao || profile.profissao || ''}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									handleChange={(value) =>
										updateHolder({
											ondeTrabalha: value,
										})
									}
									labelText="EMPRESA"
									placeholderText="Preencha aqui o nome da empresa onde você trabalha..."
									value={holder.ondeTrabalha || profile.ondeTrabalha || ''}
								/>
							</div>
						</div>
						<div className="flex w-full items-center justify-end">
							<LoadingButton loading={isPending} onClick={() => mutationUpdateProfile(holder)}>
								ATUALIZAR PERFIL
							</LoadingButton>
						</div>
					</motion.div>
				) : (
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex w-full flex-col gap-1.5"
						exit={{ opacity: 0, y: -20 }}
						initial={{ opacity: 0, y: 20 }}
						key="view-mode"
						transition={{ duration: 0.2 }}
					>
						<div className="flex w-full items-center gap-1.5">
							<Contact className="h-4 w-4" />
							<h3 className="font-semibold text-xs tracking-tight">{profile.nome}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<IdCard className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.cpfCnpj && 'text-destructive')}>{profile.cpfCnpj || 'CPF/CNPJ não informado.'}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<VenusAndMars className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.sexo && 'text-destructive')}>{profile.sexo || 'Sexo não informado.'}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<Cake className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.dataNascimento && 'text-destructive')}>
								{profile.dataNascimento ? `${formatDateAsLocale(profile.dataNascimento)} (${getAgeFromBirthdayDate(profile.dataNascimento)} anos)` : 'Data de nascimento não informado.'}
							</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<Phone className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.telefone && 'text-destructive')}>{profile.telefone || 'Telefone não informado.'}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<Mail className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.email && 'text-destructive')}>{profile.email || 'Email não informado.'}</h3>
						</div>
						{/* <div className="w-full flex items-center gap-1.5">
							<Gem className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.estadoCivil && "text-destructive")}>{profile.estadoCivil || "Estado civil não informado."}</h3>
						</div> */}
						<div className="flex w-full items-center gap-1.5">
							<BriefcaseBusiness className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.profissao && 'text-destructive')}>{profile.profissao || 'Profissão não informado.'}</h3>
						</div>
						<div className="flex w-full items-center gap-1.5">
							<Building className="h-4 w-4" />
							<h3 className={cn('font-semibold text-xs tracking-tight', !profile.ondeTrabalha && 'text-destructive')}>{profile.ondeTrabalha || 'Empresa não informada.'}</h3>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default UserGeneralInfoConfig;
