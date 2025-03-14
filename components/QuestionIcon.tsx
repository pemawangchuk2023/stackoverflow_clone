import { FileQuestionIcon as QuestionMarkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
const COLORS = [
	"bg-blue-500",
	"bg-green-500",
	"bg-purple-500",
	"bg-amber-500",
	"bg-rose-500",
	"bg-cyan-500",
	"bg-indigo-500",
	"bg-emerald-500",
	"bg-fuchsia-500",
	"bg-orange-500",
];

interface QuestionIconProps {
	id: string;
	className?: string;
}

export function QuestionIcon({ id, className }: QuestionIconProps) {
	const colorIndex =
		Math.abs(id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
		COLORS.length;

	const bgColor = COLORS[colorIndex];

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md w-8 h-8 shrink-0",
				bgColor,
				className
			)}
		>
			<QuestionMarkIcon className='h-5 w-5 text-white' />
		</div>
	);
}
