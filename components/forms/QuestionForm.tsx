"use client";
import React, { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AskQuestionSchema } from "@/lib/validations";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { z } from "zod";
import TagCard from "@/components/cards/TagCard";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

const Editor = dynamic(() => import("@/components/editor"), {
	ssr: false,
});
interface Params {
	question?: Question;
	isEdit?: boolean;
}
const QuestionForm = ({ question, isEdit = false }: Params) => {
	const { toast } = useToast();
	const router = useRouter();
	const editorRef = useRef<MDXEditorMethods>(null);
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof AskQuestionSchema>>({
		resolver: zodResolver(AskQuestionSchema),
		defaultValues: {
			title: question?.title || "",
			content: question?.content || "",
			tags: question?.tags.map((tag) => tag.name) || [],
		},
	});

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		field: { value: string[] }
	) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const tagInput = e.currentTarget.value.trim();
			if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
				form.setValue("tags", [...field.value, tagInput]);
				e.currentTarget.value = "";
				form.clearErrors("tags");
			} else if (tagInput.length > 15) {
				form.setError("tags", {
					type: "manual",
					message: "Tag should be less than 15 characters",
				});
			} else if (field.value.includes(tagInput)) {
				form.setError("tags", {
					type: "manual",
					message: "Tag already exists",
				});
			}
		}
	};

	const handleTagRemove = (tag: string, field: { value: string[] }) => {
		const newTags = field.value.filter((t) => t !== tag);
		form.setValue("tags", newTags);
		if (newTags.length === 0) {
			form.setError("tags", {
				type: "manual",
				message: "Tags are required",
			});
		}
	};

	const handleCreateQuestion = async (
		data: z.infer<typeof AskQuestionSchema>
	) => {
		startTransition(async () => {
			if (isEdit && question) {
				const result = await editQuestion({
					questionId: question?._id,
					...data,
				});
				if (result.success) {
					toast({
						title: "Success",
						description: "Question has been updated successfully",
					});
					if (result.data) {
						router.push(ROUTES.QUESTION(result.data._id));
					}
				} else {
					toast({
						title: `Error ${result.status}`,
						description:
							result.error?.message ||
							"Something went wrong when editing question",
						variant: "destructive",
					});
				}
				return;
			}

			const result = await createQuestion(data);
			if (result.success) {
				toast({
					title: "Success",
					description: "Question created successfully",
				});
				if (result.data) {
					router.push(ROUTES.QUESTION(result.data._id));
				}
			} else {
				toast({
					title: `Error ${result.status}`,
					description: result.error?.message || "Something went wrong",
					variant: "destructive",
				});
			}
		});
	};
	return (
		<Form {...form}>
			<form
				className='flex w-full flex-col gap-10'
				onSubmit={form.handleSubmit(handleCreateQuestion)}
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col'>
							<FormLabel className='paragraph-medium text-dark400_light700'>
								Question Title
								<span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl>
								<Input
									className='paragraph-regular background-light-700_dark300 
                                    light-border-2 text-dark300_light700 no-focus min-h-[56px] border
                                    '
									{...field}
								/>
							</FormControl>
							<FormDescription className='body-regular mt-2.5 text-light-500'>
								Explain your problem clearly and include all relevant details.
								Help others understand your question, even if they have never
								encountered your issue before.
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='content'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col'>
							<FormLabel className='paragraph-medium text-dark400_light700'>
								Detail Explanation of your problem
								<span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl>
								<Editor
									editorRef={editorRef}
									value={field.value}
									fieldChange={field.onChange}
								/>
							</FormControl>
							<FormDescription className='body-regular mt-2.5 text-light-500'>
								Introduce the problem and what you have stated above
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem className='flex w-full flex-col gap-3'>
							<FormLabel className='paragraph-medium text-dark400_light700'>
								Tags
								<span className='text-primary-500'>*</span>
							</FormLabel>
							<FormControl>
								<div>
									<Input
										className='paragraph-regular background-light-700_dark300 
                                    light-border-2 text-dark300_light700 no-focus min-h-[56px] border
                                    '
										placeholder='Add Tags'
										onKeyDown={(e) => handleInputKeyDown(e, field)}
									/>
									{field.value.length > 0 && (
										<div className='flex-start mt-2.5 flex-wrap gap-2.5'>
											{field.value.map((tag: string) => (
												<TagCard
													key={tag}
													_id={tag}
													name={tag}
													compact
													remove
													isButton
													handleRemove={() => handleTagRemove(tag, field)}
												/>
											))}
										</div>
									)}
								</div>
							</FormControl>
							<FormDescription className='body-regular mt-2.5 text-light-500'>
								Add upto 3 tags about what your question is for.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='mt-16 flex justify-end'>
					<Button
						className='primary-gradient !text-light-900 w-fit'
						disabled={isPending}
					>
						{isPending ? (
							<>
								<ReloadIcon className='mr-2 size-4 animate-spin' />
							</>
						) : (
							<>{isEdit ? "Edit" : "Ask A Question"}</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default QuestionForm;
