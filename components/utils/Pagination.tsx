import { renderPaginationPageNumberIcons } from '@/lib/methods/rendering';

type GeneralPaginationComponentProps = {
	activePage: number;
	totalPages: number;
	itemsMatchedText?: string;
	itemsShowingText?: string;
	selectPage: (page: number) => void;
	queryLoading: boolean;
};
function GeneralPaginationComponent({ totalPages, activePage, selectPage, itemsMatchedText, itemsShowingText, queryLoading }: GeneralPaginationComponentProps) {
	return (
		<div className="my-2 flex w-full flex-col items-center gap-3">
			{totalPages > 1 ? (
				<>
					<p className="w-full text-center text-primary/80 text-sm leading-none tracking-tight">
						Um número grande de resultados foi encontrado, separamos em páginas para facilitar a visualização. Clique na página desejada para visualizar os demais resultados.
					</p>
					<div className="flex flex-col items-center justify-center gap-1 lg:flex-row lg:gap-4">
						<button
							className="flex cursor-pointer select-none items-center gap-2 rounded-full px-6 py-3 text-center align-middle font-bold font-sans text-primary text-xs uppercase transition-all hover:bg-primary/10 active:bg-primary/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							disabled={queryLoading}
							onClick={() => {
								if (activePage - 1 > 0) return selectPage(activePage - 1);
								return;
							}}
							type="button"
						>
							<svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							ANTERIOR
						</button>
						<div className="flex items-center gap-2">
							{renderPaginationPageNumberIcons({
								totalPages,
								activePage,
								selectPage,
								disabled: queryLoading,
							})}
						</div>
						<button
							className="flex select-none items-center gap-2 rounded-full px-6 py-3 text-center align-middle font-bold font-sans text-primary text-xs uppercase transition-all hover:bg-primary/10 active:bg-primary/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							disabled={queryLoading}
							onClick={() => {
								if (activePage + 1 <= totalPages) selectPage(activePage + 1);
								else return;
							}}
							type="button"
						>
							PRÓXIMA
							<svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</button>
					</div>
				</>
			) : null}
			<div className="flex w-full flex-col gap-1">
				<p className="w-full text-center text-primary/80 text-sm leading-none tracking-tight">{itemsMatchedText ? itemsMatchedText : '...'}</p>
				<p className="w-full text-center text-primary/80 text-sm leading-none tracking-tight">{itemsShowingText ? itemsShowingText : '...'}</p>
			</div>
		</div>
	);
}

export default GeneralPaginationComponent;
