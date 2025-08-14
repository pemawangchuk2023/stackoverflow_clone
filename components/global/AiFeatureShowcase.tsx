"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const AIFeaturesShowcase = () => {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoaded(true), 300);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className='relative overflow-hidden'>
			<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
				{/* Header Section */}
				<div
					className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
				>
					<Badge
						variant='secondary'
						className='mb-4 px-6 py-4 text-xl background-light-700_dark300 
                                    light-border-2 text-dark300_light700'
					>
						<Sparkles className='w-4 h-4 mr-2' />
						AI-Powered Platform
					</Badge>

					<h1 className='text-5xl md:text-6xl font-bold primary-text-gradient mb-6 leading-tight'>
						Supercharge Your Workflow with SolutionHub
					</h1>

					<p className='text-2xl text-foreground max-w-3xl mx-auto capitalize'>
						Turbo-charge your day with our platform — where routine becomes
						remarkable. Believe in us.
					</p>
				</div>

				{/* CTA Section */}
				<div
					className={`text-center transition-all duration-1000 delay-1000 ${
						isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
					}`}
				>
					<Link href='/sign-up'>
						<Button size='lg' className='py-6 bg-purple-700 text- text-xl'>
							Discover How AI Can Transform Your Work
							<ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
						</Button>
					</Link>

					<p className='mt-4 text-[20px] text-primary-500 font-bold'>
						Start your free trial • No credit card required
					</p>
				</div>
			</div>
		</div>
	);
};

export default AIFeaturesShowcase;
