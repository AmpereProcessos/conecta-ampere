import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { getErrorMessage } from "@/lib/methods/errors";
import { formatNameAsInitials } from "@/lib/methods/formatting";
import { useSellerByIndicationCodeQuery } from "@/lib/queries/sellers";
import type { TIndication } from "@/schemas/indication.schema";
import React from "react";

type IndicationDataSellerProps = {
	infoHolder: TIndication;
	updateInfoHolder: (changes: Partial<TIndication>) => void;
};
function IndicationDataSeller({ infoHolder, updateInfoHolder }: IndicationDataSellerProps) {
	const debouncedIndicationCode = useDebounce(infoHolder.codigoIndicacaoVendedor, 500);
	const { data: seller, isLoading, isError, isSuccess, error } = useSellerByIndicationCodeQuery(debouncedIndicationCode || "");
	return (
		<div className="w-full flex flex-col gap-1">
			<input
				value={infoHolder.codigoIndicacaoVendedor || ""}
				placeholder="Preencha aqui o código de indicação do vendedor..."
				onChange={(e) => updateInfoHolder({ codigoIndicacaoVendedor: e.target.value })}
				className="w-full rounded-md border border-primary/20 p-1 text-sm shadow-xs outline-hidden duration-500 ease-in-out placeholder:italic focus:border-primary"
			/>
			<p className="w-full text-center text-sm font-medium tracking-tight text-primary/80">Defina, se desejar, um vendedor específico para receber essa indicação.</p>
			{infoHolder.codigoIndicacaoVendedor ? (
				isSuccess ? (
					<div className="w-full flex items-center justify-center gap-1 flex-col lg:flex-row">
						<p className="text-sm tracking-tight text-primary/80 text-center font-bold">Essa indicação será recebida por:</p>
						<div className="flex items-center gap-1">
							<Avatar className="w-6 h-6">
								<AvatarImage src={seller.avatar_url || undefined} alt="Logo" />
								<AvatarFallback>{formatNameAsInitials(seller.nome)}</AvatarFallback>
							</Avatar>
							<p className="text-sm tracking-tight text-primary/80 text-center font-bold">{seller.nome}</p>
						</div>
					</div>
				) : isLoading ? (
					<p className="w-full text-center text-sm font-medium tracking-tight text-primary/80 animate-pulse">Buscando vendedor...</p>
				) : isError ? (
					<p className="w-full text-center text-sm font-medium tracking-tight text-red-500">{getErrorMessage(error)}</p>
				) : null
			) : null}
		</div>
	);
}

export default IndicationDataSeller;
