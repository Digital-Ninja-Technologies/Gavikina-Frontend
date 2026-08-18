import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page-hero" style={{ textAlign: 'center', padding: '140px 32px' }}>
      <span className="eyebrow">404</span>
      <h1 className="h1" style={{ margin: '14px 0 0' }}>That page doesn't exist.</h1>
      <p style={{ margin: '16px 0 30px', fontSize: 16, color: 'rgba(20,55,94,.65)' }}>Let's get you back to somewhere useful.</p>
      <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
        Back to home
      </button>
    </div>
  );
}
