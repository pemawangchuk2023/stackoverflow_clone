"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
	DefaultValues,
	Field,
	FieldValues,
	Path,
	useForm,
} from "react-hook-form"
import { z, ZodType } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import SignIn from "../../app/(auth)/sign-in/page"
import ROUTES from "@/constants/routes"

interface AuthFormProps<T extends FieldValues> {
	schema: ZodType<T>
	defaultValues: T
	onSubmit: (data: T) => Promise<{ success: boolean }>
	formType: "SIGN_IN" | "SIGN_UP"
}

const AuthForm = <T extends FieldValues>({
	formType,
	schema,
	defaultValues,
	onSubmit,
}: AuthFormProps<T>) => {
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<T>,
	})

	const handleSubmit = async () => {}
	const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up"

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="mt-10 space-y-6"
			>
				<div className="grid grid-cols-2 gap-4">
					{Object.keys(defaultValues).map((field) => (
						<FormField
							key={field}
							control={form.control}
							name={field as Path<T>}
							render={({ field }) => (
								<FormItem className="flex w-full flex-col gap-2">
									<FormLabel className="paragraph-medium text-dark400_light700">
										{field.name === "email"
											? "Email Address"
											: field.name.charAt(0).toUpperCase() +
												field.name.slice(1)}
									</FormLabel>
									<FormControl>
										<Input
											autoComplete="off"
											required
											type={field.name === "email" ? "email" : "text"}
											{...field}
											className="paragraph-regular background-light-900_dark300 
                                    light-border-2 text-dark300_light700 no-focus min-h-2 rounded-1.5 border
                                    "
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</div>

				<Button
					disabled={form.formState.isSubmitting}
					className="primary-gradient paragraph-medium min-h-12 w-full
                 rounded-2 px-4 py-3 font-inter !text-light-900"
				>
					{form.formState.isSubmitting
						? buttonText === "Sign In"
							? "Signing In..."
							: "Signing Up..."
						: buttonText}
				</Button>

				{formType === "SIGN_IN" ? (
					<p>
						Dont&apos;t Have An Account?{" "}
						<Link
							href={ROUTES.SIGN_UP}
							className="paragraph-semibold primary-text-gradient"
						>
							Sign UP
						</Link>
					</p>
				) : (
					<p>
						Already Have An Account?
						<Link
							href={ROUTES.SIGN_IN}
							className="paragraph-semibold primary-text-gradient"
						>
							<span className="ml-2">Sign In</span>
						</Link>
					</p>
				)}
			</form>
		</Form>
	)
}

export default AuthForm
