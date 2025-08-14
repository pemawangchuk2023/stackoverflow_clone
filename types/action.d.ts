import { ClientSession } from "mongoose";
interface SignInWithOAuthParams {
	provider: "google" | "github";
	providerAccountId: string;
	user: {
		email: string;
		name: string;
		image: string;
		username: string;
	};
}

interface AuthCredentials {
	name: string;
	username: string;
	password: string;
	email: string;
}

interface CreateQuestionParams {
	title: string;
	content: string;
	tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
	questionId: string;
}

interface GetQuestionParams {
	questionId: string;
}

interface GetTagQuestionParams extends Omit<PaginatedSearchParams, "filter"> {
	tagId: string;
}

interface IncrementViewsParams {
	questionId: string;
}
interface CreateAnswerParams {
	questionId: string;
	content: string;
}
interface GetAnswerParams extends PaginatedSearchParams {
	questionId: string;
}

interface CreateVoteParams {
	targetId: string;
	targetType: "question" | "answer";
	voteType: "upvote" | "downvote";
}
interface UpdateVoteCountParams extends CreateVoteParams {
	change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
	hasUpvoted: boolean;
	hasDownvoted: boolean;
}

interface CollectionBaseParams {
	questionId: string;
}

interface GetUserParams {
	userId: string;
}

interface GetUserQuestionsParams
	extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
	userId: string;
}

interface GetUserAnswersParams extends PaginatedSearchParams {
	userId: string;
}

interface GetUserTagsParams {
	userId: string;
}

interface DeleteQuestionParams {
	questionId: string;
}

interface DeleteAnswerParams {
	answerId: string;
}

interface UpdateReputationParams {
	interaction: IInteractionDoc;
	session: mongoose.ClientSession;
	performerId: string;
	authorId: string;
}

interface CreateInteractionParams {
	action:
		| "view"
		| "upvote"
		| "downvote"
		| "bookmark"
		| "post"
		| "edit"
		| "delete"
		| "search";
	actionId: string;
	authorId: string;
	actionTarget: "question" | "answer";
}

interface RecommendationParams {
	userId: string;
	query?: string;
	skip: number;
	limit: number;
}

interface GlobalSearchParams {
	query: string;
	type: string | null;
}
interface UpdateUserParams {
	name?: string;
	username?: string;
	email?: string;
	image?: string;
	password?: string;
}

export interface CreateChatMessageParams {
	conversationId: string;
	content: string;
	role?: "user" | "assistant" | "system";
	userId: string;
}

export interface GetChatMessagesParams {
	conversationId: string;
	page?: number;
	pageSize?: number;
	filter?: "latest" | "oldest";
}
