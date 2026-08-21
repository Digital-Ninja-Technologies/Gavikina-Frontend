import { createFileRoute } from '@tanstack/react-router';
import EnquiryDetailView from '../components/EnquiryDetailView';

export const Route = createFileRoute('/enquiries/$view/$id')({ component: EnquiryDetailRoute });

function EnquiryDetailRoute() {
  const { view, id } = Route.useParams();
  return <EnquiryDetailView view={view} id={id} />;
}
