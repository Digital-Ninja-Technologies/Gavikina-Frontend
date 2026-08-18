import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-primary-ondark.svg';
import { FOOTER_COLS, PAGE_PATHS } from '../lib/content';
import { useModal } from '../context/ModalContext';

export default function Footer() {
  const navigate = useNavigate();
  const { openAssess } = useModal();
  const go = (page: string) => navigate(PAGE_PATHS[page] || '/');

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <img src={logo} alt="Gavikina Energy" style={{ height: 38, width: 'auto', display: 'block' }} />
          <p style={{ margin: '18px 0 0', fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,.55)', maxWidth: '34ch' }}>
            Solar systems sized from a measured load, installed by our own engineers, owned outright by you.
          </p>
          <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 22 }} onClick={() => openAssess()}>
            Free assessment
          </button>
        </div>
        {FOOTER_COLS.map((col) => (
          <div className="footer-col" key={col.label}>
            <span className="col-label">{col.label}</span>
            <div className="footer-col-links">
              {col.items.map(([page, label]) => (
                <button key={page} type="button" className="footer-link" onClick={() => go(page)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2026 Gavikina Energy. Power Your Own.</span>
          <span>Prices on this site are indicative ranges, confirmed after site inspection.</span>
        </div>
      </div>
    </footer>
  );
}
