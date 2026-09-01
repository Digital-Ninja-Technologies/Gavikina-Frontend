const BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

export interface ApiMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<T> & { meta: ApiMeta };

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

	try {
		response = await fetch(`${BASE_URL}${endpoint}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}`,
				...options.headers,
			},
		});
	} catch (error) {
		throw new ApiError(
			error instanceof Error ? error.message : "Network request failed",
		);
	}

	if (!response.ok) {
		// Intercept 401 Unauthorized globally
		if (response.status === 401) {
			localStorage.removeItem("admin_token");
			window.location.assign("/login");
		}

		let errorData: unknown;
		let errorMessage = `Request failed with status ${response.status}`;

		try {
			const text = await response.text();
			try {
				errorData = JSON.parse(text);

				if (errorData && typeof errorData === "object") {
					const data = errorData as Record<string, unknown>;

					if (data.errors && typeof data.errors === "object") {
						const errs = data.errors as {
							formErrors?: string[];
							fieldErrors?: Record<string, string[]>;
						};

						const parts: string[] = [];

						if (errs.formErrors?.length) {
							parts.push(...errs.formErrors);
						}

						if (errs.fieldErrors) {
							for (const messages of Object.values(errs.fieldErrors)) {
								parts.push(...messages);
							}
						}

						if (parts.length > 0) {
							errorMessage = parts.join(" \n ");
						} else if (data.message && typeof data.message === "string") {
							errorMessage = data.message;
						}
					} else if (data.message && typeof data.message === "string") {
						errorMessage = data.message;
					}
				}
			} catch {
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
