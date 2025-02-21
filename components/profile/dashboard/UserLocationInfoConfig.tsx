import type { TGetUserProfileRouteOutput } from "@/app/api/configurations/profile/route";
import { LoadingButton } from "@/components/buttons/loading-button";
import SelectInput from "@/components/inputs/SelectInput";
import TextInput from "@/components/inputs/TextInput";
import { Button } from "@/components/ui/button";
import { BrazilianCitiesOptionsFromUF, BrazilianStatesOptions, BrazilStatesAndCities } from "@/configs/states_cities";
import { getErrorMessage } from "@/lib/methods/errors";
import { formatLocation, formatToCEP } from "@/lib/methods/formatting";
import { getCEPInfo } from "@/lib/methods/utils";
import { updateProfile } from "@/lib/mutations/profile";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Building2, ChevronsDownUp, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";

type UserLocationInfoConfigProps = {
	profile: TGetUserProfileRouteOutput["data"];
	callbacks?: {
		onMutate?: () => void;
		onSuccess?: () => void;
		onSettled?: () => void;
	};
};
function UserLocationInfoConfig({ profile, callbacks }: UserLocationInfoConfigProps) {
	const [editInformationMenuIsOpen, setEditInformationMenuIsOpen] = useState(false);

	const [holder, setHolder] = useState(profile);
	function updateHolder(changes: Partial<TGetUserProfileRouteOutput["data"]>) {
		setHolder((prev) => ({ ...prev, ...changes }));
	}

	async function setAddressDataByCEP(cep: string) {
		const addressInfo = await getCEPInfo(cep);
		const toastID = toast.loading("Buscando informações sobre o CEP...", {
			duration: 2000,
		});
		setTimeout(() => {
			if (addressInfo) {
				toast.dismiss(toastID);
				toast.success("Dados do CEP buscados com sucesso.", {
					duration: 1000,
				});
				updateHolder({
					endereco: addressInfo.logradouro,
					bairro: addressInfo.bairro,
					uf: addressInfo.uf,
					cidade: addressInfo.localidade.toUpperCase(),
				});
			}
		}, 1000);
	}
	const profileLocation = {
		cep: profile.cep,
		uf: profile.uf,
		cidade: profile.cidade,
		bairro: profile.bairro,
		endereco: profile.endereco,
		numeroOuIdentificador: profile.numeroOuIdentificador,
		complemento: profile.complemento,
	};
	const profileCityStateLocationStr = formatLocation({
		location: profileLocation,
		includeCity: true,
		includeUf: true,
		includeAddress: false,
		includeNeighborhood: false,
		includeNumber: false,
	});

	const profileGeneralAddressLocationStr = formatLocation({
		location: profileLocation,
	});

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
					<h1 className="text-sm font-bold leading-none tracking-tight">INFORMAÇÕES DE ENDEREÇO</h1>
				</div>
				<Button onClick={() => setEditInformationMenuIsOpen((prev) => !prev)} size={"icon"} variant={"ghost"}>
					<ChevronsDownUp className="w-2 h-2" />
				</Button>
			</div>
			<AnimatePresence mode="wait">
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
							<Building2 className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profileCityStateLocationStr && "text-destructive")}>
								{profileCityStateLocationStr || "Dados de cidade e estado não informados."}
							</h3>
						</div>
						<div className="w-full flex items-center gap-1.5">
							<MapPin className="w-4 h-4" />
							<h3 className={cn("text-xs font-semibold tracking-tight", !profileGeneralAddressLocationStr && "text-destructive")}>
								{profileGeneralAddressLocationStr || "Dados de endereço não informados."}
							</h3>
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
							<div className="w-full lg:w-1/3">
								<TextInput
									labelText="CEP"
									placeholderText="Preencha aqui o seu CEP..."
									value={holder.cep || ""}
									handleChange={(value) => {
										if (value.length === 9) {
											setAddressDataByCEP(value);
										}
										updateHolder({
											cep: formatToCEP(value),
										});
									}}
								/>
							</div>
							<div className="w-full lg:w-1/3">
								<SelectInput
									labelText="ESTADO(UF)"
									placeholderText="Preencha aqui o seu estado federativo..."
									value={holder.uf}
									handleChange={(value) =>
										updateHolder({
											uf: value,
											cidade: BrazilianCitiesOptionsFromUF(value)[0]?.value,
										})
									}
									handleReset={() => updateHolder({ uf: "MG", cidade: "ITUIUTABA" })}
									options={BrazilianStatesOptions}
									resetOptionText="NÃO DEFINIDO"
								/>
							</div>
							<div className="w-full lg:w-1/3">
								<SelectInput
									labelText="CIDADE"
									placeholderText="Preencha aqui a sua cidade..."
									value={holder.cidade}
									handleChange={(value) => updateHolder({ cidade: value })}
									handleReset={() => updateHolder({ cidade: profile.cidade })}
									options={BrazilianCitiesOptionsFromUF(holder.uf)}
									resetOptionText="NÃO DEFINIDO"
								/>
							</div>
						</div>
						<div className="w-full flex flex-col lg:flex-row items-center gap-1.5">
							<div className="w-full lg:w-1/2">
								<TextInput labelText="BAIRRO" placeholderText="Preencha aqui o seu bairro..." value={holder.bairro || ""} handleChange={(value) => updateHolder({ bairro: value })} />
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="LOGRADOURO"
									placeholderText="Preencha aqui o seu logradouro/rua..."
									value={holder.endereco || ""}
									handleChange={(value) => updateHolder({ endereco: value })}
								/>
							</div>
						</div>
						<div className="w-full flex flex-col lg:flex-row items-center gap-1.5">
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="NÚMERO/IDENTIFICADOR"
									placeholderText="Preencha aqui o número ou identificador da sua residência..."
									value={holder.numeroOuIdentificador || ""}
									handleChange={(value) => updateHolder({ numeroOuIdentificador: value })}
								/>
							</div>
							<div className="w-full lg:w-1/2">
								<TextInput
									labelText="COMPLEMENTO"
									placeholderText="Preencha aqui algum complemento sobre o seu endereço..."
									value={holder.complemento || ""}
									handleChange={(value) => updateHolder({ complemento: value })}
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

export default UserLocationInfoConfig;
