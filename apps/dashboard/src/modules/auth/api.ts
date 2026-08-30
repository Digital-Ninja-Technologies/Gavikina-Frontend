import type { AdminLoginValues } from "@workspace/schemas";
import { apiClient } from "#/lib/api-client";

export interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
}

export async function loginAdmin(data: AdminLoginValues) {
	const res = await apiClient<{ success: boolean; data: AuthResponse }>(
		"/auth/login",
		{
			method: "POST",
			body: JSON.stringify(data),
		},
	);

	if (res.data?.token) {
		localStorage.setItem("admin_token", res.data.token);
		//FIXME: temp
		localStorage.setItem("admin_user", JSON.stringify(res.data.user));
	}

	return res.data;
}

export async function logoutAdmin() {
	localStorage.removeItem("admin_token");
	localStorage.removeItem("admin_user");
	// TODO: Call backend /auth/logout
}

export async function fetchSession(): Promise<AuthResponse | null> {
	const token = localStorage.getItem("admin_token");
	const userStr = localStorage.getItem("admin_user");

	if (!token || !userStr) return null;

	// TODO: When the backend adds the session route, replace the try/catch block below with:
	// const res = await apiClient<{ success: boolean; data: AuthResponse['user'] }>("/auth/me");
	// return { token, user: res.data };

	try {
		const user = JSON.parse(userStr);
		return { token, user };
	} catch {
		localStorage.removeItem("admin_token");
		localStorage.removeItem("admin_user");
		return null;
	}
}
