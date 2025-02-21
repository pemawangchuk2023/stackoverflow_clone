import mongoose from "mongoose"
import { NextResponse } from "next/server"
import slugify from "slugify"

import Account from "@/database/account.model"
import User from "@/database/user.model"
import handleError from "@/lib/handlers/error"
import { ValidationError } from "@/lib/http-errors"
import { SignInWithOAuthSchema } from "@/lib/validations"
import dbConnect from "@/lib/mongoose"

export async function POST(request: Request) {
	const { provider, providerAccountId, user } = await request.json()

	await dbConnect()

	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const validatedData = SignInWithOAuthSchema.safeParse({
			provider,
			providerAccountId,
			user,
		})

		if (!validatedData.success)
			throw new ValidationError(validatedData.error.flatten().fieldErrors)

		const { name, username, email, image } = user

		const slugifiedUsername = slugify(username, {
			lower: true,
			strict: true,
			trim: true,
		})

		let existingUser = await User.findOne({ email }).session(session)

		if (!existingUser) {
			existingUser = await User.create(
				[{ name, username: slugifiedUsername, email, image }],
				{ session }
			)
		} else {
			const updatedData: { name?: string; username?: string; image?: string } =
				{}
			if (name !== existingUser.name) updatedData.name = name
			if (existingUser.image !== image) updatedData.image = image

			if (Object.keys(updatedData).length > 0) {
				await User.updateOne(
					{ _id: existingUser._id },
					{ $set: updatedData },
					{ session }
				)
			}
		}
		const existingAccount = await Account.findOne({
			provider,
			providerAccountId,
		}).session(session)

		if (!existingAccount) {
			await Account.create(
				[
					{
						userId: existingUser._id,
						name,
						image,
						provider,
						providerAccountId,
					},
				],
				{ session }
			)
			console.log("Account created successfully")
		}
		await session.commitTransaction()
		return NextResponse.json(
			{ success: true, data: existingUser },
			{ status: 200 }
		)
	} catch (error: unknown) {
		await session.abortTransaction()
		return handleError(error, "api") as APIErrorResponse
	} finally {
		await session.endSession()
	}
}
