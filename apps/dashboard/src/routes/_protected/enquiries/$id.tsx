import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import EnquiryDetailView from "#/modules/enquiries/components/enquiry-detail-view";
import { enquiryDetailQueryOptions } from "#/modules/enquiries/query-options";

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

	return (
		<AsyncBoundary errorTitle="Failed to load enquiry details">
			<EnquiryDetailView id={id} view={view} />
		</AsyncBoundary>
	);
}
