import { clsx, type ClassValue } from "clsx";
import { env } from "node:process";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
	return new URL(path, env.NEXT_PUBLIC_URL).href;
}
