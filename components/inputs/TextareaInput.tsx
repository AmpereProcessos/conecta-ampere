import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

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
function TextareaInput({ identifier, labelText, placeholderText, value, handleChange, wrapperClassName, labelClassName, inputClassName }: TextareaInputProps) {
	const inputIdentifier = identifier || labelText.toLowerCase().replaceAll(' ', '_');
	return (
		<div className={cn('flex w-full flex-col gap-1', wrapperClassName)}>
			<Label className={cn('font-medium text-primary/80 text-sm tracking-tight', labelClassName)} htmlFor={inputIdentifier}>
				{labelText}
			</Label>
			<Textarea
				className={cn(
					'field-sizing-content min-h-[80px] w-full max-w-full resize-none rounded-md border border-primary/20 bg-[#fff] p-3 text-center font-medium text-primary text-xs outline-none lg:min-h-[65px] dark:bg-[#121212]',
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

export default TextareaInput;
