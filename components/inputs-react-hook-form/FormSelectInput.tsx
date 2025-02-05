import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

type SelectOption = {
	id: string | number;
	startContent?: ReactNode;
	label: string;
	value: string;
};

type FormSelectInputProps<TFieldValues extends FieldValues = FieldValues> = {
	field: ControllerRenderProps<TFieldValues>;
	labelText: string;
	placeholderText: string;
	resetOptionText: string;
	options: SelectOption[];
	description?: string;
	editable?: boolean;
	optionsStartContent?: ReactNode;
	wrapperClassName?: string;
	labelClassName?: string;
};

export function FormSelectInput<
	TFieldValues extends FieldValues = FieldValues,
>({
	field,
	labelText,
	placeholderText,
	resetOptionText,
	options,
	description,
	editable = true,
	optionsStartContent,
	wrapperClassName,
	labelClassName,
}: FormSelectInputProps<TFieldValues>) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

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
			<SelectContent
				field={field}
				isDesktop={isDesktop}
				editable={editable}
				placeholder={placeholderText}
				resetOptionText={resetOptionText}
				options={options}
				optionsStartContent={optionsStartContent}
			/>
			{description && <FormDescription>{description}</FormDescription>}
			<FormMessage />
		</FormItem>
	);
}

export default FormSelectInput;
type SelectContentProps<TFieldValues extends FieldValues = FieldValues> = {
	field: ControllerRenderProps<TFieldValues>;
	isDesktop: boolean;
	editable: boolean;
	placeholder: string;
	resetOptionText: string;
	options: SelectOption[];
	optionsStartContent?: ReactNode;
};

function SelectContent<TFieldValues extends FieldValues = FieldValues>({
	field,
	isDesktop,
	editable,
	placeholder,
	resetOptionText,
	options,
	optionsStartContent,
}: SelectContentProps<TFieldValues>) {
	const [isOpen, setIsOpen] = React.useState(false);

	const SelectWrapper = isDesktop ? Popover : Drawer;
	const SelectTriggerWrapper = isDesktop ? PopoverTrigger : DrawerTrigger;
	const SelectContentWrapper = isDesktop ? PopoverContent : DrawerContent;

	return (
		<FormControl>
			<SelectWrapper open={isOpen} onOpenChange={setIsOpen}>
				<SelectTriggerWrapper asChild>
					<Button
						type="button"
						disabled={!editable}
						variant="outline"
						aria-expanded={isOpen}
						className="w-full justify-between"
					>
						<SelectedOption
							value={field.value}
							options={options}
							placeholderText={placeholder}
						/>
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</SelectTriggerWrapper>
				<SelectContentWrapper
					className={isDesktop ? "p-0 w-[--radix-popover-trigger-width]" : ""}
				>
					<div className={!isDesktop ? "mt-4 border-t" : ""}>
						<OptionsList
							value={field.value}
							placeholderText={placeholder}
							resetOptionText={resetOptionText}
							handleChange={(value) => field.onChange(value)}
							handleReset={() => field.onChange(null)}
							options={options}
							optionsStartContent={optionsStartContent}
							closeMenu={() => setIsOpen(false)}
						/>
					</div>
				</SelectContentWrapper>
			</SelectWrapper>
		</FormControl>
	);
}

// Reuse your existing OptionsList and SelectedOption components
type OptionsListProps = {
	value: string | null;
	placeholderText: string;
	resetOptionText: string;
	handleChange: (value: string) => void;
	handleReset: () => void;
	options: SelectOption[];
	optionsStartContent?: ReactNode;
	closeMenu: () => void;
};

function OptionsList({
	value,
	placeholderText,
	resetOptionText,
	handleChange,
	handleReset,
	options,
	optionsStartContent,
	closeMenu,
}: OptionsListProps) {
	return (
		<Command className="w-full" loop>
			<CommandInput placeholder={placeholderText} className="h-9 w-full" />
			<CommandList className="w-full">
				<CommandEmpty className="w-full p-3">
					Nenhuma opção encontrada.
				</CommandEmpty>
				<CommandGroup className="w-full">
					<CommandItem
						value={undefined}
						onSelect={() => {
							handleReset();
							closeMenu();
						}}
					>
						{resetOptionText}
						<Check
							className={cn(
								"ml-auto",
								value === null ? "opacity-100" : "opacity-0",
							)}
						/>
					</CommandItem>
					<CommandSeparator className="my-1" />
					{options.map((option) => (
						<CommandItem
							key={option.id}
							value={option.value}
							onSelect={(currentValue) => {
								if (currentValue === value) handleReset();
								else handleChange(currentValue);
								closeMenu();
							}}
						>
							{option.startContent
								? option.startContent
								: optionsStartContent
									? optionsStartContent
									: undefined}
							{option.label}
							<Check
								className={cn(
									"ml-auto",
									value === option.value ? "opacity-100" : "opacity-0",
								)}
							/>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

type SelectedOptionProps = {
	value: string | null;
	placeholderText: string;
	options: SelectOption[];
};

function SelectedOption({
	value,
	placeholderText,
	options,
}: SelectedOptionProps) {
	const selectedOption = options.find((o) => o.value === value);

	if (!selectedOption) return <>{placeholderText}</>;
	return (
		<span className="flex items-center gap-1 overflow-hidden">
			{selectedOption.startContent ?? null}
			{selectedOption.label}
		</span>
	);
}
