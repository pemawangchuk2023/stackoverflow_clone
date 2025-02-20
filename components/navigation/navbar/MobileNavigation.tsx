import React from "react"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import ROUTES from "@/constants/routes"
import { Button } from "@/components/ui/button"
import NavLinks from "@/components/navigation/navbar/NavLinks"
import { auth, signOut } from "@/auth"
import { LogOut } from "lucide-react"

const MobileNavigation = async () => {
	const session = await auth()

	const userId = session?.user?.id
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image
					src="/icons/hamburger.svg"
					alt="hamburger"
					width={36}
					height={36}
					className="invert-colors sm:hidden"
				/>
			</SheetTrigger>
			<SheetContent side="left" className="background-light900_dark200">
				<SheetHeader className="">
					<SheetTitle className="hidden">Navigation</SheetTitle>
					<Link href="/" className="flex items-center">
						<Image
							src="/images/site-logo.svg"
							alt="site-logo"
							width={23}
							height={23}
						/>
						<p className="h2-bold font-space-grotesque text-dark-100 dark:text-light-900 ml-2">
							StackOverFlow
							<span className="text-primary-500"> Clone</span>
						</p>
					</Link>
					<div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
						<SheetClose asChild>
							<section className="flex h-full flex-col gap-6 pt-16">
								<NavLinks isMobileNav />
							</section>
						</SheetClose>

						<div className="flex flex-col gap-3">
							{userId ? (
								<SheetClose asChild>
									<form
										action={async () => {
											"use server"
											await signOut()
										}}
									>
										<Button
											type="submit"
											className="base-medium w-fit !bg-transparent px-4 py-3 flex items-center gap-2"
										>
											<LogOut className="size-5 text-black dark:text-white" />
											<span className="text-dark300_light900">Logout</span>
										</Button>
									</form>
								</SheetClose>
							) : (
								<>
									<SheetClose asChild>
										<Link href={ROUTES.SIGN_IN}>
											<Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
												<span className="primary-text-gradient">Sign In</span>
											</Button>
										</Link>
									</SheetClose>

									<SheetClose asChild>
										<Link href={ROUTES.SIGN_UP}>
											<Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
												Sign Up
											</Button>
										</Link>
									</SheetClose>
								</>
							)}
						</div>
					</div>

					<div className="flex flex-col gap-3">
						{userId ? (
							<SheetClose asChild>
								<form
									action={async () => {
										"use server"
										await signOut()
									}}
								>
									<Button
										type="submit"
										className="base-medium w-fit !bg-transparent px-4 py-3"
									>
										<LogOut className="size-5 text-black dark:text-white" />
										<span className="text-dark300_light900">Logout</span>
									</Button>
								</form>
							</SheetClose>
						) : (
							<>
								<SheetClose asChild>
									<Link href={ROUTES.SIGN_IN}>
										<Button
											className="small-medium btn-secondary min-h-[41px] rounded-lg
                                  px-4 py-3 shadow-none w-full
                                  "
										>
											<span className="primary-text-gradient">Sign In</span>
										</Button>
									</Link>
								</SheetClose>
								<SheetClose asChild>
									<Link href={ROUTES.SIGN_UP}>
										<Button
											className="small-medium light-border-2 btn-tertiary 
										text-dark400_light900
                                    min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none
                                    
                                    "
										>
											Sign Up
										</Button>
									</Link>
								</SheetClose>
							</>
						)}
					</div>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}

export default MobileNavigation
