import type { ComponentType } from 'react';
import type { IconType } from 'react-icons/lib';
import { cn } from '../utils';

export function renderIcon(icon: IconType, size = 12) {
	return icon({ size, className: 'shrink-0' });
}
export function renderIconWithClassNames(icon: ComponentType | IconType, className?: string) {
	const IconComponent = icon;
	return <IconComponent className={cn('h-4 min-h-4 w-4 min-w-4', className)} />;
}
export function renderPaginationPageNumberIcons({
	totalPages,
	activePage,
	selectPage,
	disabled,
}: {
	totalPages: number;
	activePage: number;
	selectPage: (page: number) => void;
	disabled: boolean;
}) {
	const MAX_RENDER = 5;
	function getPagesNumbers() {
		if (totalPages <= MAX_RENDER) return Array.from({ length: totalPages }, (_, i) => i + 1);
		if (totalPages - activePage > 3 && activePage - 1 > 3) return [1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages];
		if (activePage > 3 && totalPages - activePage < MAX_RENDER - 1) return [1, '...', ...Array.from({ length: MAX_RENDER }, (_, i) => i + totalPages - MAX_RENDER), totalPages];
		return [...Array.from({ length: MAX_RENDER }, (_, i) => i + 1), '...', totalPages];
	}
	const pages = getPagesNumbers();
	return pages.map((p) => (
		<button
			className={`${
				activePage === p ? 'border-primary bg-primary text-secondary' : 'border-transparent text-primary hover:bg-primary/50'
			} h-8 max-h-10 min-h-8 w-8 min-w-8 max-w-10 cursor-pointer rounded-full border font-medium text-xs lg:h-10 lg:min-h-10 lg:w-10 lg:min-w-10`}
			disabled={typeof p !== 'number' || disabled}
			key={p}
			onClick={() => {
				if (typeof p !== 'number') return;
				return selectPage(p);
			}}
			type="button"
		>
			{p}
		</button>
	));
}
