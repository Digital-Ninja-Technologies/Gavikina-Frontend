import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '@gavikina/ui';
import { LEADS } from '../lib/data';
import { useProjects } from '../store/projects';
import { signOut, useAuth } from '../store/auth';

function countsFor(projectsCount: number) {
  const rowsFor = (key: string) => {
    if (key === 'customers') return LEADS.filter((l) => l.type === 'Customer' && l.completed).length;
    if (key === 'abandoned') return LEADS.filter((l) => l.type === 'Customer' && !l.completed).length;
    if (key === 'agents') return LEADS.filter((l) => l.type === 'Agent').length;
    if (key === 'investors') return LEADS.filter((l) => l.type === 'Investor').length;
    if (key === 'careers') return LEADS.filter((l) => l.type === 'Career').length;
    return LEADS.length;
  };
  return {
    all: rowsFor('all'), customers: rowsFor('customers'), agents: rowsFor('agents'),
    investors: rowsFor('investors'), careers: rowsFor('careers'), abandoned: rowsFor('abandoned'),
    projects: projectsCount,
  };
}

const NAV_ENQUIRIES: [keyof Omit<ReturnType<typeof countsFor>, 'projects'>, string][] = [
  ['all', 'All enquiries'],
  ['customers', 'Customers'],
  ['agents', 'Agents'],
  ['investors', 'Investors'],
  ['careers', 'Job applications'],
  ['abandoned', 'Abandoned'],
];

interface SidebarProps {
  navOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ navOpen, onClose }: SidebarProps) {
  const { email } = useAuth();
  const projects = useProjects();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const counts = countsFor(projects.length);

  const navBtnClass = (active: boolean) =>
    cn(
      'flex items-center justify-between rounded-xl px-3.5 py-2.75 text-[13.5px] font-medium text-white/75',
      active ? 'bg-white/12 text-white' : 'hover:bg-white/6'
    );

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-70 flex-col gap-6 overflow-y-auto bg-ink p-5 transition-transform min-[961px]:sticky min-[961px]:top-0 min-[961px]:h-screen min-[961px]:translate-x-0',
        navOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between">
        <img src={`${import.meta.env.BASE_URL}logo-primary-ondark.svg`} alt="Gavikina Energy" className="m-1.5 block h-10 w-auto" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/18 bg-white/6 text-white min-[961px]:hidden"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-0.5">
        <Link to="/" className={navBtnClass(pathname === '/')}>
          Overview
        </Link>

        <span className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">Enquiries</span>
        {NAV_ENQUIRIES.map(([key, label]) => (
          <Link key={key} to="/enquiries/$view" params={{ view: key }} className={navBtnClass(pathname === `/enquiries/${key}`)}>
            {label}
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] tabular-nums text-white/70">{counts[key]}</span>
          </Link>
        ))}

        <span className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">Content</span>
        <Link to="/projects" className={navBtnClass(pathname === '/projects')}>
          Past Projects
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] tabular-nums text-white/70">{counts.projects}</span>
        </Link>
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-5">
        <span className="text-[12.5px] font-medium text-white">{email || 'admin@gavikina.com'}</span>
        <span className="text-[11px] text-white/45">Administrator</span>
        <button
          type="button"
          onClick={signOut}
          className="mt-2.5 rounded-lg border border-white/16 bg-transparent px-3 py-2 text-left text-[12.5px] font-medium text-white/70 hover:bg-white/6"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
