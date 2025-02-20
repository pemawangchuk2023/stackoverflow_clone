"use server"

import { auth } from "@/auth"
import { UnauthorizedError, ValidationError } from "@/lib/http-errors"
import dbConnect from "@/lib/mongoose"
import { Session } from "next-auth"
import { ZodError, ZodSchema } from "zod"

type ActionOptions<T> = {
	params?: T
	schema?: ZodSchema<T>
	authorize?: boolean
}

async function action<T>({
	params,
	schema,
	authorize = false,
}: ActionOptions<T>) {
	if (schema && params) {
		try {
			schema.parse(params)
		} catch (error) {
			if (error instanceof ZodError) {
				return new ValidationError(
					error.flatten().fieldErrors as Record<string, string[]>
				)
			} else {
				return new Error("Schema validation has failed")
			}
		}
	}
	let session: Session | null = null

	if (authorize) {
		session = await auth()

		if (!session) {
			return new UnauthorizedError()
		}
	}
	await dbConnect()
	return { params, session }
}

export default action
