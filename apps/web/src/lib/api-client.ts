import { env } from "#/env/client";

const BASE_URL = env.VITE_API_BASE_URL || "http://localhost:4000/api";

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

// 1. Custom Error Class
export class ApiError extends Error {
	public status?: number;
	// biome-ignore lint/suspicious/noExplicitAny: Error payload shape varies
	public data?: any;

	// biome-ignore lint/suspicious/noExplicitAny: Error payload shape varies
	constructor(message: string, status?: number, data?: any) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

export async function apiClient<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	let response: Response;

	const signal = options.signal || AbortSignal.timeout(20000);

	try {
		response = await fetch(`${BASE_URL}${endpoint}`, {
			...options,
			signal,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		});
	} catch (error) {
		// Catches DNS failures, offline states, and CORS errors
		throw new ApiError(
			error instanceof Error ? error.message : "Network request failed",
		);
	}

	if (!response.ok) {
		let errorData: unknown;
		let errorMessage = `Request failed with status ${response.status}`;

		try {
			// Read as text first to avoid crashing on HTML error pages (e.g. 502 Bad Gateway)
			const text = await response.text();
			try {
				errorData = JSON.parse(text);
				// If your API standardizes on { message: string }, extract it
				if (
					errorData &&
					typeof errorData === "object" &&
					"message" in errorData
				) {
					errorMessage = (errorData as { message: string }).message;
				}
			} catch {
				// Body is not JSON, keep it as raw text
				errorData = text;
				if (text.trim()) errorMessage = text.trim();
			}
		} catch {
			// Failsafe if body cannot be read at all
		}

		throw new ApiError(errorMessage, response.status, errorData);
	}

	return response.json();
}
