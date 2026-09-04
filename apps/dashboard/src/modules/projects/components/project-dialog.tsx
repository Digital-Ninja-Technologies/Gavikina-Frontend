import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectDraftValues } from "@workspace/schemas";
import { projectDraftSchema } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import {
	FormCheckbox,
	FormInput,
	FormSelect,
	FormTextarea,
} from "@workspace/ui/components/form-fields";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/toast";
import { ImagePlus, Loader2, X } from "lucide-react";
import { type ComponentProps, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { catalogueTiersQueryOptions } from "@/modules/catalogue/query-options";
import { useFileUpload } from "@/modules/upload/hooks/use-file-upload";
import { closeDialog } from "@/store/dialog-store";
import { createProject, updateProject } from "../api";
import {
	type ProjectWithPhotos,
	projectDetailQueryOptions,
	projectsKeys,
} from "../query-options";

interface ProjectDialogProps extends ComponentProps<typeof Dialog> {
	projectId?: string;
}

const emptyDraft = (defaultSize: string): ProjectDraftValues => ({
	title: "",
	location: "",
	size: defaultSize,
	category: "home",
	caseStudy: false,
	images: 0,
	body: "",
});

export function ProjectDialog({ projectId, ...props }: ProjectDialogProps) {
	const queryClient = useQueryClient();

	// Store mixed types: existing URLs (string) and new uploads (File)
	const [photos, setPhotos] = useState<Array<File | string>>([]);
	const [uploadingIndex, setUploadingIndex] = useState(0);

	const { uploadFile, isUploading, progress } = useFileUpload();

	const { data: project, isLoading: isProjectLoading } = useQuery({
		...projectDetailQueryOptions(projectId ?? ""),
		enabled: !!projectId,
	});

	const { data: tiers = [] } = useQuery(catalogueTiersQueryOptions());
	const sizeOptions = useMemo(
		() => tiers.map((t) => ({ label: t.name, value: t.name })),
		[tiers],
	);

	const defaultSize = sizeOptions[0]?.value || "";

	const form = useForm<ProjectDraftValues>({
		resolver: zodResolver(projectDraftSchema),
		defaultValues: emptyDraft(defaultSize),
	});

	useEffect(() => {
		if (projectId && project) {
			form.reset(project);
			setPhotos((project as ProjectWithPhotos).photos || []);
		} else if (!projectId) {
			form.reset(emptyDraft(defaultSize));
			setPhotos([]);
		}
	}, [project, projectId, form, defaultSize]);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		setPhotos((prev) => {
			const next = [...prev, ...files];
			form.setValue("images", next.length);
			return next;
		});

		// Clear input so same file can be selected again if removed
		e.target.value = "";
	};

	const handleRemoveImage = (indexToRemove: number) => {
		setPhotos((prev) => {
			const next = prev.filter((_, idx) => idx !== indexToRemove);
			form.setValue("images", next.length);
			return next;
		});
	};

	const createMutation = useMutation({
		mutationFn: createProject,
		onSuccess: () => {
			toast.add({
				title: "Project Added",
				description: "The new project has been published successfully.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: projectsKeys.all });
			closeDialog();
		},
		onError: (error) => {
			toast.add({
				title: "Failed to Add Project",
				description:
					error instanceof Error
						? error.message
						: "There was a problem creating the project.",
				type: "error",
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: { id: string; payload: unknown }) =>
			updateProject(data.id, data.payload),
		onSuccess: () => {
			toast.add({
				title: "Project Updated",
				description: "Changes have been saved successfully.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: projectsKeys.all });
			closeDialog();
		},
		onError: (error) => {
			toast.add({
				title: "Failed to Update Project",
				description:
					error instanceof Error
						? error.message
						: "There was a problem saving your changes.",
				type: "error",
			});
		},
	});

	const isPending =
		createMutation.isPending || updateMutation.isPending || isUploading;

	const onSubmit = form.handleSubmit(async (values) => {
		const finalPhotoIds: string[] = [];
		let currentNewFileIndex = 0;

		// 1. Process files sequentially: upload Files, keep strings
		for (const photo of photos) {
			if (photo instanceof File) {
				try {
					setUploadingIndex(currentNewFileIndex + 1);
					const fileId = await uploadFile(photo, "PROJECT_IMAGE");
					finalPhotoIds.push(fileId);
					currentNewFileIndex++;
				} catch (error) {
					// uploadFile already triggers an error toast, halt submission
					return;
				}
			} else {
				// It's an existing URL/ID, keep it
				finalPhotoIds.push(photo);
			}
		}

		// 2. Build final payload
		const payload = {
			title: values.title,
			location: values.location,
			systemSize: values.size,
			category: values.category,
			description: values.body,
			isCaseStudy: values.caseStudy,
			photos: finalPhotoIds,
		};

		// 3. Dispatch to API
		if (projectId) {
			updateMutation.mutate({ id: projectId, payload });
		} else {
			createMutation.mutate(payload);
		}
	});

	const newFilesCount = photos.filter((p) => p instanceof File).length;

	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>
						{projectId ? "Edit Project" : "Add Project"}
					</DialogTitle>
					<DialogDescription>
						{projectId
							? "Update project details displayed on the public projects page."
							: "Create a new commissioned solar project for the public catalogue."}
					</DialogDescription>
				</DialogHeader>

				{isProjectLoading ? (
					<ProjectFormSkeleton />
				) : (
					<form
						id="project-form"
						onSubmit={onSubmit}
						className="flex flex-col gap-4 py-2"
					>
						<FormInput
							control={form.control}
							name="title"
							label="Title"
							placeholder="e.g. Lekki Phase 1 Duplex"
							disabled={isPending}
						/>

						<FormInput
							control={form.control}
							name="location"
							label="Location"
							placeholder="e.g. Lekki, Lagos"
							disabled={isPending}
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormSelect
								control={form.control}
								name="size"
								label="System Size"
								options={sizeOptions}
								placeholder="Select size"
								disabled={isPending}
							/>

							<FormSelect
								control={form.control}
								name="category"
								label="Category"
								options={[
									{ label: "Home", value: "home" },
									{ label: "Business", value: "business" },
								]}
								placeholder="Select category"
								disabled={isPending}
							/>
						</div>

						<FormTextarea
							control={form.control}
							name="body"
							label="Description"
							rows={4}
							placeholder="What the system covers and how it resolved power needs for the client."
							disabled={isPending}
						/>

						{/* Interactive Image Uploader with Previews */}
						<Field>
							<div className="flex items-center justify-between mb-1.5">
								<FieldLabel>Photographs</FieldLabel>
								<span className="text-xs text-navy/50">
									{photos.length} uploaded
								</span>
							</div>

							{photos.length > 0 && (
								<div className="mb-3 grid grid-cols-4 gap-2.5">
									{photos.map((photo, idx) => {
										const isFile = photo instanceof File;
										const url = isFile ? URL.createObjectURL(photo) : photo;

										return (
											<div
												// biome-ignore lint/suspicious/noArrayIndexKey: Order mapping
												key={idx}
												className="group relative aspect-square overflow-hidden rounded-xl border border-navy/10 bg-navy/5"
											>
												<img
													src={url}
													alt={`Upload preview ${idx + 1}`}
													className="size-full object-cover"
													// Revoke object URL after rendering to prevent memory leaks
													onLoad={() => {
														if (isFile) URL.revokeObjectURL(url);
													}}
												/>
												{!isPending && (
													<button
														type="button"
														aria-label="Remove photo"
														onClick={() => handleRemoveImage(idx)}
														className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black"
													>
														<X className="size-3" />
													</button>
												)}
											</div>
										);
									})}
								</div>
							)}

							<div className="relative flex items-center gap-3 rounded-xl border border-dashed border-navy/20 bg-muted/20 p-3.5 transition-colors hover:border-navy/40">
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-navy/10 bg-white text-navy shadow-2xs">
									<ImagePlus className="size-4" />
								</span>
								<div className="flex min-w-0 flex-1 flex-col">
									<span className="truncate text-xs font-medium text-navy sm:text-sm">
										Attach photos
									</span>
									<span className="text-xs text-navy/50">
										JPG, PNG, or WebP
									</span>
								</div>
								<input
									type="file"
									multiple
									accept="image/jpeg,image/png,image/webp"
									className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
									onChange={handleImageSelect}
									disabled={isPending}
								/>
							</div>
						</Field>

						<FormCheckbox
							control={form.control}
							name="caseStudy"
							label="Feature as detailed case study"
							disabled={isPending}
						/>
					</form>
				)}

				<DialogFooter className="flex items-center gap-2 sm:justify-end">
					<DialogClose
						render={
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isPending}
							/>
						}
					>
						Cancel
					</DialogClose>
					<Button
						type="submit"
						form="project-form"
						size="sm"
						disabled={isPending || isProjectLoading}
					>
						{isUploading && <Loader2 className="mr-2 size-4 animate-spin" />}
						{isUploading
							? `Uploading ${uploadingIndex}/${newFilesCount} (${progress}%)`
							: updateMutation.isPending || createMutation.isPending
								? "Saving..."
								: projectId
									? "Save Changes"
									: "Create Project"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// -----------------------------------------------------------------------------
// SKELETON LOADER
// -----------------------------------------------------------------------------
function ProjectFormSkeleton() {
	return (
		<div className="flex flex-col gap-4 py-2">
			<div className="space-y-2">
				<Skeleton className="h-4 w-12 bg-navy/10" />
				<Skeleton className="h-10 w-full bg-navy/5" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-16 bg-navy/10" />
				<Skeleton className="h-10 w-full bg-navy/5" />
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Skeleton className="h-4 w-20 bg-navy/10" />
					<Skeleton className="h-10 w-full bg-navy/5" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-16 bg-navy/10" />
					<Skeleton className="h-10 w-full bg-navy/5" />
				</div>
			</div>
			<div className="space-y-2">
				<Skeleton className="h-4 w-24 bg-navy/10" />
				<Skeleton className="h-24 w-full bg-navy/5" />
			</div>
			<Skeleton className="h-20 w-full rounded-xl bg-navy/5" />
		</div>
	);
}
