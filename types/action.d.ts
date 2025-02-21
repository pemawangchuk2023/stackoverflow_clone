interface SignInWithOAuthParams {
	provider: "google" | "github"
	providerAccountId: string
	user: {
		email: string
		name: string
		image: string
		username: string
	}
}

interface AuthCredentials {
	name: string
	username: string
	password: string
	email: string
}

interface CreateQuestionParams {
	title: string
	content: string
	tags: string[]
}

interface EditQuestionParams extends CreateQuestionParams {
	questionId: string
}

interface GetQuestionParams {
	questionId: string
}

interface GetTagQuestionParams extends Omit<PaginatedSearchParams, "filter"> {
	tagId: string
}
