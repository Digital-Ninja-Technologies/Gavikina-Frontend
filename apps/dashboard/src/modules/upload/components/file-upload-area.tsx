import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { FileText, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
	label: string;
	accept?: Record<string, string[]>;
	value?: File | null | string;
	onChange: (file: File | null) => void;
	error?: string;
	isUploading?: boolean;
	progress?: number;
	previewUrl?: string | null;
}

export function FileUploadArea({
	label,
	accept = { "image/*": [], "application/pdf": [] },
	value,
	onChange,
	error,
	isUploading = false,
	progress = 0,
	previewUrl,
}: FileUploadProps) {
	const [preview, setPreview] = useState<string | null>(null);

	useEffect(() => {
		if (previewUrl) {
			setPreview(previewUrl);
			return;
		}

		if (!value) {
			setPreview(null);
			return;
		}

		if (value instanceof File && value.type.startsWith("image/")) {
			const objectUrl = URL.createObjectURL(value);
			setPreview(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}

		if (typeof value === "string") {
			setPreview(value);
		}

		setPreview(null);
	}, [value, previewUrl]);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file) {
				onChange(file);
			}
		},
		[onChange],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept,
		maxFiles: 1,
		multiple: false,
		disabled: isUploading,
	});

	const getFileDetails = () => {
		if (value instanceof File) {
			return {
				name: value.name,
				size: `${(value.size / 1024 / 1024).toFixed(2)} MB`,
				status: isUploading ? "Uploading..." : "Ready to submit",
			};
		}
		if (typeof value === "string") {
			// Extract filename from URL or use a fallback
			const fileName = value.split("/").pop()?.split("?")[0] || "Uploaded File";
			return {
				name: decodeURIComponent(fileName),
				size: null,
				status: "Uploaded",
			};
		}
		return null;
	};

	const details = getFileDetails();

	if (value && details) {
		return (
			<div className="flex flex-col gap-y-3">
				{/** biome-ignore lint/a11y/noLabelWithoutControl: <just a label for upload input> */}
				<label className="text-sm font-medium leading-none">{label}</label>
				<div
					className={cn(
						"border rounded-lg p-4 flex items-center justify-between bg-muted/20 transition-all",
						error && "border-destructive/50 bg-destructive/5",
					)}
				>
					<div className="flex items-center gap-4 overflow-hidden w-full">
						<div className="h-12 w-12 min-w-12 bg-background border rounded-lg flex items-center justify-center text-primary relative overflow-hidden shadow-sm">
							{isUploading ? (
								<span className="text-xs font-bold z-10">{progress}%</span>
							) : preview ? (
								<img
									src={preview}
									alt="Preview"
									className="h-full w-full object-cover"
								/>
							) : (
								<FileText className="size-6 text-muted-foreground" />
							)}

							{isUploading && (
								// biome-ignore lint/a11y/noSvgWithoutTitle: <...>
								<svg
									className="absolute inset-0 size-12 -rotate-90 pointer-events-none"
									viewBox="0 0 36 36"
								>
									<path
										className="text-primary/20"
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="text-primary transition-all duration-300 ease-out"
										strokeDasharray={`${progress}, 100`}
										d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										fill="none"
										stroke="currentColor"
										strokeWidth="4"
									/>
								</svg>
							)}
						</div>

						<div className="overflow-hidden flex-1">
							<p
								className="text-sm font-medium truncate text-navy"
								title={details.name}
							>
								{details.name}
							</p>
							<p className="text-xs text-muted-foreground">
								{details.size ? `${details.size} • ` : ""}
								{details.status}
							</p>
						</div>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onChange(null)}
							disabled={isUploading}
							className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
						>
							<X className="size-4" />
						</Button>
					</div>
				</div>
				{error && (
					<p className="text-xs text-destructive font-medium">{error}</p>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-y-3">
			{/** biome-ignore lint/a11y/noLabelWithoutControl: <...> */}
			<label className="text-sm font-medium leading-none text-navy">
				{label}
			</label>
			<div
				{...getRootProps()}
				className={cn(
					"border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer flex flex-col items-center gap-2 outline-none",
					isDragActive
						? "border-green bg-green/5"
						: "border-navy/15 hover:bg-muted/50",
					error && "border-destructive/50 bg-destructive/5",
					isUploading && "opacity-50 cursor-not-allowed",
				)}
			>
				<input {...getInputProps()} />
				<div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
					<UploadCloud className="h-5 w-5 text-navy/40" />
				</div>
				<div>
					<p className="text-sm font-medium text-navy">
						Click to upload{" "}
						<span className="text-navy/50 font-normal">or drag and drop</span>
					</p>
					<p className="text-xs text-navy/40 mt-1 uppercase">
						PDF, DOC, PNG, JPG
					</p>
				</div>
			</div>
			{error && <p className="text-xs text-destructive font-medium">{error}</p>}
		</div>
	);
}
