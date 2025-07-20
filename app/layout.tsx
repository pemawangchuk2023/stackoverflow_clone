import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import React from "react";

export const metadata: Metadata = {
	title: "SolutionHub",
	description: "The Stack Overflow Clone",
	icons: {
		icon: "/images/logo.png",
	},
	keywords: [
		"programming",
		"web development",
		"Q&A",
		"developers",
		"tech help",
	],
	authors: [
		{ name: "Pema", url: "https://pemawangchuk.pro" },
		{ name: "SolutionHub" },
	],
};

const RootLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const session = await auth();
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link
					rel='stylesheet'
					type='text/css'
					href='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css'
				/>
			</head>
			<body>
				<SessionProvider session={session}>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
					<Toaster />
				</SessionProvider>
			</body>
		</html>
	);
};

export default RootLayout;
