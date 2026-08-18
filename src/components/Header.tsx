import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-primary.svg';
import { NAV, PAGE_PATHS } from '../lib/content';
import { useModal } from '../context/ModalContext';

export default function Header() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openCalc, openAssess } = useModal();

  const currentPage = Object.entries(PAGE_PATHS).find(([, path]) => path === location.pathname)?.[0] || 'home';

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const go = (page: string) => navigate(PAGE_PATHS[page] || '/');

  return (
    <>
    <header className="header">
      <div className="header-inner">
        <button type="button" className="logo-btn" onClick={() => go('home')}>
          <img src={logo} alt="Gavikina Energy" />
        </button>

        <nav className="nav-desktop">
          {NAV.map((g) => {
            const active = g.items.some((i) => i.page === currentPage);
            const isOpen = openGroup === g.key;
            return (
              <div
                key={g.key}
                className="nav-group"
                onMouseEnter={() => setOpenGroup(g.key)}
                onMouseLeave={() => setOpenGroup((k) => (k === g.key ? null : k))}
              >
                <button type="button" className={'nav-btn' + (active ? ' active' : '')}>
                  {g.label}{' '}
                  <span className="chev" style={{ transform: isOpen ? 'translateY(-1px) rotate(180deg)' : 'translateY(-1px)' }}>
                    ⌄
                  </span>
                </button>
                {isOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-inner">
                      {g.items.map((it) => (
                        <button
                          key={it.page}
                          type="button"
                          className={'nav-item-btn' + (it.page === currentPage ? ' active' : '')}
                          onClick={() => go(it.page)}
                        >
                          <span className="label">{it.label}</span>
                          <span className="note">{it.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <button type="button" className={'nav-btn' + (currentPage === 'contact' ? ' active' : '')} onClick={() => go('contact')}>
            Contact
          </button>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={openCalc}>
            Solar calculator
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openAssess()}>
            Free assessment
          </button>
          <button
            type="button"
            className="hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>

    {/* Rendered as a sibling, not a header descendant: the header's
        backdrop-filter creates a containing block for position:fixed
        children, which would clip this panel to the header's own box. */}
    {mobileOpen && (
      <div className="mobile-nav">
        {NAV.map((g) => (
          <div className="mobile-nav-group" key={g.key}>
            <h4>{g.label}</h4>
            {g.items.map((it) => (
              <button key={it.page} type="button" className="mobile-nav-link" onClick={() => go(it.page)}>
                <span className="label">{it.label}</span>
                <span className="note">{it.note}</span>
              </button>
            ))}
          </div>
        ))}
        <div className="mobile-nav-group">
          <button type="button" className="mobile-nav-link" onClick={() => go('contact')}>
            <span className="label">Contact</span>
          </button>
        </div>
        <div className="mobile-nav-cta">
          <button type="button" className="btn btn-outline btn-md" onClick={openCalc}>
            Solar calculator
          </button>
          <button type="button" className="btn btn-primary btn-md" onClick={() => openAssess()}>
            Free assessment
          </button>
        </div>
      </div>
    )}
    </>
  );
}
