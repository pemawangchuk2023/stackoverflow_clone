import { NextResponse } from "next/server"

import User from "@/database/user.model"
import handleError from "@/lib/handlers/error"
import { NotFoundError } from "@/lib/http-errors"
import { UserSchema } from "@/lib/validations"
import dbConnect from "@/lib/mongoose"

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	if (!id) throw new NotFoundError("User not found")
	try {
		await dbConnect()
		const user = await User.findById(id)
		if (!user) throw new NotFoundError("User not found")
		return NextResponse.json({ success: true, data: user }, { status: 200 })
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse
	}
}

export async function DELETE(
	_: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	if (!id) throw new NotFoundError("User not found")
	try {
		await dbConnect()
		const user = await User.findByIdAndDelete(id)
		if (!user) throw new NotFoundError("User not found")
		return NextResponse.json({ success: true, data: user }, { status: 200 })
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	if (!id) throw new NotFoundError("User not found")
	try {
		await dbConnect()
		const body = await req.json()
		const validatedData = UserSchema.partial().safeParse(body)
		const updatedUser = await User.findByIdAndUpdate(id, validatedData.data, {
			new: true,
		})
		if (!updatedUser) throw new NotFoundError("User not found")
		return NextResponse.json(
			{ success: true, data: updatedUser },
			{ status: 200 }
		)
	} catch (error) {
		return handleError(error, "api") as APIErrorResponse
	}
}
