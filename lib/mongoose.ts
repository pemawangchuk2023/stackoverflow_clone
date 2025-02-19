import mongoose, { Mongoose } from "mongoose"

import "@/database"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined")
}

interface MongooseCache {
	conn: Mongoose | null
	promise: Promise<Mongoose> | null
}

declare global {
	// eslint-disable-next-line no-var
	var mongoose: MongooseCache
}

let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

const dbConnect = async (): Promise<Mongoose> => {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				dbName: "StackOverflow Clone",
			})
			.then((result) => {
				return result
			})
			.catch((error) => {
				throw error
			})
	}

	cached.conn = await cached.promise

	return cached.conn
}

export default dbConnect
