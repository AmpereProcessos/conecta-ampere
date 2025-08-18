import { FaSolarPanel } from 'react-icons/fa';
import { ReferEarnOptions } from '@/configs/constants';
import type { TIndication } from '@/schemas/indication.schema';

type ProjectTypeSelectionProps = {
	updateInfoHolder: (changes: Partial<TIndication>) => void;
};
function ProjectTypeSelection({ updateInfoHolder }: ProjectTypeSelectionProps) {
	return (
		<div className="scrollbar-thin scrollbar-track-primary/10 scrollbar-thumb-primary/30 flex h-full w-full flex-col gap-1.5 overflow-y-auto overscroll-y-auto py-4">
			<h1 className="w-full text-center font-bold text-sm leading-none tracking-tight lg:text-lg">SELECIONE O TIPO DE INDICAÇÃO</h1>
			<div className="grid w-full grid-cols-2 items-center gap-1.5 px-6 py-3">
				{ReferEarnOptions.map((option) => (
					<button
						className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg bg-blue-100 p-2 text-[#15599a] duration-300 ease-in-out hover:bg-blue-200 sm:aspect-auto lg:p-8"
						key={`${option.id}-${option.projectTypeId}`}
						onClick={() =>
							updateInfoHolder({
								tipo: {
									id: option.projectTypeId,
									titulo: option.projectType,
									categoriaVenda: option.projectTypeSaleCategory,
								},
							})
						}
						type="button"
					>
						<FaSolarPanel className="h-6 min-h-4 w-6 min-w-4 lg:h-12 lg:w-12" />
						<h1 className="break-words text-center font-bold text-[0.55rem] uppercase tracking-tight lg:text-lg">{option.referEarnCall}</h1>
					</button>
				))}
			</div>
		</div>
	);
}

export default ProjectTypeSelection;
