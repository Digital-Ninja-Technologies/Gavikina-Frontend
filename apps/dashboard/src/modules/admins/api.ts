import { apiClient } from "#/lib/api-client"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin" | string
  isSuperAdmin: boolean
  createdAt: string
}

export interface CreateAdminInput {
  email: string
  password: string
  name: string
}

export interface ChangePasswordInput {
  adminId?: string
  email?: string
  newPassword: string
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export async function getAdmins(): Promise<AdminUser[]> {
  const res = await apiClient<ApiResponse<AdminUser[]>>("/auth/admins")
  return res.data
}

export async function createAdmin(data: CreateAdminInput): Promise<AdminUser> {
  const res = await apiClient<ApiResponse<AdminUser>>("/auth/admin", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return res.data
}

export async function deleteAdmin(
  id: string
): Promise<{ id: string; email: string }> {
  const res = await apiClient<ApiResponse<{ id: string; email: string }>>(
    `/auth/admin/${id}`,
    {
      method: "DELETE",
    }
  )
  return res.data
}

export async function changeAdminPassword(
  data: ChangePasswordInput
): Promise<{ id: string; email: string }> {
  const res = await apiClient<ApiResponse<{ id: string; email: string }>>(
    "/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return res.data
}
