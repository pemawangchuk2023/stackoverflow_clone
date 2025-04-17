"use server";

import Question from "@/database/question.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import { SearchParams } from "@/types/shared.types";
import dbConnect from "@/lib/mongoose";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
	try {
		dbConnect();

		const { query, type } = params;
		const regexQuery = { $regex: query, $options: "i" };
		let results = [];

		const modelsAndTypes = [
			{ model: Question, searchField: "title", type: "question" },
			{ model: User, searchField: "name", type: "user" },
			{ model: Answer, searchField: "content", type: "answer" },
			{ model: Tag, searchField: "name", type: "tag" },
		];

		const typeLower = type?.toLowerCase();
		if (!typeLower || !SearchableTypes.includes(typeLower)) {
			// Search across all types
			for (const { model, searchField, type } of modelsAndTypes) {
				const queryResults = await model
					.find({ [searchField]: regexQuery })
					.limit(2);

				results.push(
					...queryResults.map((item) => ({
						title:
							type === "answer"
								? `Answers containing ${query}`
								: item[searchField],
						type,
						id: type === "answer" ? item.question : item._id,
					}))
				);
			}
		} else {
			// Search within specified type
			const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);
			if (!modelInfo) throw new Error("Invalid search type");

			const queryResults = await modelInfo.model
				.find({ [modelInfo.searchField]: regexQuery })
				.limit(6);

			results = queryResults.map((item) => ({
				title:
					typeLower === "answer"
						? `Answers containing ${query}`
						: item[modelInfo.searchField],
				type: typeLower,
				id: typeLower === "answer" ? item.question : item._id,
			}));
		}

		return JSON.stringify(results);
	} catch (error) {
		console.log(error);
		throw error;
	}
}
