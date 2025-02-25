"use server";
import React from "react";

import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import { Copy, IdCard, LogOut } from "lucide-react";
import Image from "next/image";
import Logo from "@/assets/svgs/ampere-blue-logo-icon.svg";
import type { TAuthSession } from "@/lib/authentication/types";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeModeToggle } from "../themes/ThemeToggle";
import { Button } from "../ui/button";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { copyToClipboard } from "@/lib/methods/utils";
import HeaderIndicationBlock from "./utils/HeaderIndicationBlock";
type UserHeaderProps = {
	sessionUser: TAuthSession["user"];
};
function UserHeader({ sessionUser }: UserHeaderProps) {
	return (
		<div className="bg-background w-full flex p-3.5 flex-col gap-1.5 shadow-sm border border-primary/20 rounded-lg">
			<div className="w-full flex items-center justify-between gap-1.5">
				<div className="flex items-center gap-1.5">
					<Avatar className="w-6 h-6 lg:w-8 lg:h-8 min-w-6 min-h-6">
						<AvatarImage src={sessionUser.avatar_url || undefined} />
						<AvatarFallback className="text-xs">CN</AvatarFallback>
					</Avatar>
					<h1 className="text-sm lg:text-lg font-bold leading-none tracking-tight">{sessionUser.nome}</h1>
				</div>
				<div className="flex items-center gap-1.5">
					<ThemeModeToggle />
					<Button variant="ghost" asChild>
						<Link href={"/logout"} prefetch={false}>
							<LogOut className="h-[1.2rem] w-[1.2rem]" />
						</Link>
					</Button>
				</div>
			</div>
			<div className="flex w-full items-center justify-between gap-1.5">
				<div className="flex items-center gap-1">
					<IdCard className="w-5 h-5 lg:w-6 lg:h-6 min-w-6 min-h-6" />
					<h1 className="py-0.5 text-center text-[0.6rem] lg:text-xs font-medium italic text-primary/80">{sessionUser.cpfCnpj || "N/A"}</h1>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-5 h-5 lg:w-6 lg:h-6 min-w-6 min-h-6 relative">
						<Image src={Logo} alt="Logo Ampère Energias" fill={true} />
					</div>
					<h1 className="py-0.5 text-center text-[0.6rem] lg:text-xs font-medium italic text-primary/80">CONECTA AMPÈRE</h1>
				</div>
			</div>
			<HeaderIndicationBlock sessionUserId={sessionUser.id} />
		</div>
	);
}

export default UserHeader;
