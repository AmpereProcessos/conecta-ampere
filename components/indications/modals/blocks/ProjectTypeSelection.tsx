import { ReferEarnOptions } from "@/configs/constants";
import type { TIndication } from "@/schemas/indication.schema";
import React from "react";
import { FaSolarPanel } from "react-icons/fa";

type ProjectTypeSelectionProps = {
	updateInfoHolder: (changes: Partial<TIndication>) => void;
};
function ProjectTypeSelection({ updateInfoHolder }: ProjectTypeSelectionProps) {
	return (
		<div className="h-full w-full flex flex-col gap-1.5 py-4 overflow-y-auto overscroll-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
			<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight w-full text-center">
				SELECIONE O TIPO DE INDICAÇÃO
			</h1>
			<div className="w-full grid grid-cols-2 items-center py-3 px-6 gap-1.5">
				{ReferEarnOptions.map((option) => (
					<button
						type="button"
						onClick={() =>
							updateInfoHolder({
								tipo: {
									id: option.projectTypeId,
									titulo: option.projectType,
									categoriaVenda: option.projectTypeSaleCategory,
								},
							})
						}
						key={`${option.id}-${option.projectTypeId}`}
						className="flex hover:bg-blue-200 duration-300 ease-in-out flex-col items-center justify-center gap-1 p-2 lg:p-8 bg-blue-100 text-[#15599a] rounded-lg aspect-video sm:aspect-auto"
					>
						<FaSolarPanel className="w-6 h-6 lg:w-12 lg:h-12 min-w-4 min-h-4" />
						<h1 className="font-bold text-[0.55rem] lg:text-lg tracking-tight text-center uppercase break-words">
							{option.referEarnCall}
						</h1>
					</button>
				))}
			</div>
		</div>
	);
}

export default ProjectTypeSelection;
