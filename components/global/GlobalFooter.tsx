"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import AIFeaturesShowcase from "@/components/global/AiFeatureShowcase";

const GlobalFooter = () => {
	const pathname = usePathname();
	const { data: session } = useSession();

	const isHome = pathname === "/";
	const isAuthed = !!session?.user;

	if (!isHome || isAuthed) return null;

	return (
		<footer className='mt-20 border-t background-light900_dark200'>
			<AIFeaturesShowcase />
			<div className='mx-auto max-w-4xl px-6 py-16'>
				<div className='mb-10 grid w-full grid-cols-[auto,1fr,auto] items-center gap-4'>
					<Link href='/'>
						<Image
							src='/images/logo2.png'
							alt='site-logo'
							width={150}
							height={150}
							className='rounded-xl'
							priority
						/>
					</Link>
					<p className='text-2xl text-dark100_light900 text-center capitalize'>
						Discover insights, explore solutions, and join our community when
						you're ready.
					</p>
					<Link href='/'>
						<p className='text-xl font-extrabold text-right primary-text-gradient'>
							SolutionHub
						</p>
					</Link>
				</div>

				<div className='flex flex-col items-center text-center space-y-8'>
					{/* Copyright */}
					<div className='pt-8 border-t background-light900_dark200 w-full max-w-md'>
						<p className='text-xl text-foreground font-extrabold capitalize'>
							© {new Date().getFullYear()}{" "}
							<span className='primary-text-gradient'>Pema Wangchuk</span>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default GlobalFooter;
