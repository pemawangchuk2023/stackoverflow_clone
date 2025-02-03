import SocialAuthForm from "@/components/forms/SocialAuthForm"
import Image from "next/image"

const AuthLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<main
			className="flex min-h-screen items-center justify-center bg-auth-light dark:bg-auth-dark
		bg-no-repeat px-4 py-10
		"
		>
			<section
				className="light-border background-light800_dark200
			 shadow-light100_dark100 min-w-full rounded-[10px] px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8"
			>
				<div className="flex items-center justify-between gap-2">
					<div className="space-y-2.5">
						<h1 className="h2-bold text-dark100_light900">
							{" "}
							Join StackOverFlow Clone
						</h1>
						<p className="paragraph-regular text-dark500_light400">
							To get your questions answered by the community
						</p>
					</div>
					<Image
						src="/images/site-logo.svg"
						alt="site logo"
						width={50}
						height={50}
						className="object-contain"
					/>
				</div>
				{children}
				<div>
					<SocialAuthForm />
				</div>
			</section>
		</main>
	)
}

export default AuthLayout
