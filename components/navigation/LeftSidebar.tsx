import NavLinks from "@/components/navigation/navbar/NavLinks"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const LeftSidebar = () => {
	return (
		<section
			className="custom-scrollbar background-light900_dark200 light-border
        sticky top-0 left-0 h-screen flex flex-col justify-between overflow-y-auto border-r-light-400
        p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]
        "
		>
			<div className="flex flex-1 flex-col gap-6">
				<NavLinks />
			</div>
			<div className="flex flex-col gap-3">
				<Button
					className="small-medium btn-secondary min-h-[41px] rounded-lg
                                  px-4 py-3 shadow-none w-full
                                  "
					asChild
				>
					<Link href={ROUTES.SIGN_IN}>
						<Image
							src="/icons/account.svg"
							alt="account"
							width={20}
							height={20}
							className="invert-colors lg:hidden"
						/>
						<span className="primary-text-gradient max-lg:hidden">Sign In</span>
					</Link>
				</Button>

				<Button
					className="small-medium light-border-2 btn-tertiary 
										text-dark400_light900
                                    min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none
                                    
                                    "
					asChild
				>
					<Link href={ROUTES.SIGN_UP}>
						<span className="max-lg:hidden">Sign Up</span>
					</Link>
				</Button>
			</div>
		</section>
	)
}

export default LeftSidebar
