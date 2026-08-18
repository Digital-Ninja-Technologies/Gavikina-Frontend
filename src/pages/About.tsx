import ImageSlot from '../components/ImageSlot';

const PRINCIPLES = [
  { title: 'Measured, not guessed', body: 'Every quote starts from a load audit at your distribution board.' },
  { title: 'One price, all in', body: 'Mounting, protection and commissioning are never separate line items.' },
  { title: 'Lithium only', body: 'We stopped installing lead-acid banks. They do not survive the duty cycle here.' },
  { title: 'You own it', body: 'No lease, no subscription, no lock-in to us for spares.' },
];

export default function About() {
  return (
    <div className="page-hero">
      <span className="eyebrow">About us</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '20ch' }}>We build power you own outright.</h1>
      <div className="split" style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 15.5, lineHeight: 1.78, color: 'rgba(20,55,94,.72)' }}>
          <p style={{ margin: 0 }}>
            Gavikina Energy installs solar systems for homes and businesses that are tired of budgeting for fuel. We are engineers first:
            every system is sized from a measured load, not a sales target, and every quote is confirmed on site before a panel is ordered.
          </p>
          <p style={{ margin: 0 }}>
            The work is deliberately narrow. We size, supply, install and commission complete systems — panels, inverter, batteries,
            mounting, protection and cabling — and we stay reachable afterwards. No cart, no bundles, no upsell on hardware you will not use.
          </p>
          <p style={{ margin: 0 }}>What you own at the end is an asset on your roof, not a subscription.</p>
          <div className="grid grid-2" style={{ marginTop: 14 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.title} style={{ padding: 20, borderRadius: 15, background: '#F2EDE3' }}>
                <h3 style={{ margin: 0, fontSize: 15, color: '#14375E' }}>{p.title}</h3>
                <p style={{ margin: '7px 0 0', fontSize: 13, lineHeight: 1.6, color: 'rgba(20,55,94,.65)' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 20, overflow: 'hidden', background: '#F2EDE3' }}>
          <ImageSlot
            src="https://images.unsplash.com/photo-1660330589257-813305a4a383?fm=jpg&q=70&w=1400&fit=crop&auto=format"
            placeholder="Team or install photo"
            credit="Photo by Raze Solar on Unsplash"
            creditHref="https://unsplash.com/@razesolar"
          />
        </div>
      </div>
    </div>
  );
}
