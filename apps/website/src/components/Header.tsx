import { useEffect, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button, cn } from '@gavikina/ui';
import logo from '../assets/logo-primary.svg';
import { NAV } from '../lib/content';
import { openCalc, openAssess } from '../store/modal';

export default function Header() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-[60] border-b border-navy/10 bg-white/94 backdrop-blur-lg">
        <div className="mx-auto flex h-[74px] max-w-[1260px] items-center gap-8.5 px-8 max-[480px]:gap-3 max-[480px]:px-4">
          <Link to="/" className="flex flex-none items-center">
            <img src={logo} alt="Gavikina Energy" className="block h-8.5 w-auto" />
          </Link>

          <nav className="ml-1.5 hidden items-center gap-1 min-[981px]:flex">
            {NAV.map((g) => {
              const active = g.items.some((i) => i.path === pathname);
              const isOpen = openGroup === g.key;
              return (
                <div
                  key={g.key}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(g.key)}
                  onMouseLeave={() => setOpenGroup((k) => (k === g.key ? null : k))}
                >
                  <button
                    type="button"
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border-0 px-3.5 py-2.5 text-sm font-medium text-navy',
                      active ? 'bg-cream' : 'bg-transparent'
                    )}
                  >
                    {g.label}
                    <ChevronDown className={cn('h-3 w-3 text-navy/45 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full min-w-[246px] pt-2">
                      <div className="animate-gv-in flex flex-col gap-px rounded-2xl border border-navy/11 bg-white p-2 shadow-[0_22px_50px_-22px_rgba(16,19,40,.34)]">
                        {g.items.map((it) => (
                          <Link
                            key={it.path}
                            to={it.path}
                            className={cn(
                              'flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-cream',
                              it.path === pathname && 'bg-cream'
                            )}
                          >
                            <span className="text-[13.5px] font-medium text-navy">{it.label}</span>
                            <span className="text-[11.5px] leading-tight text-navy/50">{it.note}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              to="/contact"
              className={cn('rounded-lg px-3.5 py-2.5 text-sm font-medium text-navy', pathname === '/contact' ? 'bg-cream' : 'bg-transparent')}
            >
              Contact
            </Link>
          </nav>

          <div className="ml-auto flex flex-none items-center gap-2.5 max-[480px]:gap-1.5">
            <Button variant="outline" size="sm" className="hidden min-[981px]:inline-flex" onClick={openCalc}>
              Solar calculator
            </Button>
            <Button size="sm" onClick={() => openAssess()} className="max-[560px]:px-3.5 max-[560px]:text-xs">
              Free assessment
            </Button>
            <button
              type="button"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] border border-navy/16 bg-white min-[981px]:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="animate-gv-in fixed inset-x-0 bottom-0 top-[74px] z-[55] overflow-y-auto bg-white px-5 pb-10 pt-3 min-[981px]:hidden">
          {NAV.map((g) => (
            <div key={g.key} className="mt-4.5 first:mt-0">
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-navy/45">{g.label}</h4>
              {g.items.map((it) => (
                <Link key={it.path} to={it.path} className="flex w-full flex-col gap-0.5 border-b border-navy/8 py-3 text-left text-navy">
                  <span className="text-[15px] font-medium">{it.label}</span>
                  <span className="text-xs text-navy/50">{it.note}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="mt-4.5">
            <Link to="/contact" className="flex w-full py-3 text-left text-[15px] font-medium text-navy">
              Contact
            </Link>
          </div>
          <div className="mt-5.5 flex flex-col gap-2.5">
            <Button variant="outline" onClick={openCalc}>
              Solar calculator
            </Button>
            <Button onClick={() => openAssess()}>Free assessment</Button>
          </div>
        </div>
      )}
    </>
  );
}
