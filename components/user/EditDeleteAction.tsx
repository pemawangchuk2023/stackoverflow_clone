"use client"
import React from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { deleteQuestion } from "@/lib/actions/question.action"
import { deleteAnswer } from "@/lib/actions/answer.action"

interface Props {
	type: string
	itemId: string
}
const EditDeleteAction = ({ type, itemId }: Props) => {
	const router = useRouter()
	const { toast } = useToast()
	const handleEdit = async () => {
		router.push(`/questions/${itemId}/edit`)
	}
	const handleDelete = async () => {
		// Implement the server action to delete the question and its inner content
		if (type === "Question") {
			await deleteQuestion({ questionId: itemId })
			toast({
				title: "Question Deleted",
				description: "Your question has been deleted successfully",
				variant: "destructive",
			})
		} else if (type === "answer") {
			await deleteAnswer({ answerId: itemId })
			toast({
				title: "Answer Deleted",
				description: "Your answer has been deleted successfully",
				variant: "destructive",
			})
		}
	}
	return (
		<div
			className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}
		>
			{type === "Question" && (
				<Image
					src="/icons/edit.svg"
					alt="edit"
					width={14}
					height={14}
					className="cursor-pointer object-contain"
					onClick={handleEdit}
				/>
			)}
			<AlertDialog>
				<AlertDialogTrigger className="cursor-pointer">
					<Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
				</AlertDialogTrigger>
				<AlertDialogContent className="background-light800_dark300">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							<span className="ml-1">
								{type === "Question" ? "question" : "answer"}
							</span>{" "}
							and remove it from the servers
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="!border-primary-100 bg-primary-500 text-light-700"
							onClick={handleDelete}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

export default EditDeleteAction
