import type React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { formatAsValidNumber } from "@/lib/methods/formatting";

type NumberInputProps = {
	identifier?: string;
	labelText: string;
	placeholderText: string;
	value: number | null | undefined;
	editable?: boolean;
	handleChange: (value: number) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function NumberInput({
	identifier,
	labelText,
	placeholderText,
	value,
	editable = true,
	handleChange,
	wrapperClassName,
	labelClassName,
	inputClassName,
}: NumberInputProps) {
	const inputIdentifier =
		identifier || labelText.toLowerCase().replaceAll(" ", "_");
	return (
		<div className={cn("flex flex-col w-full gap-1", wrapperClassName)}>
			<Label
				htmlFor={inputIdentifier}
				className={cn(
					"text-sm font-medium tracking-tight text-primary/80",
					labelClassName,
				)}
			>
				{labelText}
			</Label>
			<Input
				readOnly={!editable}
				id={inputIdentifier}
				type="number"
				value={formatAsValidNumber(value)?.toString() ?? ""}
				onChange={(e) => handleChange(Number(e.target.value))}
				placeholder={placeholderText}
				className={cn(
					"w-full rounded-md border border-primary/20 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary",
					inputClassName,
				)}
			/>
		</div>
	);
}

export default NumberInput;
