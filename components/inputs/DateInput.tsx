import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type DateInputProps = {
	identifier?: string;
	labelText: string;
	value: string | undefined;
	editable?: boolean;
	handleChange: (value: string | undefined) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function DateInput({ identifier, labelText, value, editable = true, handleChange, wrapperClassName, labelClassName, inputClassName }: DateInputProps) {
	const inputIdentifier = identifier || labelText.toLowerCase().replaceAll(' ', '_');
	return (
		<div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
			<Label className={cn('font-medium text-primary/80 text-sm tracking-tight', labelClassName)} htmlFor={inputIdentifier}>
				{labelText}
			</Label>
			<Input
				className={cn('w-full rounded-md border border-primary/20 p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary', inputClassName)}
				id={inputIdentifier}
				onChange={(e) => handleChange(e.target.value !== '' ? e.target.value : undefined)}
				onReset={() => handleChange(undefined)}
				readOnly={!editable}
				type="date"
				value={value}
			/>
		</div>
	);
}

export default DateInput;
