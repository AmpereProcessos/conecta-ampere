"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import type * as React from "react";
import { ThemeProvider } from "./themes/ThemeProvider";
import { getQueryClient } from "@/lib/query-client";

export default function ProvidersWrapper({
	children,
}: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</QueryClientProvider>
	);
}
