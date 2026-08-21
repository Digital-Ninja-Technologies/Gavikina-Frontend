import { useState } from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';

import '../styles.css';
import Login from '../components/Login';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../store/auth';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { email } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  if (email === null) return <Login />;

  return (
    <div className="flex min-h-screen bg-[#FBFAF8]">
      {navOpen && <div className="fixed inset-0 z-40 bg-ink/50 min-[961px]:hidden" onClick={() => setNavOpen(false)} />}
      <Sidebar navOpen={navOpen} onClose={() => setNavOpen(false)} />

      <main className="min-w-0 flex-1">
        <div className="flex h-14 items-center gap-3 border-b border-navy/10 bg-white px-5 min-[961px]:hidden">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/16" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            ☰
          </button>
          <span className="text-[14.5px] font-semibold tracking-tight">Gavikina Admin</span>
        </div>
        <div className="p-6 max-[640px]:p-4">
          <Outlet />
        </div>
      </main>

      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[{ name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> }]}
      />
    </div>
  );
}
