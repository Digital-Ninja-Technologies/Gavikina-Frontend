import { toast } from "@workspace/ui/components/toast";
import { useState } from "react";
import { completeUpload, requestUploadUrl } from "../api";

export function useFileUpload() {
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	const uploadFile = async (
		file: File,
		purpose: "PROJECT_IMAGE" | "CV" | "PROFILE_IMAGE",
	) => {
		setIsUploading(true);
		setProgress(0);

		try {
			const res = await requestUploadUrl({
				fileName: file.name,
				contentType: file.type,
				size: file.size,
				purpose,
			});

			const { fileId, uploadUrl, uploadToken } = res.data;

			const xhr = new XMLHttpRequest();
			await new Promise<void>((resolve, reject) => {
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const percent = Math.round((event.loaded / event.total) * 100);
						setProgress(percent);
					}
				};

				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve();
					} else {
						reject(new Error("File upload to storage failed"));
					}
				};

				xhr.onerror = () => reject(new Error("Network error during upload"));

				xhr.open("PUT", uploadUrl);
				xhr.setRequestHeader("Content-Type", file.type);
				xhr.send(file);
			});

			// Step 3: Verify & Complete Upload
			await completeUpload(fileId, uploadToken);

			return fileId;
		} catch (err) {
			console.error("Upload process failed:", err);
			toast.add({
				title: "Upload Failed",
				description: "Failed to upload file. Please try again.",
				type: "error",
			});
			throw err;
		} finally {
			setIsUploading(false);
		}
	};

	return { uploadFile, isUploading, progress };
}
