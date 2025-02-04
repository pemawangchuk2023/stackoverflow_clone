import TagCard from "@/components/cards/TagCard"
import ROUTES from "@/constants/routes"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const RightSidebar = () => {
	const hotQuestions = [
		{
			_id: "1",
			title: "What is generic in TypeScript?",
		},
		{
			_id: "2",
			title: "How to use interfaces in TypeScript?",
		},
		{
			_id: "3",
			title: "What are TypeScript decorators?",
		},
		{
			_id: "4",
			title: "How to declare optional properties in TypeScript?",
		},
		{
			_id: "5",
			title:
				"What is the difference between `any` and `unknown` in TypeScript?",
		},
		{
			_id: "6",
			title: "How to use enums in TypeScript?",
		},
	]
	const popularTags = [
		{ _id: "1", name: "NextJS", questions: 50 },
		{ _id: "2", name: "React", questions: 120 },
		{ _id: "3", name: "TypeScript", questions: 85 },
		{ _id: "4", name: "NodeJS", questions: 75 },
		{ _id: "5", name: "JavaScript", questions: 200 },
		{ _id: "6", name: "TailwindCSS", questions: 60 },
	]
	return (
		<section
			className="pt-36 custom-scrollbar background-light900_dark200
        light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6
        overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden
        "
		>
			<div>
				<h3 className="h3-bold text-dark200_light900">Hot Questions</h3>
				<div className="mt-7 flex w-full flex-col gap-[30px]">
					{hotQuestions.map(({ _id, title }) => (
						<Link
							key={_id}
							href={ROUTES.PROFILE(_id)}
							className="flex cursor-pointer items-center justify-between gap-7"
						>
							<p className="body-medium text-dark500_light700">{title}</p>
							<Image
								src="/icons/chevron-right.svg"
								alt="chevron"
								width={20}
								height={20}
								className="invert-colors"
							/>
						</Link>
					))}
				</div>
			</div>
			<div className="mt-16">
				<h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
				<div className="mt-7 flex flex-col gap-4">
					{popularTags.map(({ _id, name, questions }) => (
						<TagCard
							key={_id}
							_id={_id}
							name={name}
							questions={questions}
							showCount
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default RightSidebar
