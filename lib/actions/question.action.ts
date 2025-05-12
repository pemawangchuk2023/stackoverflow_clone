"use server"
import { after } from "next/server"
import { Answer, Collection, Interaction, Vote } from "@/database"
import Question from "@/database/question.model"
import TagQuestion from "@/database/tag-question.model"
import Tag, { ITagDoc } from "@/database/tag.model"
import { createInteraction } from "@/lib/actions/interaction.action"
import action from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import dbConnect from "@/lib/mongoose"
import {
	AskQuestionSchema,
	DeleteQuestionSchema,
	EditQuestionSchema,
	GetQuestionSchema,
	IncrementViewSchema,
	PaginatedSearchParamsSchema,
} from "@/lib/validations"
import {
	CreateQuestionParams,
	DeleteQuestionParams,
	EditQuestionParams,
	GetQuestionParams,
	IncrementViewsParams,
	RecommendationParams,
} from "@/types/action"
import mongoose, { FilterQuery, Types } from "mongoose"
import { revalidatePath } from "next/cache"
import { cache } from "react"
import { auth } from "@/auth"

export async function createQuestion(
	params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: AskQuestionSchema,
		authorize: true,
	})
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse
	}

	const { title, content, tags } = validationResult.params!
	const userId = validationResult?.session?.user?.id

	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const [question] = await Question.create(
			[{ title, content, author: userId }],
			{ session }
		)
		if (!question) {
			throw new Error("Failed to create question")
		}
		const tagIds: mongoose.Types.ObjectId[] = []
		const tagQuestionDocument = []

		for (const tag of tags) {
			const existingTag = await Tag.findOneAndUpdate(
				{
					name: {
						$regex: new RegExp(`^${tag}`, "i"),
					},
				},
				{ $setOnInsert: { name: tag }, $inc: { questions: 1 } },
				{ upsert: true, new: true, session }
			)
			tagIds.push(existingTag._id)
			tagQuestionDocument.push({
				tag: existingTag._id,
				question: question._id,
			})
		}
		await TagQuestion.insertMany(tagQuestionDocument, { session })
		await Question.findByIdAndUpdate(
			question._id,
			{
				$push: { tags: { $each: tagIds } },
			},
			{ session }
		)
		// Log The Interaction
		after(async () => {
			await createInteraction({
				action: "post",
				actionId: question._id.toString(),
				actionTarget: "question",
				authorId: userId as string,
			})
		})
		await session.commitTransaction()
		return { success: true, data: JSON.parse(JSON.stringify(question)) }
	} catch (error) {
		await session.abortTransaction()
		return handleError(error) as ErrorResponse
	} finally {
		session.endSession()
	}
}

export async function editQuestion(
	params: EditQuestionParams
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: EditQuestionSchema,
		authorize: true,
	})
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse
	}

	const { title, content, tags, questionId } = validationResult.params!
	const userId = validationResult?.session?.user?.id

	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const question = await Question.findById(questionId).populate("tags")
		if (!question) {
			throw new Error("Question not found")
		}
		if (question.author.toString() !== userId) {
			throw new Error("Unauthorized")
		}
		if (question.title !== title || question.content !== content) {
			question.title = title
			question.content = content
			await question.save({ session })
		}

		const tagsToAdd = tags.filter(
			(tag) =>
				!question.tags.some((t: ITagDoc) =>
					t.name.toLowerCase().includes(tag.toLowerCase())
				)
		)
		const tagsToRemove = question.tags.filter(
			(tag: ITagDoc) =>
				!tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
		)

		const newTagDocuments = []
		if (tagsToAdd.length > 0) {
			for (const tag of tagsToAdd) {
				const existingTag = await Tag.findOneAndUpdate(
					{
						name: {
							$regex: `^${tag}$`,
							$options: "i",
						},
					},
					{ $setOnInsert: { name: tag }, $inc: { questions: 1 } },
					{ upsert: true, new: true, session }
				)

				if (existingTag) {
					newTagDocuments.push({
						tag: existingTag._id,
						question: questionId,
					})
					question.tags.push(existingTag._id)
				}
			}
		}
		if (tagsToRemove.length > 0) {
			const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id)

			await Tag.updateMany(
				{
					_id: { $in: tagIdsToRemove },
				},
				{ $inc: { questions: -1 } },
				{ session }
			)

			await TagQuestion.deleteMany(
				{
					tag: { $in: tagIdsToRemove },
					question: questionId,
				},
				{ session }
			)

			question.tags = question.tags.filter(
				(tagId: mongoose.Types.ObjectId) =>
					!tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
						id.equals(tagId._id)
					)
			)
		}

		if (newTagDocuments.length > 0) {
			await TagQuestion.insertMany(newTagDocuments, { session })
		}
		await question.save({ session })
		await session.commitTransaction()
		return { success: true, data: JSON.parse(JSON.stringify(question)) }
	} catch (error) {
		return handleError(error) as ErrorResponse
	} finally {
		session.endSession()
	}
}

export const getQuestion = cache(
	async (params: GetQuestionParams): Promise<ActionResponse<Question>> => {
		const validationResult = await action({
			params,
			schema: GetQuestionSchema,
			authorize: true,
		})
		if (validationResult instanceof Error) {
			return handleError(validationResult) as ErrorResponse
		}

		const { questionId } = validationResult.params!

		try {
			const question = await Question.findById(questionId)
				.populate("tags")
				.populate("author", "name image")
			if (!question) {
				throw new Error("Question not found")
			}
			return { success: true, data: JSON.parse(JSON.stringify(question)) }
		} catch (error) {
			return handleError(error) as ErrorResponse
		}
	}
)

export async function getQuestions(
	params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
	const validationResult = await action({
		params,
		schema: PaginatedSearchParamsSchema,
	})

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse
	}

	const { page = 1, pageSize = 10, query, filter } = params
	const skip = (Number(page) - 1) * pageSize
	const limit = Number(pageSize)

	const filterQuery: FilterQuery<typeof Question> = {}
	let sortCriteria = {}

	try {
		if (filter === "recommended") {
			const session = await auth()
			const userId = session?.user?.id
			if (!userId) {
				return { success: true, data: { questions: [], isNext: false } }
			}

			const recommended = await getRecommendationQuestions({
				userId,
				query,
				skip,
				limit,
			})
			return { success: true, data: recommended }
		}

		if (query) {
			filterQuery.$or = [
				{ title: { $regex: new RegExp(query, "i") } },
				{ content: { $regex: new RegExp(query, "i") } },
			]
		}

		switch (filter) {
			case "newest":
				sortCriteria = { createdAt: -1 }
				break
			case "unanswered":
				filterQuery.answers = 0
				sortCriteria = { createdAt: -1 }
				break
			case "popular":
				sortCriteria = { upvotes: -1 }
				break
			default:
				sortCriteria = { createdAt: -1 }
				break
		}

		const totalQuestions = await Question.countDocuments(filterQuery)

		const questions = await Question.find(filterQuery)
			.populate("tags", "name")
			.populate("author", "name image")
			.lean()
			.sort(sortCriteria)
			.skip(skip)
			.limit(limit)

		const isNext = totalQuestions > skip + questions.length

		return {
			success: true,
			data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
		}
	} catch (error) {
		return handleError(error) as ErrorResponse
	}
}

export async function incrementViews(
	params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
	const validationResult = await action({
		params,
		schema: IncrementViewSchema,
	})

	if (validationResult instanceof Error) {
		throw handleError(validationResult) as ErrorResponse
	}

	const { questionId } = validationResult.params!

	try {
		const question = await Question.findById(questionId)

		if (!question) {
			throw new Error("Question not found")
		}
		question.views += 1
		await question.save()

		return {
			success: true,
			data: { views: question.views },
		}
	} catch (error) {
		throw handleError(error) as ErrorResponse
	}
}

export async function getHotQuestions(): Promise<
	ActionResponse<{ questions: Question[] }>
> {
	try {
		await dbConnect()
		const hotQuestions = await Question.find({})
			.sort({ views: -1, upvotes: -1 })
			.limit(5)

		return {
			success: true,
			data: { questions: JSON.parse(JSON.stringify(hotQuestions)) },
		}
	} catch (error) {
		return handleError(error) as ErrorResponse
	}
}
// Write a function that deletes questions and its answer, its votes and collections

export async function deleteQuestion(
	params: DeleteQuestionParams
): Promise<ActionResponse> {
	const validationResult = await action({
		params,
		schema: DeleteQuestionSchema,
		authorize: true,
	})
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse
	}
	// Destructure the questionID and user
	const { questionId } = validationResult.params!
	const { user } = validationResult.session!
	// Create a Mongoose Session
	const session = await mongoose.startSession()

	try {
		session.startTransaction()

		const question = await Question.findById(questionId).session(session)
		if (!question) throw new Error("The question was not found")

		if (question.author.toString() !== user?.id)
			throw new Error(
				"You are not the author of the question, and hence not authorized to delete"
			)
		// 1. Delete the references of collections
		await Collection.deleteMany({ question: questionId }).session(session)

		// 2. Delete the references from TagQuestion collection
		await TagQuestion.deleteMany({ question: questionId }).session(session)

		// 3. Delete tags of question
		if (question.tags.length > 0) {
			await Tag.updateMany(
				{ _id: { $in: question.tags } },
				{ $inc: { questions: -1 } },
				{ session }
			)
		}
		// 4. Remove the votes part of the question
		await Vote.deleteMany({
			actionId: questionId,
			actionType: "question",
		}).session(session)

		// 5. Remove all answers and its associates
		const answers = await Answer.find({ question: questionId }).session(session)

		if (answers.length > 0) {
			await Answer.deleteMany({ question: questionId }).session(session)

			await Vote.deleteMany({
				actionId: { $in: answers.map((answer) => answer.id) },
				actionType: "answer",
			}).session(session)
		}
		// Now Delete the question
		await Question.findByIdAndDelete(questionId).session(session)

		// Commit the transaction
		await session.commitTransaction()
		session.endSession()

		// Apply revalidate path to see instant changes at UI or frontend when question is deleted
		revalidatePath(`/profile/${user?.id}`)
		return { success: true }
	} catch (error) {
		await session.abortTransaction()
		session.endSession()

		return handleError(error) as ErrorResponse
	}
}
export async function getRecommendationQuestions({
	userId,
	query,
	skip,
	limit,
}: RecommendationParams) {
	// 1. Get the user's recent interaction

	const interactions = await Interaction.find({
		user: new Types.ObjectId(userId),
		actionType: "question",
		actions: { $in: ["view", "upvote", "bookmark", "post"] },
	})
		.sort({ createdAt: -1 })
		.limit(50)
		.lean()

	const interactedQuestionIds = interactions.map((i) => i.actionId)

	// Get the tags from interacted questions

	const interactedQuestions = await Question.find({
		_id: { $in: interactedQuestionIds },
	}).select("tags")

	// Get the unique tags

	const allTags = interactedQuestions.flatMap((q) =>
		q.tags.map((tag: Types.ObjectId) => tag.toString())
	)
	// Remove the duplicates
	const uniqueTagIds = [...new Set(allTags)]

	const recommendedQuery: FilterQuery<typeof Question> = {
		// Exclude the interacted questions
		_id: { $nin: interactedQuestionIds },
		// Exclude the user's own question
		author: { $ne: new Types.ObjectId(userId) },
		// Include the questions with other unique tags
		tags: { $in: uniqueTagIds.map((id: string) => new Types.ObjectId(id)) },
	}

	if (query) {
		recommendedQuery.$or = [
			{ title: { $regex: query, $options: "i" } },
			{ content: { $regex: query, $options: "i" } },
		]
	}

	const total = await Question.countDocuments(recommendedQuery)

	const questions = await Question.find(recommendedQuery)
		.populate("tags", "name")
		.populate("author", "name image")
		.sort({ upvoted: -1, views: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
	return {
		questions: JSON.parse(JSON.stringify(questions)),
		isNext: total > skip + questions.length,
	}
}
