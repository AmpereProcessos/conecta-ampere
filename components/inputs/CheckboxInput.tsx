import type React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type CheckboxInputProps = {
	identifier?: string;
	labelTrueText: string;
	labelFalseText: string;
	value: boolean;
	handleChange: (value: boolean) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function CheckboxInput({ identifier, labelTrueText, labelFalseText, value, handleChange, wrapperClassName, labelClassName, inputClassName }: CheckboxInputProps) {
	const inputIdentifier = identifier || labelTrueText.toLowerCase().replaceAll(" ", "_");
	return (
		<div className={cn("flex flex-col w-full gap-1", wrapperClassName)}>
			<Label htmlFor={inputIdentifier} className={cn("text-sm font-medium tracking-tight text-primary/80", labelClassName)}>
				{value ? labelTrueText : labelFalseText}
			</Label>
			<Checkbox
				id={inputIdentifier}
				checked={value}
				onCheckedChange={(e) => handleChange(e === true)}
				className={cn("w-full rounded-md border border-primary/20 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary", inputClassName)}
			/>
		</div>
	);
}

export default CheckboxInput;
