import { cn } from "@/lib/utils";
import React, { type ReactNode, useState } from "react";
import { Label } from "../ui/label";
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

type SelectOption = {
	id: string | number;
	startContent?: ReactNode;
	label: string;
	value: string;
};

type SelectInputProps = {
	identifier?: string;
	labelText: string;
	placeholderText: string;
	resetOptionText: string;
	value: string | null;
	editable?: boolean;
	handleChange: (value: string) => void;
	handleReset: () => void;
	options: SelectOption[];
	optionsStartContent?: ReactNode;
	wrapperClassName?: string;
	labelClassName?: string;
};
function SelectInput({
	identifier,
	labelText,
	placeholderText,
	resetOptionText,
	value,
	editable = true,
	handleChange,
	handleReset,
	options,
	optionsStartContent,
	wrapperClassName,
	labelClassName,
}: SelectInputProps) {
	const inputIdentifier =
		identifier || labelText.toLowerCase().replaceAll(" ", "_");
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return isDesktop ? (
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
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						disabled={!editable}
						variant="outline"
						aria-haspopup="listbox"
						aria-expanded={isOpen}
						className="w-full justify-between"
					>
						<SelectedOption
							value={value}
							options={options}
							placeholderText={placeholderText}
						/>
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
					<OptionsList
						value={value}
						placeholderText={placeholderText}
						resetOptionText={resetOptionText}
						handleChange={handleChange}
						handleReset={handleReset}
						options={options}
						optionsStartContent={optionsStartContent}
						closeMenu={() => setIsOpen(false)}
					/>
				</PopoverContent>
			</Popover>
		</div>
	) : (
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
			<Drawer open={isOpen} onOpenChange={setIsOpen}>
				<DrawerTrigger asChild>
					<Button
						type="button"
						disabled={!editable}
						variant="outline"
						aria-haspopup="listbox"
						aria-expanded={isOpen}
						className="w-full justify-between"
					>
						<SelectedOption
							value={value}
							options={options}
							placeholderText={placeholderText}
						/>
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mt-4 border-t">
						<OptionsList
							value={value}
							placeholderText={placeholderText}
							resetOptionText={resetOptionText}
							handleChange={handleChange}
							handleReset={handleReset}
							options={options}
							optionsStartContent={optionsStartContent}
							closeMenu={() => setIsOpen(false)}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default SelectInput;

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

	if (!selectedOption) return placeholderText;
	return (
		<span className="flex items-center gap-1 overflow-hidden">
			{selectedOption.startContent ?? null}
			{selectedOption.label}
		</span>
	);
}
