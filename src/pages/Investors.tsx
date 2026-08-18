import { useState } from 'react';

const INVESTOR_STATS = [
  { value: '₦60k+', label: 'Typical monthly generator fuel spend per household we assess' },
  { value: '5 tiers', label: 'Standardised systems, so installation stays repeatable' },
  { value: '3–5 yrs', label: 'Typical payback against current fuel spend' },
];

const INVESTOR_SECTIONS = [
  { title: 'The opportunity', body: 'Grid supply is unreliable and fuel is the default fallback. Households and small businesses already treat power as a monthly cost. Solar converts that recurring cost into a one-off asset, which makes the sale a comparison rather than a conversion.' },
  { title: 'How we operate', body: 'Standardised system tiers keep procurement and installation repeatable, and every job is sized by the same engine before an engineer confirms it on site. Growth comes from installation capacity and the agent network, not from bespoke engineering per customer.' },
  { title: 'Where we are now', body: 'Residential and small-business installations across Lagos, Abuja and Benin City, with an agent network in development. Current numbers, pipeline and projections are in the investor pack.' },
];

export default function Investors() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="page-hero">
      <span className="eyebrow">Investors guide</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '22ch' }}>A grid that cannot keep up is a market.</h1>
      <div className="split" style={{ marginTop: 44 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(20,55,94,.7)', maxWidth: '58ch' }}>
            Gavikina Energy sells complete solar systems to households and small businesses that already spend heavily on generator fuel
            every month. The customer is not being persuaded to change habits — they are being offered a cheaper version of what they
            already buy.
          </p>
          <div className="grid grid-3" style={{ marginTop: 34 }}>
            {INVESTOR_STATS.map((s) => (
              <div key={s.label} style={{ padding: '22px 20px', borderRadius: 16, background: '#101328', color: '#fff' }}>
                <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: '-.03em', color: '#F5A623' }}>{s.value}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'rgba(255,255,255,.6)', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 34 }}>
            {INVESTOR_SECTIONS.map((s) => (
              <div key={s.title}>
                <h3 style={{ margin: 0, fontSize: 19 }}>{s.title}</h3>
                <p style={{ margin: '9px 0 0', fontSize: 14.5, lineHeight: 1.72, color: 'rgba(20,55,94,.66)', maxWidth: '60ch' }}>{s.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30, padding: '22px 24px', borderRadius: 16, border: '1px solid rgba(245,166,35,.4)', background: 'rgba(245,166,35,.07)' }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: 'rgba(20,55,94,.78)' }}>
              <strong>Financials are not published here.</strong> Detailed accounts, projections and the business plan are sent directly
              after a request is reviewed.
            </p>
          </div>
        </div>

        <div style={{ padding: '32px 34px', borderRadius: 20, border: '1px solid rgba(20,55,94,.12)', background: '#fff', boxShadow: '0 18px 44px -34px rgba(16,19,40,.4)' }}>
          {!sent ? (
            <div>
              <h3 style={{ margin: 0, fontSize: 22 }}>Request the full materials</h3>
              <p style={{ margin: '8px 0 24px', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.6)' }}>
                Tell us who you are and what you are looking for. We reply to serious enquiries with the full pack.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label className="field">
                  <span>Name</span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </label>
                <label className="field">
                  <span>Email address</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                </label>
                <label className="field">
                  <span>Phone number</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" />
                </label>
                <label className="field">
                  <span>What are you looking for?</span>
                  <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ticket size, horizon, questions" />
                </label>
                <button type="button" className="btn btn-ink" style={{ marginTop: 6, padding: '14px 20px', fontSize: 14.5 }} onClick={() => setSent(true)}>
                  Request materials
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '26px 0', animation: 'gvIn .3s ease both' }}>
              <span style={{ width: 42, height: 42, borderRadius: 13, background: '#101328', color: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
                ✓
              </span>
              <h3 style={{ margin: '18px 0 0', fontSize: 22 }}>Request logged</h3>
              <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.7, color: 'rgba(20,55,94,.66)' }}>
                We review each request before sending financials. Expect a reply within a few working days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
