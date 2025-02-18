import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import React from "react"

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
				<body>
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
