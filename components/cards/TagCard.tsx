import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"
import { cn, getDeviconClassName, getTechDescription } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {
	_id: string
	name: string
	questions?: number
	showCount?: boolean
	compact?: boolean
	remove?: boolean
	isButton?: boolean
	handleRemove?: () => void
}

const TagCard = ({
	_id,
	name,
	questions,
	showCount,
	compact,
	remove,
	isButton,
	handleRemove,
}: Props) => {
	const iconsClass = getDeviconClassName(name)
	const iconDescription = getTechDescription(name)

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()
	}
	const Content = () => {
		return (
			<>
				<Badge
					className="background-light800_dark300
            text-light400_light500 rounded-md border-none px-4 py-2 uppercase
            "
				>
					<div className="flex-center space-x-2">
						<i className={`${iconsClass} text-sm`}></i>
						<span className="ml-2">{name}</span>
					</div>
					{remove && (
						<Image
							src="/icons/close.svg"
							width={12}
							height={12}
							alt="close"
							className="cursor-pointer object-contain invert-0 dark:invert"
							onClick={handleRemove}
						/>
					)}
				</Badge>
				{showCount && (
					<span className="small-medium text-dark500_light700">
						{questions}
					</span>
				)}
			</>
		)
	}
	if (compact) {
		return isButton ? (
			<Button className="flex justify-between gap-2" onClick={handleClick}>
				<Content />
			</Button>
		) : (
			<Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
				<Content />
			</Link>
		)
	}
	return (
		<Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
			<article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
				<div className="flex items-center justify-between gap-3">
					<div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
						<p className="paragraph-semibold text-dark300_light900">{name}</p>
					</div>
					<i className={cn(iconsClass, "text-2xl")} aria-hidden="true">
						<p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
							{iconDescription}
						</p>
					</i>
				</div>
			</article>
		</Link>
	)
}

export default TagCard
