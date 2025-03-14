"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

interface Filter {
	name: string;
	value: string;
}

interface Props {
	filters: Filter[];
	otherClasses?: string;
	containerClasses?: string;
}

const CommonFilter = ({
	filters,
	otherClasses = "",
	containerClasses = "",
}: Props) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const paramsFilter = searchParams.get("filter");

	const handleUpdateParams = (value: string) => {
		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: "filter",
			value,
		});

		router.push(newUrl, { scroll: false });
	};

	return (
		<div className={cn("relative", containerClasses)}>
			<Select
				onValueChange={handleUpdateParams}
				defaultValue={paramsFilter || undefined}
			>
				<SelectTrigger
					className={`${otherClasses} body-regular light-border
                    background-light800_dark300 text-dark500_light700 border px-5 py-2.5
                    `}
					aria-label='Filter options'
				>
					<div className='line-clamp-1 flex-1 text-left'>
						<SelectValue placeholder='Select a filter' />
					</div>
				</SelectTrigger>
				<SelectContent className='text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300'>
					<SelectGroup>
						{filters.map((item) => (
							<SelectItem
								key={item.value}
								value={item.value}
								className='focus:bg-light-800 dark:focus:bg-dark-400'
							>
								{item.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
};

export default CommonFilter;
