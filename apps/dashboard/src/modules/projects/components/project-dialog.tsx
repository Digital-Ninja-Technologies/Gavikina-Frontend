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
import { ImagePlus, Loader2 } from "lucide-react";
import { type ComponentProps, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
		} else if (!projectId) {
			form.reset(emptyDraft(defaultSize));
		}
	}, [project, projectId, form, defaultSize]);

	const imagesCount = useWatch({
		control: form.control,
		name: "images",
	});

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
		mutationFn: (data: { id: string; payload: any }) =>
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
			photos: Array(values.images).fill("https://placeholder.image.url"),
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
							rows={5}
							placeholder="What the system covers and how it resolved power needs for the client."
						/>

						<Field>
							<FieldLabel>Photographs</FieldLabel>
							<div className="relative flex items-center gap-3 rounded-xl border border-dashed border-navy/20 bg-muted/20 p-3.5 transition-colors hover:border-navy/40">
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-navy/10 bg-white text-navy shadow-2xs">
									<ImagePlus className="size-4" />
								</span>
								<div className="flex min-w-0 flex-1 flex-col">
									<span className="truncate text-xs font-medium text-navy sm:text-sm">
										{imagesCount
											? `${imagesCount} photograph${imagesCount === 1 ? "" : "s"} attached`
											: "Attach photographs"}
									</span>
									<span className="text-xs text-navy/50">
										PNG, JPG, or WebP formats
									</span>
								</div>
								<input
									type="file"
									multiple
									accept="image/*"
									className="absolute inset-0 size-full cursor-pointer opacity-0"
									onChange={(e) =>
										form.setValue(
											"images",
											imagesCount + (e.target.files?.length || 0),
										)
									}
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
			<div className="flex items-center gap-2">
				<Skeleton className="size-4 bg-navy/10" />
				<Skeleton className="h-4 w-48 bg-navy/10" />
			</div>
		</div>
	);
}
