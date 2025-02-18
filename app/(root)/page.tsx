import QuestionCard from "@/components/cards/QuestionCard"
import HomeFilter from "@/components/filters/HomeFilter"
import LocalSearch from "@/components/search/LocalSearch"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import Link from "next/link"
import React from "react"

const questions = [
	{
		_id: "1",
		title: "What is SSR in NextJS?",
		description: "Anybody wanted to help me?",
		tags: [
			{ _id: "1", name: "NextJS" },
			{ _id: "2", name: "TypeScript" },
		],
		author: {
			_id: "1",
			name: "Pema",
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&s",
		},
		upvotes: 10,
		answers: 5,
		views: 100,
		createdAt: new Date(),
	},
	{
		_id: "2",
		title: "How to implement authentication in Next.js?",
		description: "What is the best approach for adding authentication?",
		tags: [
			{ _id: "3", name: "NextJS" },
			{ _id: "4", name: "Authentication" },
		],
		author: {
			_id: "2",
			name: "Tenzin",
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&s",
		},
		upvotes: 15,
		answers: 8,
		views: 120,
		createdAt: new Date(),
	},
]
interface SearchParams {
	searchParams: Promise<{ [key: string]: string }>
}

const HomePage = async ({ searchParams }: SearchParams) => {
	const { query = "", filter = "" } = await searchParams
	const filteredQuestions = questions.filter((question) =>
		question.title.toLowerCase().includes(query?.toLowerCase())
	)
	return (
		<>
			<section
				className="w-full flex flex-col-reverse sm:flex-row justify-between
		gap-4 sm:items-center
		"
			>
				<h1 className="h1-bold text-dark100_light900">All Questions</h1>
				<Button
					className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
					asChild
				>
					<Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
				</Button>
			</section>
			<section className="mt-11">
				<LocalSearch
					route="/"
					imgSrc="/icons/search.svg"
					placeholder="Search questions..."
					otherClasses="flex-1"
				/>
			</section>
			<HomeFilter />
			<div className="mt-10 flex w-full flex-col gap-6">
				{filteredQuestions.map((question) => (
					<QuestionCard key={question._id} question={question} />
				))}
			</div>
		</>
	)
}

export default HomePage
