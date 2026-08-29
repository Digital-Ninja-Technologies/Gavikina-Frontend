import { env } from "#/env/client";

const BASE_URL = env.VITE_API_BASE_URL || "http://localhost:4000/api";

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

export async function apiClient<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const response = await fetch(`${BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		console.error(`An Error occured: ${errorData}`); //FIXME: remove in prod
		throw new Error(
			errorData.message || `Request failed with status ${response.status}`,
		);
	}

	return response.json();
}
