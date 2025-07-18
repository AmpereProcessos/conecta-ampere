import { Check, ChevronsUpDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '../ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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
	const inputIdentifier = identifier || labelText.toLowerCase().replaceAll(' ', '_');
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return isDesktop ? (
		<div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
			<Label className={cn('font-medium text-primary/80 text-sm tracking-tight', labelClassName)} htmlFor={inputIdentifier}>
				{labelText}
			</Label>
			<Popover onOpenChange={setIsOpen} open={isOpen}>
				<PopoverTrigger asChild>
					<Button aria-expanded={isOpen} aria-haspopup="listbox" className="w-full justify-between" disabled={!editable} type="button" variant="outline">
						<SelectedOption options={options} placeholderText={placeholderText} value={value} />
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
					<OptionsList
						closeMenu={() => setIsOpen(false)}
						handleChange={handleChange}
						handleReset={handleReset}
						options={options}
						optionsStartContent={optionsStartContent}
						placeholderText={placeholderText}
						resetOptionText={resetOptionText}
						value={value}
					/>
				</PopoverContent>
			</Popover>
		</div>
	) : (
		<div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
			<Label className={cn('font-medium text-primary/80 text-sm tracking-tight', labelClassName)} htmlFor={inputIdentifier}>
				{labelText}
			</Label>
			<Drawer onOpenChange={setIsOpen} open={isOpen}>
				<DrawerTrigger asChild>
					<Button aria-expanded={isOpen} aria-haspopup="listbox" className="w-full justify-between" disabled={!editable} type="button" variant="outline">
						<SelectedOption options={options} placeholderText={placeholderText} value={value} />
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mt-4 border-t">
						<OptionsList
							closeMenu={() => setIsOpen(false)}
							handleChange={handleChange}
							handleReset={handleReset}
							options={options}
							optionsStartContent={optionsStartContent}
							placeholderText={placeholderText}
							resetOptionText={resetOptionText}
							value={value}
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
function OptionsList({ value, placeholderText, resetOptionText, handleChange, handleReset, options, optionsStartContent, closeMenu }: OptionsListProps) {
	return (
		<Command className="w-full" loop>
			<CommandInput className="h-9 w-full" placeholder={placeholderText} />
			<CommandList className="w-full">
				<CommandEmpty className="w-full p-3">Nenhuma opção encontrada.</CommandEmpty>
				<CommandGroup className="w-full">
					<CommandItem
						onSelect={() => {
							handleReset();
							closeMenu();
						}}
						value={undefined}
					>
						{resetOptionText}
						<Check className={cn('ml-auto', value === null ? 'opacity-100' : 'opacity-0')} />
					</CommandItem>
					<CommandSeparator className="my-1" />
					{options.map((option) => (
						<CommandItem
							key={option.id}
							onSelect={(currentValue) => {
								if (currentValue === value) handleReset();
								else handleChange(currentValue);
								closeMenu();
							}}
							value={option.value}
						>
							{option.startContent ?? optionsStartContent}
							{option.label}
							<Check className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')} />
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
function SelectedOption({ value, placeholderText, options }: SelectedOptionProps) {
	const selectedOption = options.find((o) => o.value === value);

	if (!selectedOption) return placeholderText;
	return (
		<span className="flex items-center gap-1 overflow-hidden">
			{selectedOption.startContent ?? null}
			{selectedOption.label}
		</span>
	);
}
