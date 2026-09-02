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
import { closeDialog } from "@/store/dialog-store";
import { createProject, updateProject } from "../api";
import { projectDetailQueryOptions, projectsKeys } from "../query-options";

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
	const [photoList, setPhotoList] = useState<string[]>([]);

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
			const existingPhotos =
				(project as unknown as { photos?: string[] }).photos || [];
			setPhotoList(existingPhotos);
		} else if (!projectId) {
			form.reset(emptyDraft(defaultSize));
			setPhotoList([]);
		}
	}, [project, projectId, form, defaultSize]);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		const objectUrls = files.map((file) => URL.createObjectURL(file));
		setPhotoList((prev) => {
			const next = [...prev, ...objectUrls];
			form.setValue("images", next.length);
			return next;
		});
	};

	const handleRemoveImage = (indexToRemove: number) => {
		setPhotoList((prev) => {
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

	const isPending = createMutation.isPending || updateMutation.isPending;

	const onSubmit = form.handleSubmit((values) => {
		const payload = {
			title: values.title,
			location: values.location,
			systemSize: values.size,
			category: values.category,
			description: values.body,
			isCaseStudy: values.caseStudy,
			photos: photoList,
		};

		if (projectId) {
			updateMutation.mutate({ id: projectId, payload });
		} else {
			createMutation.mutate(payload);
		}
	});

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
						/>

						<FormInput
							control={form.control}
							name="location"
							label="Location"
							placeholder="e.g. Lekki, Lagos"
						/>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<FormSelect
								control={form.control}
								name="size"
								label="System Size"
								options={sizeOptions}
								placeholder="Select size"
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
							/>
						</div>

						<FormTextarea
							control={form.control}
							name="body"
							label="Description"
							rows={4}
							placeholder="What the system covers and how it resolved power needs for the client."
						/>

						{/* Interactive Image Uploader with Previews */}
						<Field>
							<div className="flex items-center justify-between mb-1.5">
								<FieldLabel>Photographs</FieldLabel>
								<span className="text-xs text-navy/50">
									{photoList.length} uploaded
								</span>
							</div>

							{photoList.length > 0 && (
								<div className="mb-3 grid grid-cols-4 gap-2.5">
									{photoList.map((url, idx) => (
										<div
											key={url}
											className="group relative aspect-square overflow-hidden rounded-xl border border-navy/10 bg-navy/5"
										>
											<img
												src={url}
												alt={`Upload preview ${idx + 1}`}
												className="size-full object-cover"
											/>
											<button
												type="button"
												aria-label="Remove photo"
												onClick={() => handleRemoveImage(idx)}
												className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black"
											>
												<X className="size-3" />
											</button>
										</div>
									))}
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
									accept="image/*"
									className="absolute inset-0 size-full cursor-pointer opacity-0"
									onChange={handleImageUpload}
								/>
							</div>
						</Field>

						<FormCheckbox
							control={form.control}
							name="caseStudy"
							label="Feature as detailed case study"
						/>
					</form>
				)}

				<DialogFooter className="flex items-center gap-2 sm:justify-end">
					<DialogClose
						render={
							<Button type="button" variant="outline" disabled={isPending} />
						}
					>
						Cancel
					</DialogClose>
					<Button
						type="submit"
						form="project-form"
						disabled={isPending || isProjectLoading}
					>
						{isPending && <Loader2 className="animate-spin" />}
						{projectId ? "Save Changes" : "Create Project"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

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
