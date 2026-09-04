import type { ApiResponse } from "#/lib/api-client"
import { apiClient } from "#/lib/api-client"

export async function requestUploadUrl(data: {
  fileName: string
  contentType: string
  size: number
  purpose: "PROJECT_IMAGE" | "CV" | "PROFILE_IMAGE" | "DOCUMENT" | "OTHER"
}) {
  return apiClient<
    ApiResponse<{
      fileId: string
      uploadUrl: string
      uploadToken: string
      storageKey: string
      expiresIn: number
    }>
  >("/files/upload-url", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function completeUpload(fileId: string, uploadToken: string) {
  return apiClient<ApiResponse<any>>(`/files/${fileId}/complete`, {
    method: "POST",
    body: JSON.stringify({ uploadToken }),
  })
}
