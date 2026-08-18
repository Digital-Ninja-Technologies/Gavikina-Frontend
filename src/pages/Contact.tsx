import { useState } from 'react';

const CONTACT_METHODS = [
  { icon: '☎', label: 'Phone', value: '0800 428 4546', note: 'Mon–Sat, 8am to 6pm' },
  { icon: '✆', label: 'WhatsApp', value: '+234 803 000 0000', note: 'Fastest for photos of your board or roof' },
  { icon: '✉', label: 'Email', value: 'hello@gavikinaenergy.com', note: 'Replied the same working day' },
  { icon: '⌖', label: 'Office', value: '14 Adeola Odeku Street, Victoria Island, Lagos', note: 'Visits by appointment' },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="page-hero">
      <span className="eyebrow">Contact</span>
      <h1 className="h1" style={{ margin: '14px 0 0' }}>Talk to an engineer.</h1>
      <div className="split" style={{ gridTemplateColumns: 'minmax(0,.95fr) minmax(0,1.05fr)', marginTop: 44 }}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONTACT_METHODS.map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '22px 24px', borderRadius: 16, border: '1px solid rgba(20,55,94,.11)' }}>
                <span style={{ flex: 'none', width: 38, height: 38, borderRadius: 11, background: 'rgba(46,158,69,.1)', color: '#2E9E45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>
                  {c.icon}
                </span>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.11em', textTransform: 'uppercase', color: 'rgba(20,55,94,.45)' }}>{c.label}</span>
                  <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4, letterSpacing: '-.01em' }}>{c.value}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(20,55,94,.55)', marginTop: 2 }}>{c.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(20,55,94,.11)', background: '#F2EDE3' }}>
            <iframe
              title="Map of 14 Adeola Odeku Street, Victoria Island, Lagos"
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.4141%2C6.4231%2C3.4291%2C6.4331&layer=mapnik&marker=6.4281%2C3.4216"
              style={{ display: 'block', width: '100%', height: 230, border: 0 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '16px 20px', background: '#fff', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: '-.01em' }}>14 Adeola Odeku Street</div>
                <div style={{ fontSize: 12.5, color: 'rgba(20,55,94,.55)', marginTop: 2 }}>Victoria Island, Lagos</div>
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=6.4281&mlon=3.4216#map=17/6.4281/3.4216"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ flex: 'none', padding: '10px 16px', fontSize: 13, textDecoration: 'none' }}
              >
                Get directions
              </a>
            </div>
          </div>
        </div>

        <div style={{ padding: '34px 36px', borderRadius: 20, background: '#F2EDE3' }}>
          {!sent ? (
            <div>
              <h3 style={{ margin: 0, fontSize: 23 }}>Send us a message</h3>
              <p style={{ margin: '8px 0 24px', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.62)' }}>
                Goes straight to our team inbox. For a sized recommendation, the assessment is faster.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <label className="field">
                  <span>Name</span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </label>
                <label className="field">
                  <span>Email or phone</span>
                  <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="How we reach you" />
                </label>
                <label className="field">
                  <span>Message</span>
                  <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What do you need?" />
                </label>
                <button type="button" className="btn btn-primary" style={{ marginTop: 6, padding: '14px 20px', fontSize: 14.5 }} onClick={() => setSent(true)}>
                  Send message
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px 0', animation: 'gvIn .3s ease both' }}>
              <span style={{ width: 42, height: 42, borderRadius: 13, background: '#2E9E45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
                ✓
              </span>
              <h3 style={{ margin: '18px 0 0', fontSize: 22 }}>Message sent</h3>
              <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.7, color: 'rgba(20,55,94,.66)' }}>
                It is in our inbox and we reply the same working day. If it is urgent, WhatsApp is fastest.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
