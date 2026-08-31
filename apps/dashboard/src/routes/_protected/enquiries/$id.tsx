import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import { viewInfo } from "#/lib/data";
import {
	EnquiryDetailContent,
	EnquiryDetailSkeleton,
} from "#/modules/enquiries/components/enquiry-detail-view";
import { enquiryDetailQueryOptions } from "@/modules/enquiries/query-options";

const enquiryDetailSearchSchema = z.object({
	view: z.string().default("all").catch("all"),
});

export const Route = createFileRoute("/_protected/enquiries/$id")({
	validateSearch: (search) => enquiryDetailSearchSchema.parse(search),
	beforeLoad: async ({ context, params, search }) => {
		await context.queryClient.query(
			enquiryDetailQueryOptions(params.id, search.view),
		);
	},
	component: EnquiryDetailRoute,
});

function EnquiryDetailRoute() {
	const { id } = Route.useParams();
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: "/enquiries/$id" });

	const [title] = viewInfo(view);

	const handleBack = () => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			navigate({
				to: "/enquiries",
				search: { view } as any,
			});
		}
	};

	return (
		<div className="flex flex-col gap-6 animate-gv-fade">
			<button
				type="button"
				className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-navy/60 hover:text-navy"
				onClick={handleBack}
			>
				<ArrowLeft className="size-3.5" /> Back to {title}
			</button>

			<AsyncBoundary
				errorTitle="Failed to load enquiry details"
				fallback={<EnquiryDetailSkeleton />}
			>
				<EnquiryDetailContent id={id} view={view} />
			</AsyncBoundary>
		</div>
	);
}
