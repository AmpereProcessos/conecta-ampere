import type React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

type PasswordInputProps = {
	identifier?: string;
	labelText: string;
	placeholderText: string;
	value: string;
	handleChange: (value: string) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function PasswordInput({ identifier, labelText, placeholderText, value, handleChange, wrapperClassName, labelClassName, inputClassName }: PasswordInputProps) {
	const inputIdentifier = identifier || labelText.toLowerCase().replaceAll(" ", "_");
	return (
		<div className={cn("flex flex-col w-full gap-1", wrapperClassName)}>
			<Label htmlFor={inputIdentifier} className={cn("text-sm font-medium tracking-tight text-primary/80", labelClassName)}>
				{labelText}
			</Label>
			<Input
				id={inputIdentifier}
				type="password"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={placeholderText}
				className={cn("w-full rounded-md border border-primary/20 p-3 text-sm shadow-xs outline-hidden duration-500 ease-in-out placeholder:italic focus:border-primary", inputClassName)}
			/>
		</div>
	);
}

export default PasswordInput;
