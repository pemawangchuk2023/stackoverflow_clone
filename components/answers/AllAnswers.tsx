import DataRenderer from "@/components/DataRenderer";
import React from "react";
import { EMPTY_ANSWERS } from "../../constants/states";
import AnswerCard from "@/components/cards/AnswerCard";
import CommonFilter from "@/components/filters/CommonFilter";
import { AnswerFilters } from "@/constants/filters";
import Pagination from "@/components/Pagination";
interface Props extends ActionResponse<Answer[]> {
	totalAnswers: number;
	page: number;
	isNext: boolean;
}
const AllAnswers = ({
	data,
	success,
	error,
	totalAnswers,
	page,
	isNext,
}: Props) => {
	return (
		<div className='mt-11'>
			<div className='flex items-center justify-between'>
				<h3 className='primary-text-gradient'>
					{totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
				</h3>
				<CommonFilter
					filters={AnswerFilters}
					otherClasses='sm:min-w-32'
					containerClasses='max-xs:w-full'
				/>
			</div>
			<DataRenderer
				data={data}
				error={error}
				success={success}
				empty={EMPTY_ANSWERS}
				render={(answers) =>
					answers.map((answer) => (
						<div key={answer._id}>
							<AnswerCard key={answer._id} {...answer} />
						</div>
					))
				}
			/>
			<div className='mt-5'>
				<Pagination page={page} isNext={isNext} />
			</div>
		</div>
	);
};

export default AllAnswers;
