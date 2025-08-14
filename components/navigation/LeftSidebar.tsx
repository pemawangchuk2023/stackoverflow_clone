import { auth } from "@/auth";
import NavLinks from "@/components/navigation/navbar/NavLinks";
import React from "react";

const LeftSidebar = async () => {
	const session = await auth();
	const userId = session?.user?.id;
	return (
		<section
			className='custom-scrollbar background-light900_dark200 light-border
        sticky top-0 left-0 h-screen flex flex-col justify-between overflow-y-auto border-r-light-400
        p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]
        '
		>
			<div className='flex flex-1 flex-col gap-6'>
				<NavLinks userId={userId} />
			</div>
		</section>
	);
};

export default LeftSidebar;
