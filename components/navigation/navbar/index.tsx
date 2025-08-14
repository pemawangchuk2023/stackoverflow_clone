import { auth, signOut } from "@/auth";
import ThemeToggle from "@/components/navigation/themes/ThemeToggle";
import GlobalSearch from "@/components/search/GlobalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = async () => {
	const session = await auth();
	const userId = session?.user?.id;

	return (
		<nav className='fixed z-50 w-full background-light900_dark200 border-b shadow-light-300 dark:shadow-none'>
			<div className='mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8'>
				{/* Left: Logo */}
				<Link href='/' className='flex items-center gap-2'>
					<Image
						src='/images/logo2.png'
						alt='site-logo'
						width={32}
						height={32}
						className='rounded-md'
						priority
					/>
					<span className='h3-bold font-space-grotesque text-dark-100 dark:text-light-900 max-sm:hidden'>
						SolutionHub
					</span>
				</Link>

				{/* Middle: Search (flexes) */}
				<div className='mx-2 flex-1'>
					<GlobalSearch />
				</div>

				{/* Right: Theme + Auth (same row) */}
				<div className='ml-auto flex items-center gap-2'>
					<ThemeToggle />

					{userId ? (
						<form
							action={async () => {
								"use server";
								await signOut();
							}}
						>
							<Button
								type='submit'
								variant='ghost'
								className='base-medium px-3 py-2'
							>
								<LogOut className='size-5 text-black dark:text-white' />
								<span className='ml-2 text-dark300_light900'>Logout</span>
							</Button>
						</form>
					) : (
						<>
							<Button
								asChild
								variant='ghost'
								className='small-medium px-3 py-2'
							>
								<Link href={ROUTES.SIGN_IN}>
									<Image
										src='/icons/account.svg'
										alt='account'
										width={30}
										height={30}
										className='invert-colors mr-2'
									/>
									<span className='primary-text-gradient text-[20px]'>
										Sign In
									</span>
								</Link>
							</Button>
							<Button
								asChild
								className='btn-tertiary light-border-2 px-3 py-2 text-[20px]'
							>
								<Link href={ROUTES.SIGN_UP}>Sign Up</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
