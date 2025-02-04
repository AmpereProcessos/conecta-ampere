import type React from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type TextareaInputProps = {
	identifier?: string;
	labelText: string;
	placeholderText: string;
	value: string;
	handleChange: (value: string) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function TextareaInput({
	identifier,
	labelText,
	placeholderText,
	value,
	handleChange,
	wrapperClassName,
	labelClassName,
	inputClassName,
}: TextareaInputProps) {
	const inputIdentifier =
		identifier || labelText.toLowerCase().replaceAll(" ", "_");
	return (
		<div
			className={cn(
				"flex w-full flex-col rounded-md border border-primary/20 shadow-sm",
				wrapperClassName,
			)}
		>
			<Label
				htmlFor={inputIdentifier}
				className={cn(
					"w-full rounded-tl-md rounded-tr-md bg-primary p-1 text-center text-xs font-bold text-primary-foreground",
					labelClassName,
				)}
			>
				{labelText}
			</Label>
			<Textarea
				id={inputIdentifier}
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={placeholderText}
				className={cn(
					"min-h-[80px] w-full resize-none rounded-bl-md rounded-br-md bg-[#fff] p-3 text-center text-xs font-medium text-primary outline-none dark:bg-[#121212] lg:min-h-[65px]",
					inputClassName,
				)}
			/>
		</div>
	);
}

export default TextareaInput;
