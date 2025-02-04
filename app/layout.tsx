import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import React from "react"

const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
})
const spaceGrotesk = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
})

export const metadata: Metadata = {
	title: "Stack Overflow Clone",
	description: "The Stack Overflow Clone",
	icons: {
		icon: "/images/logo.png",
	},
}

const RootLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const session = await auth()
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					type="text/css"
					href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
				/>
			</head>
			<SessionProvider session={session}>
				<body className={`${inter.variable} ${spaceGrotesk.variable}`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</body>
				<Toaster />
			</SessionProvider>
		</html>
	)
}

export default RootLayout
