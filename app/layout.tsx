import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import React from "react";
import { Poppins, Space_Grotesk } from "next/font/google";
import GlobalFooter from "@/components/global/GlobalFooter";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
	title: "SolutionHub",
	description: "SolutionHub",
	icons: {
		icon: "/images/logo2.png",
	},
	keywords: [
		"programming",
		"web development",
		"Q&A",
		"developers",
		"tech help",
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
			<body className={`${poppins.variable} ${spaceGrotesk.variable}`}>
				<SessionProvider session={session}>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						disableTransitionOnChange
					>
						{children}
						<GlobalFooter />
					</ThemeProvider>
					<Toaster />
				</SessionProvider>
			</body>
		</html>
	);
};

export default RootLayout;
