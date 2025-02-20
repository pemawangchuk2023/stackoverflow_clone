import { auth } from "@/auth"
import MobileNavigation from "@/components/navigation/navbar/MobileNavigation"
import ThemeToggle from "@/components/navigation/themes/ThemeToggle"
import UserAvatar from "@/components/UserAvatar"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Navbar = async () => {
	const session = await auth()
	return (
		<nav
			className="flex-between background-light900_dark200 fixed 
        z-50 w-full p-6 shadow-light-300 dark:shadow-none sm:px-12 gap-5"
		>
			<Link href="/" className="flex items-center gap-1">
				<Image
					src="/images/site-logo.svg"
					alt="site-logo"
					width={23}
					height={23}
				/>
				<p className="h2-bold font-space-grotesque text-dark-100 dark:text-light-900 max-sm:hidden">
					StackOverFlow
					<span className="text-primary-500"> Clone</span>
				</p>
			</Link>
			<p>GlobalSearch</p>
			<div className="flex-between gap-5">
				<ThemeToggle />
				{session?.user?.id && (
					<UserAvatar
						id={session.user.id}
						name={session.user.name}
						imageUrl={session.user?.image}
					/>
				)}
				<MobileNavigation />
			</div>
		</nav>
	)
}

export default Navbar
