"use server";

import { JobFilterParams } from "@/types/action";

export const fetchLocation = async () => {
	try {
		const response = await fetch("http://ip-api.com/json/?fields=country");

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const location = await response.json();
		return location.country || "United States";
	} catch (error) {
		console.log("Error fetching location:", error);
		return "United States";
	}
};

export const fetchCountries = async () => {
	try {
		const response = await fetch("https://restcountries.com/v3.1/all");

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return Array.isArray(result) ? result : [];
	} catch (error) {
		console.log("Error fetching countries:", error);
		return [];
	}
};

export const fetchJobs = async (filters: JobFilterParams) => {
	const { query, page } = filters;

	try {
		const headers = {
			"x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
			"x-rapidapi-host": "jsearch.p.rapidapi.com",
		};

		const response = await fetch(
			`https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
			{
				headers,
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return Array.isArray(result.data) ? result.data : [];
	} catch (error) {
		console.log("Error fetching jobs:", error);
		return [];
	}
};
