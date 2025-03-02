"use client";
import { Button } from "@/components/ui/button";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const filters = [
	{ name: "Newest", value: "newest" },
	{ name: "Popular", value: "popular" },
	{ name: "Unanswered", value: "unanswered" },
	{ name: "Recommended", value: "recommended" },
];
const HomeFilter = () => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const filterParams = searchParams.get("filter");
	const [active, setActive] = useState(filterParams || "");

	const handleTypeClick = (filter: string) => {
		let newUrl = "";
		if (filter === active) {
			setActive("");
			newUrl = removeKeysFromQuery({
				params: searchParams.toString(),
				keysToRemove: ["filter"],
			});
		} else {
			setActive(filter);
			newUrl = formUrlQuery({
				params: searchParams.toString(),
				key: "filter",
				value: filter.toLocaleLowerCase(),
			});
		}
		router.push(`${pathname}?${newUrl}`);
	};
	return (
		<div className='mt-10 hidden flex-wrap gap-3 md:flex'>
			{filters.map((filter) => (
				<Button
					key={filter.name}
					className={cn(
						`body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
						active === filter.value
							? "bg-primary text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
							: "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
					)}
					onClick={() => handleTypeClick(filter.value)}
				>
					{filter.name}
				</Button>
			))}
		</div>
	);
};

export default HomeFilter;
