import { Badge } from "@/components/ui/badge"
import ROUTES from "@/constants/routes"
import { getDeviconClassName } from "@/lib/utils"
import Link from "next/link"
import React from "react"

interface Props {
	_id: string
	name: string
	questions: number
	showCount?: boolean
	compact?: boolean
}
const TagCard = ({ _id, name, questions, showCount, compact }: Props) => {
	const iconsClass = getDeviconClassName(name)
	return (
		<Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
			<Badge
				className="background-light800_dark300
            text-light400_light500 rounded-md border-none px-4 py-2 uppercase
            "
			>
				<i className={`${iconsClass} text-sm`}></i>
				<span className="ml-2">{name}</span>
			</Badge>
			{showCount && (
				<span className="small-medium text-dark500_light700">{questions}</span>
			)}
		</Link>
	)
}

export default TagCard
