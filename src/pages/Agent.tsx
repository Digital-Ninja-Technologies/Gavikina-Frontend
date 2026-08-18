import { useRef, useState } from 'react';

const AGENT_FACTS = [
  { label: 'What you do', body: 'Introduce customers, help them complete the assessment, attend the inspection.' },
  { label: 'What you earn', body: 'A commission on each commissioned system, tiered by system size.' },
  { label: 'When it is paid', body: 'After commissioning and final payment, in the following payment run.' },
  { label: 'What we provide', body: 'Training, the assessment tool, and an engineer on every site visit.' },
];

const AGENT_REQS = [
  'A defined area you know well and can cover on the ground',
  'A phone number you answer and a willingness to attend inspections',
  'Any sales, electrical or construction background is an advantage, not a requirement',
  'Completion of our two-day product and assessment training before your first introduction',
];

interface AgentForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  occupation: string;
  reason: string;
}

const FIELDS: [keyof AgentForm, string, string, boolean][] = [
  ['name', 'Full name', 'Your name', false],
  ['email', 'Email address', 'you@email.com', false],
  ['phone', 'Phone number', '0803 000 0000', false],
  ['location', 'Where are you based?', 'Area and state', false],
  ['occupation', 'Current occupation', 'What you do now', false],
  ['reason', 'Why do you want to join?', 'Tell us about your network and why this fits', true],
];

export default function Agent() {
  const [form, setForm] = useState<AgentForm>({ name: '', email: '', phone: '', location: '', occupation: '', reason: '' });
  const [sent, setSent] = useState(false);
  const [aiText, setAiText] = useState('');
  const [typing, setTyping] = useState(false);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setField = (key: keyof AgentForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const buildNote = () => {
    const where = form.location.trim();
    const job = form.occupation.trim();
    let t = 'Thanks' + (form.name ? ', ' + form.name.trim().split(/\s+/)[0] : '') + '. ';
    t += where
      ? 'You are the first applicant we have from ' + where + ', so an introduction there would open ground we do not cover yet. '
      : 'Tell us your area when we call — coverage is how we prioritise agents. ';
    if (job) {
      t += 'Coming from ' + job.toLowerCase() + ', the part of the training that will matter most for you is load assessment: getting the appliance list right is what makes a quote hold. ';
    }
    t += 'Next step is a 15-minute call to confirm your area and book you onto the two-day training. Agents who complete it usually place their first introduction within three weeks.';
    return t;
  };

  const submit = () => {
    setSent(true);
    const full = buildNote();
    let i = 0;
    setAiText('');
    setTyping(true);
    if (typeRef.current) clearInterval(typeRef.current);
    typeRef.current = setInterval(() => {
      i += 3;
      if (i >= full.length) {
        if (typeRef.current) clearInterval(typeRef.current);
        setAiText(full);
        setTyping(false);
      } else {
        setAiText(full.slice(0, i));
      }
    }, 16);
  };

  return (
    <div className="page-hero">
      <span className="eyebrow">Become an agent</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '22ch' }}>Sell power in your own neighbourhood.</h1>
      <div className="split" style={{ marginTop: 44 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(20,55,94,.7)', maxWidth: '58ch' }}>
            Agents introduce customers, walk them through the assessment, and hand the site over to our engineers. You do not carry stock,
            quote prices or handle installation — you find the homes and businesses that are ready and stay with them until commissioning.
          </p>
          <div className="grid grid-2" style={{ marginTop: 34 }}>
            {AGENT_FACTS.map((a) => (
              <div key={a.label} className="card" style={{ padding: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.11em', textTransform: 'uppercase', color: 'rgba(20,55,94,.45)' }}>{a.label}</span>
                <p style={{ margin: '9px 0 0', fontSize: 14.5, lineHeight: 1.6, fontWeight: 500, color: '#14375E' }}>{a.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30, padding: '26px 28px', borderRadius: 16, background: '#F2EDE3' }}>
            <h3 style={{ margin: 0, fontSize: 17 }}>What we ask of you</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14 }}>
              {AGENT_REQS.map((r) => (
                <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.75)' }}>
                  <span style={{ flex: 'none', marginTop: 5, width: 5, height: 5, borderRadius: '50%', background: '#2E9E45' }} />
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 34px', borderRadius: 20, border: '1px solid rgba(20,55,94,.12)', background: '#fff', boxShadow: '0 18px 44px -34px rgba(16,19,40,.4)' }}>
          {!sent ? (
            <div>
              <h3 style={{ margin: 0, fontSize: 22 }}>Apply to become an agent</h3>
              <p style={{ margin: '8px 0 24px', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.6)' }}>We review applications weekly and call the ones that fit.</p>
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
                <button type="button" className="btn btn-primary" style={{ marginTop: 6, padding: '14px 20px', fontSize: 14.5 }} onClick={submit}>
                  Submit application
                </button>
                <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, color: 'rgba(20,55,94,.5)' }}>
                  Goes to the dashboard tagged as an agent application, separate from customer enquiries.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: '26px 0', animation: 'gvIn .3s ease both' }}>
              <span style={{ width: 42, height: 42, borderRadius: 13, background: '#2E9E45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
                ✓
              </span>
              <h3 style={{ margin: '18px 0 0', fontSize: 22 }}>Application received</h3>
              <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.7, color: 'rgba(20,55,94,.66)' }}>
                Thank you. We review weekly and will call the number you left if there is a fit in your area.
              </p>
              <div style={{ marginTop: 18, padding: '20px 22px', borderRadius: 16, border: '1px solid rgba(46,158,69,.3)', background: 'rgba(46,158,69,.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: '#2E9E45', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>G</span>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#14602A' }}>First read on your application</span>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: '#14375E', minHeight: 76 }}>
                  {aiText}
                  <span style={{ display: typing ? 'inline' : 'none', animation: typing ? 'gvcaret 1s step-end infinite' : 'none', color: '#2E9E45', marginLeft: 1 }}>▌</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
