import { createFileRoute } from '@tanstack/react-router';
import EnquiryTable from '../components/EnquiryTable';

export const Route = createFileRoute('/enquiries/$view/')({ component: EnquiriesView });

function EnquiriesView() {
  const { view } = Route.useParams();
  return <EnquiryTable view={view} />;
}
