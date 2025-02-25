"use client";
import { copyToClipboard } from "@/lib/methods/utils";
import { Copy, LinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type HeaderIndicationBlockProps = {
	sessionUserId: string;
};
function HeaderIndicationBlock({ sessionUserId }: HeaderIndicationBlockProps) {
	return (
		<div className="w-full flex items-center justify-center gap-1.5">
			<div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 border border-[#15599a]">
				<LinkIcon className="w-2 h-2 lg:w-3 lg:h-3 min-w-3 min-h-3" color="#15599a" />
				<Link href={`/invites/promoter/${sessionUserId}`} className="text-center text-[0.5rem] lg:text-xs font-bold italic text-[#15599a]">
					SEU LINK DE INDICAÇÃO
				</Link>
			</div>
			<button
				onClick={async () => await copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/invites/promoter/${sessionUserId}`)}
				type="button"
				className="px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1"
			>
				<Copy className="w-2 h-2 lg:w-3 lg:h-3 min-w-3 min-h-3" />
				<h1 className="text-center text-[0.5rem] lg:text-xs font-bold italic text-primary/80">COPIAR LINK</h1>
			</button>
		</div>
	);
}

export default HeaderIndicationBlock;
