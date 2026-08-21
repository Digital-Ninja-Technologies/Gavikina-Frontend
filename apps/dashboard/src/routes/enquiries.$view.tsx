import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/enquiries/$view')({ component: Outlet });
