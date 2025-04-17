import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import React, { Suspense } from "react";
import { cn, getTimeStamp } from "../../lib/utils";
import Votes from "@/components/votes/Votes";
import { hasVoted } from "@/lib/actions/vote.action";
import Preview from "@/components/editor/Preview";


interface Props extends Answer {
	containerClasses?: string;
	showReadMore?: boolean;
}
const AnswerCard = ({
	_id,
	author,
	content,
	createdAt,
	upvotes,
	downvotes,
	question,
	containerClasses,
	showReadMore = false,
}: Props) => {
	const hasVotedPromise = hasVoted({
		targetId: _id,
		targetType: "answer",
	});
	return (
		<article className={cn("light-border border-b py-10", containerClasses)}>
			<span id={`answer-${_id}`} className='hash-span' />
			<div className='mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
				<div className='flex flex-1 gap-1 items-start sm:items-center'>
					<UserAvatar
						id={author._id}
						name={author.name}
						imageUrl={author.image}
						className='size-5 rounded-full object-cover max-sm:mt-0.5'
					/>
					<Link
						href={ROUTES.PROFILE(author._id)}
						className='flex flex-col sm:flex-row sm:items-center'
					>
						<p className='body-semibold text-dark300_light700 ml-2'>
							{author.name}
						</p>
						<p className='small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1'>
							<span className='max-sm:hidden'>
								&nbsp;&middot; answered {""}
								{getTimeStamp(createdAt)}
							</span>
						</p>
					</Link>
				</div>
				<div className='flex justify-end'>
					<Suspense fallback={<div>Loading...</div>}>
						<Votes
							upvotes={upvotes}
							downvotes={downvotes}
							targetType='answer'
							targetId={_id}
							hasVotedPromise={hasVotedPromise}
						/>
					</Suspense>
				</div>
			</div>
			<Preview content={content} />
			{showReadMore && (
				<Link
					href={`/questions/${question}#answer-${_id}`}
					className='body-semibold relative z-10 text-primary-500'
				>
					<p className='mt-5 text-[18px]'>Read More...</p>
				</Link>
			)}
		</article>
	);
};

export default AnswerCard;
