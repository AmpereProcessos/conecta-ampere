import type { TGetUserProfileRouteOutput } from "@/app/api/configurations/profile/route";
import { Button } from "@/components/ui/button";
import { getAgeFromBirthdayDate } from "@/lib/methods/dates";
import { formatDateAsLocale, formatDateForInput, formatDateInputChange, formatToCPForCNPJ, formatToPhone } from "@/lib/methods/formatting";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, Building, Building2, Cake, ChevronsDownUp, Contact, Gem, IdCard, Mail, Phone, VenusAndMars } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";
import DateInput from "@/components/inputs/DateInput";
import { LoadingButton } from "@/components/buttons/loading-button";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/lib/mutations/profile";
import { getErrorMessage } from "@/lib/methods/errors";
import { toast } from "sonner";
type UserGeneralInfoConfigProps = {
	profile: TGetUserProfileRouteOutput["data"];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function UserGeneralInfoConfig({ profile, callbacks }: UserGeneralInfoConfigProps) {
	const [holder, setHolder] = useState(profile);
	const [editInformationMenuIsOpen, setEditInformationMenuIsOpen] = useState(false);
	function updateHolder(changes: Partial<TGetUserProfileRouteOutput["data"]>) {
		setHolder((prev) => ({ ...prev, ...changes }));
	}

	const { mutate: mutationUpdateProfile, isPending } = useMutation({
		mutationKey: ["update-profile", profile.id],
		mutationFn: updateProfile,
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
		<div className="w-full flex flex-col items-center gap-1.5">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<h1 className="text-sm font-bold leading-none tracking-tight">INFORMAÇÕES GERAIS</h1>
				</div>
				<Button onClick={() => setEditInformationMenuIsOpen((prev) => !prev)} size={"icon"} variant={"ghost"}>
					<ChevronsDownUp className="w-2 h-2" />
				</Button>
			</div>
			<AnimatePresence mode="wait">
				{/** VIEW MODE */}
				{!editInformationMenuIsOpen ? (
					<motion.div
						key="view-mode"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="w-full flex flex-col gap-1.5"
					>
						<div className="w-full flex items-center gap-1.5">
							<Contact className="w-4 h-4" />
							<h3 className="text-xs font-semibold tracking-tight">{profile.nome}</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<IdCard className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.cpfCnpj && "text-destructive")}>{profile.cpfCnpj || "CPF/CNPJ não informado."}</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<VenusAndMars className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.sexo && "text-destructive")}>{profile.sexo || "Sexo não informado."}</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<Cake className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.dataNascimento && "text-destructive")}>
								{profile.dataNascimento ? `${formatDateAsLocale(profile.dataNascimento)} (${getAgeFromBirthdayDate(profile.dataNascimento)} anos)` : "Data de nascimento não informado."}
							</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<Phone className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.telefone && "text-destructive")}>{profile.telefone || "Telefone não informado."}</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<Mail className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.email && "text-destructive")}>{profile.email || "Email não informado."}</h3>
						</div>
						{/* <div className="w-full flex items-center gap-1.5">
							<Gem className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.estadoCivil && "text-destructive")}>{profile.estadoCivil || "Estado civil não informado."}</h3>
						</div> */}
						<div className="w-full flex items-center gap-1.5">
							<BriefcaseBusiness className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.profissao && "text-destructive")}>{profile.profissao || "Profissão não informado."}</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<Building className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profile.ondeTrabalha && "text-destructive")}>{profile.ondeTrabalha || "Empresa não informada."}</h3>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="edit-mode"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="w-full flex flex-col gap-1.5"
					>
						<div className="w-full flex flex-col lg:flex-row items-center gap-1.5">
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="NOME"
									placeholderText="Preencha aqui o seu nome completo..."
									value={holder.nome}
									handleChange={(value) =>
										updateHolder({
											nome: value,
										})
									}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="CPF/CNPJ"
									placeholderText="Preencha aqui o seu CPF (ou CNPJ)..."
									value={holder.cpfCnpj || ""}
									handleChange={(value) =>
										updateHolder({
											cpfCnpj: formatToCPForCNPJ(value),
										})
									}
								/>
							</div>
						</div>
						<div className="w-full flex flex-col lg:flex-row items-center gap-1.5">
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="TELEFONE"
									placeholderText="Preencha aqui o seu telefone..."
									value={holder.telefone || ""}
									handleChange={(value) =>
										updateHolder({
											telefone: formatToPhone(value),
										})
									}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="EMAIL"
									placeholderText="Preencha aqui o seu email..."
									value={holder.email || ""}
									handleChange={(value) =>
										updateHolder({
											email: value,
										})
									}
								/>
							</div>
						</div>
						<div className="w-full flex flex-col lg:flex-row items-center gap-1.5">
							<div className="w-full lg:w-1/2">
								<DateInput
									labelText="DATA DE NASCIMENTO"
									value={formatDateForInput(holder.dataNascimento)}
									handleChange={(value) => updateHolder({ dataNascimento: formatDateInputChange(value, "string") as string })}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<SelectInput
									labelText="SEXO"
									placeholderText="Preencha aqui o seu sexo..."
									value={holder.sexo || null}
									options={[
										{ id: 1, label: "MASCULINO", value: "MASCULINO" },
										{ id: 2, label: "FEMININO", value: "FEMININO" },
										{ id: 3, label: "OUTRO", value: "OUTRO" },
									]}
									handleChange={(value) => updateHolder({ sexo: value as TGetUserProfileRouteOutput["data"]["sexo"] })}
									handleReset={() => updateHolder({ sexo: null })}
									resetOptionText="NÃO DEFINIDO"
								/>
							</div>
						</div>
						<div className="w-full flex flex-col lg:flex-row items-center gap-1.5">
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="PROFISSÃO"
									placeholderText="Preencha aqui a sua profissão..."
									value={holder.profissao || ""}
									handleChange={(value) =>
										updateHolder({
											profissao: value,
										})
									}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="EMPRESA"
									placeholderText="Preencha aqui o nome da empresa onde você trabalha..."
									value={holder.ondeTrabalha || ""}
									handleChange={(value) =>
										updateHolder({
											ondeTrabalha: value,
										})
									}
								/>
							</div>
						</div>
						<div className="w-full flex items-center justify-end">
							<LoadingButton onClick={() => mutationUpdateProfile(holder)} loading={isPending}>
								ATUALIZAR PERFIL
							</LoadingButton>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default UserGeneralInfoConfig;
