import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type DateIntervalInputProps = {
	identifier?: string;
	labelText: string;
	placeholderText?: string;
	value: { after?: Date; before?: Date };
	editable?: boolean;
	handleChange: (value: { after?: Date; before?: Date }) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};

function DateIntervalInput({
	identifier,
	labelText,
	placeholderText = 'Escolha uma data',
	value,
	editable = true,
	handleChange,
	wrapperClassName,
	labelClassName,
	inputClassName,
}: DateIntervalInputProps) {
	const inputIdentifier = identifier || labelText.toLowerCase().replaceAll(' ', '_');
	const [open, setOpen] = useState(false);

	// Internal state for managing selection during popover open
	const [internalValue, setInternalValue] = useState<{ after?: Date; before?: Date }>({});

	// Reset internal state when popover opens
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen) {
			// Reset internal state when opening
			setInternalValue({});
		}
	};

	// Function to handle date selection
	const handleDateSelect = (dateRange: { from?: Date; to?: Date } | undefined) => {
		const newValue = { after: dateRange?.from, before: dateRange?.to };
		setInternalValue(newValue);

		// Only commit to parent when both dates are selected
		if (dateRange?.from && dateRange?.to) {
			handleChange(newValue);
			setOpen(false);
		}
	};

	// Function to clear the selection
	const handleClear = () => {
		const clearedValue = { after: undefined, before: undefined };
		setInternalValue(clearedValue);
		handleChange(clearedValue);
		setOpen(false);
	};

	// Display value (use internal state when open, external value when closed)
	const displayValue = open ? internalValue : value;

	return (
		<div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
			<Label className={cn('font-medium text-primary/80 text-sm tracking-tight', labelClassName)} htmlFor={inputIdentifier}>
				{labelText}
			</Label>
			<Popover onOpenChange={handleOpenChange} open={open}>
				<PopoverTrigger asChild>
					<Button
						className={cn(
							'w-full justify-start rounded-md border border-primary/20 bg-background p-3 text-left font-normal text-sm shadow-sm outline-none duration-500 ease-in-out focus:border-primary',
							!(displayValue.after || displayValue.before) && 'text-muted-foreground',
							inputClassName
						)}
						disabled={!editable}
						id={inputIdentifier}
						variant={'outline'}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{displayValue?.after ? (
							displayValue.before ? (
								<>
									{format(displayValue.after, 'dd/MM/yyyy', { locale: ptBR })} - {format(displayValue.before, 'dd/MM/yyyy', { locale: ptBR })}
								</>
							) : (
								<>{format(displayValue.after, 'dd/MM/yyyy', { locale: ptBR })} - Selecionar data final</>
							)
						) : (
							<span>{placeholderText}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-auto p-0">
					<div className="flex flex-col gap-2 p-2">
						<Calendar
							defaultMonth={displayValue?.after}
							initialFocus
							locale={ptBR}
							mode="range"
							numberOfMonths={2}
							onSelect={handleDateSelect}
							selected={{ from: displayValue.after, to: displayValue.before }}
						/>
						{/* Clear button for better UX */}
						{(displayValue.after || displayValue.before) && (
							<Button className="w-full text-xs" onClick={handleClear} size="sm" variant="outline">
								Limpar seleção
							</Button>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default DateIntervalInput;
