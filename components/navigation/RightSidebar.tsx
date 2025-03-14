import TagCard from "@/components/cards/TagCard";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getHotQuestions } from "@/lib/actions/question.action";
import { QuestionIcon } from "@/components/QuestionIcon";
import { getHotTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
	const hotQuestions = await getHotQuestions();
	const { data, success } = hotQuestions;

	if (!success || !data?.questions) {
		throw new Error("No hot questions found");
	}
	const { questions } = data;

	const popularTags = await getHotTags();
	const { data: popularTagsData, success: popularTagsSuccess } = popularTags;

	if (!popularTagsSuccess || !popularTagsData?.tags) {
		throw new Error("No popular tags found");
	}
	const { tags } = popularTagsData;

	return (
		<section
			className='pt-36 custom-scrollbar background-light900_dark200
        light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6
        overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden'
		>
			<div>
				<h3 className='h3-bold text-dark200_light900 text-center items-center'>
					Hot Questions
				</h3>
				<div className='mt-7 flex w-full flex-col gap-[30px]'>
					{questions.length > 0 ? (
						questions.map(({ _id, title }) => (
							<Link
								key={_id}
								href={`${ROUTES.QUESTION(_id)}`}
								className='flex cursor-pointer items-center justify-between gap-7'
							>
								<QuestionIcon id={_id} />
								<p className='body-medium text-dark500_light700'>{title}</p>
								<Image
									src='/icons/chevron-right.svg'
									alt='chevron'
									width={20}
									height={20}
									className='invert-colors'
								/>
							</Link>
						))
					) : (
						<p className='body-medium text-dark500_light700'>
							No hot questions available
						</p>
					)}
				</div>
			</div>
			<div className='mt-16'>
				<h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>

				<div className='mt-7 flex flex-col gap-4'>
					{tags.map(({ _id, name, questions }) => (
						<TagCard
							key={_id as string}
							_id={_id as string}
							name={name}
							questions={questions}
							showCount
							compact
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default RightSidebar;
