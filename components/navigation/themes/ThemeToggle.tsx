"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className='w-10 h-10 bg-gray-200 rounded-full p-1 flex items-center justify-center transition-colors duration-200 ease-in-out dark:bg-gray-700'
		>
			<div className='relative w-8 h-8'>
				<Sun className='h-6 w-6 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-in-out dark:opacity-0' />
				<Moon className='h-6 w-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-in-out opacity-0 dark:opacity-100' />
			</div>
		</Button>
	);
};

export default ThemeToggle;
