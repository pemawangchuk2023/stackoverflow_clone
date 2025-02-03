import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import React from "react"

const HomePage = async () => {
	const session = await auth()
	console.log(session)
	return (
		<>
			<form
				className="px-10 pt-[100px]"
				action={async () => {
					"use server"

					await signOut({
						redirectTo: ROUTES.SIGN_IN,
					})
				}}
			>
				<Button type="submit">Log Out</Button>
			</form>
		</>
	)
}

export default HomePage
