import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type TextInputProps = {
	identifier?: string;
	labelText: string;
	placeholderText: string;
	value: string;
	handleChange: (value: string) => void;
	wrapperClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
};
function TextInput({ identifier, labelText, placeholderText, value, handleChange, wrapperClassName, labelClassName, inputClassName }: TextInputProps) {
	const inputIdentifier = identifier || labelText.toLowerCase().replaceAll(' ', '_');
	return (
		<div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
			<Label className={cn('font-medium text-primary/80 text-sm tracking-tight', labelClassName)} htmlFor={inputIdentifier}>
				{labelText}
			</Label>
			<Input
				className={cn(
					'w-full rounded-md border border-primary/20 bg-background p-3 text-sm shadow-sm outline-none duration-500 ease-in-out placeholder:italic focus:border-primary focus:bg-accent',
					inputClassName
				)}
				id={inputIdentifier}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={placeholderText}
				value={value}
			/>
		</div>
	);
}

export default TextInput;
