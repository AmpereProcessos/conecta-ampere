import type React from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

type FormTextInputProps<TFieldValues extends FieldValues = FieldValues> = {
	field: ControllerRenderProps<TFieldValues>;
	labelText: string;
	placeholderText: string;
	description?: string;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function FormTextInput<TFieldValues extends FieldValues = FieldValues>({
	field,
	labelText,
	placeholderText,
	description,
	wrapperClassName,
	labelClassName,
	inputClassName,
}: FormTextInputProps<TFieldValues>) {
	return (
		<FormItem className={cn("flex flex-col w-full gap-1", wrapperClassName)}>
			<FormLabel
				className={cn(
					"text-sm font-medium tracking-tight text-primary/80",
					labelClassName,
				)}
			>
				{labelText}
			</FormLabel>
			<FormControl>
				<Input
					{...field}
					placeholder={placeholderText}
					className={cn(
						"w-full rounded-md border border-primary/20 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary",
						inputClassName,
					)}
				/>
			</FormControl>
			{description && <FormDescription>{description}</FormDescription>}
			<FormMessage />
		</FormItem>
	);
}

export default FormTextInput;
