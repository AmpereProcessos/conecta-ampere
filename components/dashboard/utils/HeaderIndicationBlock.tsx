'use client';
import { Copy, LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { copyToClipboard } from '@/lib/methods/utils';

type HeaderIndicationBlockProps = {
	sessionUserId: string;
};
function HeaderIndicationBlock({ sessionUserId }: HeaderIndicationBlockProps) {
	return (
		<div className="flex w-full items-center justify-center gap-1.5">
			<div className="flex items-center gap-1 rounded-lg border border-[#15599a] bg-blue-50 px-2 py-0.5">
				<LinkIcon className="h-2 min-h-3 w-2 min-w-3 lg:h-3 lg:w-3" color="#15599a" />
				<Link className="text-center font-bold text-[#15599a] text-[0.55rem] italic lg:text-xs" href={`/invites/promoter/${sessionUserId}`}>
					SEU LINK DE INDICAÇÃO
				</Link>
			</div>
			<button
				className="flex cursor-pointer items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary"
				onClick={async () => await copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/invites/promoter/${sessionUserId}`)}
				type="button"
			>
				<Copy className="h-2 min-h-3 w-2 min-w-3 lg:h-3 lg:w-3" />
				<h1 className="text-center font-bold text-[0.55rem] text-primary/80 italic lg:text-xs">COPIAR LINK</h1>
			</button>
		</div>
	);
}

export default HeaderIndicationBlock;
