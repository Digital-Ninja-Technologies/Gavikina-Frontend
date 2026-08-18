import { useState } from 'react';

const CAREER_NOTES = [
  'Installers, electrical engineers, assessors and office roles all use this form',
  'Applications stay on file and are reviewed when a role opens',
  'We call shortlisted applicants on the number you leave here',
];

interface JobForm {
  role: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  about: string;
}

const FIELDS: [keyof JobForm, string, string, boolean][] = [
  ['role', 'Role you are applying for', 'e.g. Installation technician', false],
  ['name', 'Full name', 'Your name', false],
  ['email', 'Email address', 'you@email.com', false],
  ['phone', 'Phone number', '0803 000 0000', false],
  ['location', 'Where are you based?', 'Area and state', false],
  ['about', 'Relevant experience', 'Where you have worked and what you have installed or maintained', true],
];

export default function Careers() {
  const [form, setForm] = useState<JobForm>({ role: '', name: '', email: '', phone: '', location: '', about: '' });
  const [cvName, setCvName] = useState('');
  const [sent, setSent] = useState(false);

  const setField = (key: keyof JobForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickCv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvName(file.name);
  };

  return (
    <div className="page-hero">
      <span className="eyebrow">Careers</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '20ch' }}>Work on systems that stay up.</h1>
      <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.7, color: 'rgba(20,55,94,.65)', maxWidth: '54ch' }}>
        We hire engineers and technicians who would rather do a job once, properly.
      </p>
      <div className="split-rev" style={{ marginTop: 44 }}>
        <div>
          <h2 style={{ fontSize: 24 }}>Open application</h2>
          <p style={{ margin: '12px 0 0', fontSize: 14.5, lineHeight: 1.7, color: 'rgba(20,55,94,.66)', maxWidth: '44ch' }}>
            We keep every application on file and go through them when a role opens. Tell us the role you are after, even if it is not
            advertised.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26 }}>
            {CAREER_NOTES.map((n) => (
              <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.75)' }}>
                <span style={{ flex: 'none', marginTop: 5, width: 5, height: 5, borderRadius: '50%', background: '#2E9E45' }} />
                {n}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '32px 34px', borderRadius: 20, border: '1px solid rgba(20,55,94,.12)', background: '#fff', boxShadow: '0 18px 44px -34px rgba(16,19,40,.4)' }}>
          {!sent ? (
            <div>
              <h3 style={{ margin: 0, fontSize: 22 }}>Apply to join the team</h3>
              <p style={{ margin: '8px 0 24px', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.6)' }}>One form for every role. We reply to the ones we can place.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {FIELDS.map(([key, label, placeholder, long]) => (
                  <label className="field" key={key}>
                    <span>{label}</span>
                    {long ? (
                      <textarea rows={4} value={form[key]} onChange={setField(key)} placeholder={placeholder} />
                    ) : (
                      <input type="text" value={form[key]} onChange={setField(key)} placeholder={placeholder} />
                    )}
                  </label>
                ))}
                <label className="field">
                  <span>Upload your CV</span>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 11,
                      border: '1px dashed rgba(20,55,94,.28)', background: '#FBF9F5', cursor: 'pointer', position: 'relative',
                    }}
                  >
                    <span style={{ flex: 'none', width: 34, height: 34, borderRadius: 10, background: '#fff', border: '1px solid rgba(20,55,94,.12)', color: '#2E9E45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600 }}>
                      ↑
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: '#14375E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cvName || 'Choose a file'}
                      </span>
                      <span style={{ fontSize: 11.5, color: 'rgba(20,55,94,.5)' }}>PDF or Word document, up to 5MB</span>
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={pickCv}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                  </div>
                </label>
                <button type="button" className="btn btn-primary" style={{ marginTop: 6, padding: '14px 20px', fontSize: 14.5 }} onClick={() => setSent(true)}>
                  Submit application
                </button>
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, color: 'rgba(20,55,94,.5)' }}>Your CV is attached to the application in the dashboard. No email needed.</p>
              </div>
            </div>
          ) : (
            <div style={{ padding: '26px 0', animation: 'gvIn .3s ease both' }}>
              <span style={{ width: 42, height: 42, borderRadius: 13, background: '#2E9E45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
                ✓
              </span>
              <h3 style={{ margin: '18px 0 0', fontSize: 22 }}>Application received</h3>
              <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.7, color: 'rgba(20,55,94,.66)' }}>
                Thank you. We keep it on file and will call the number you left when a matching role opens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
