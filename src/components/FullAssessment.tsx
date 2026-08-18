import { useEffect, useMemo, useRef, useState } from 'react';
import {
  APPLIANCES,
  BACKUP_OPTIONS,
  PAYMENT_METHODS,
  REASONS,
  fmt,
  fuelCompare,
  size,
  type Selection,
} from '../lib/engine';

const STEPS = ['Property type', 'Your reason', 'Appliances', 'Backup duration', 'Fuel spend', 'Recommendation', 'Your details', 'Payment & inspection'];
const DRAFT_KEY = 'gv_assessment_draft_v1';

interface FullAssessmentProps {
  initialSelection?: Selection;
}

interface Draft {
  step: number;
  property: string | null;
  reason: string | null;
  sel: Selection;
  backup: string | null;
  fuel: number;
  name: string;
  phone: string;
  email: string;
  payment: string | null;
  inspection: boolean;
  done: boolean;
}

export default function FullAssessment({ initialSelection }: FullAssessmentProps) {
  const [step, setStep] = useState(0);
  const [property, setProperty] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [sel, setSel] = useState<Selection>(initialSelection || {});
  const [backup, setBackup] = useState<string | null>(null);
  const [fuel, setFuel] = useState(60000);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [payment, setPayment] = useState<string | null>(null);
  const [inspection, setInspection] = useState(true);
  const [aiText, setAiText] = useState('');
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d: Draft = JSON.parse(raw);
        if (d && d.step > 0 && !d.done) {
          setStep(d.step);
          setProperty(d.property);
          setReason(d.reason);
          setSel(d.sel || {});
          setBackup(d.backup);
          setFuel(d.fuel);
          setName(d.name || '');
          setPhone(d.phone || '');
          setEmail(d.email || '');
          setPayment(d.payment);
          setInspection(d.inspection);
        }
      }
    } catch {
      /* ignore corrupt draft */
    }
    return () => {
      if (typeRef.current) clearInterval(typeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, property, reason, sel, backup, fuel, name, phone, email, payment, inspection, done, updated: Date.now() })
      );
    } catch {
      /* storage unavailable */
    }
  }, [step, property, reason, sel, backup, fuel, name, phone, email, payment, inspection, done]);

  const bump = (id: string, d: number, dflt: number) => {
    setSel((cur) => {
      const curQty = cur[id] || 0;
      const next = curQty === 0 && d > 0 ? dflt : Math.max(0, curQty + d);
      const nextSel = { ...cur };
      if (next === 0) delete nextSel[id];
      else nextSel[id] = next;
      return nextSel;
    });
  };

  const backupHours = () => BACKUP_OPTIONS.find((b) => b.id === backup)?.hours ?? 8;
  const backupLabel = () => BACKUP_OPTIONS.find((b) => b.id === backup)?.label ?? '8 hours';

  const aiNote = () => {
    const r = size(sel, backupHours());
    if (!r.tier) return 'Add a few appliances and we will explain what your system does for you.';
    const c = fuelCompare(fuel, r.tier);
    const reasonLabel = REASONS.find((x) => x.id === reason)?.label || '';
    const place = property === 'business' ? 'your business' : 'your home';
    let t =
      'A ' + r.tier.name + ' system covers the ' + r.watts.toLocaleString() + 'W of load you listed for ' + place +
      ', with enough battery to carry you through ' + backupLabel().toLowerCase() + ' of no grid supply. ';
    if (c && fuel > 0) {
      t +=
        'You are spending about ' + fmt(c.annualSpend) + ' a year on fuel. At that rate the system pays for itself in roughly ' +
        Math.round((c.paybackMonths / 12) * 10) / 10 + ' years, and over five years you keep about ' + fmt(c.fiveYearSaving) +
        ' that would otherwise go into the generator. ';
    }
    if (reasonLabel) t += 'Given that ' + reasonLabel.toLowerCase() + ', this size gives you room to grow without over-buying panels. ';
    t += 'An engineer will confirm the roof, the wiring and the final figure on site.';
    return t;
  };

  const startTyping = () => {
    if (typeRef.current) clearInterval(typeRef.current);
    const full = aiNote();
    let i = 0;
    setAiText('');
    setTyping(true);
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

  const go = (n: number) => {
    const next = Math.max(0, Math.min(7, n));
    setStep(next);
    if (next === 5) setTimeout(() => startTyping(), 260);
  };

  const canAdvance = () => {
    if (step === 0) return !!property;
    if (step === 1) return !!reason;
    if (step === 2) return Object.keys(sel).length > 0;
    if (step === 3) return !!backup;
    if (step === 6) return name.trim().length > 1 && phone.trim().length > 5 && /.+@.+\..+/.test(email.trim());
    if (step === 7) return !!payment;
    return true;
  };

  const hours = backupHours();
  const result = useMemo(() => size(sel, hours), [sel, hours]);
  const compare = useMemo(() => fuelCompare(fuel, result.tier), [fuel, result.tier]);
  const effectiveStep = done ? 8 : step;
  const nextEnabled = canAdvance();
  const lastStep = step === 7;

  const groups = useMemo(() => {
    const cats = [...new Set(APPLIANCES.map((a) => a.category))].filter((cat) => property === 'business' || cat !== 'Business');
    return cats.map((cat) => ({ name: cat, items: APPLIANCES.filter((a) => a.category === cat) }));
  }, [property]);

  const compareRows = compare
    ? [
        { label: 'Fuel today', value: fmt(compare.monthlySpend) + '/mo' },
        { label: 'Fuel over five years', value: fmt(compare.fiveYearSpend) },
        { label: 'System pays back in', value: Math.round(compare.paybackMonths) + ' months' },
        { label: 'Kept over five years', value: fmt(compare.fiveYearSaving) },
      ]
    : [{ label: 'Enter a fuel spend to compare', value: '—' }];

  const restart = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setStep(0);
    setDone(false);
    setProperty(null);
    setReason(null);
    setSel({});
    setBackup(null);
    setName('');
    setPhone('');
    setEmail('');
    setPayment(null);
    setAiText('');
  };

  const ref = 'GAV-' + String(2600 + effectiveStep * 7 + Math.min(99, Object.keys(sel).length * 3));
  const nameOrYou = name.trim().split(' ')[0] || 'there';
  const phoneOrSoon = phone.trim() ? 'on ' + phone.trim() : 'shortly';

  return (
    <div className="assess-shell">
      <div className="assess-rail">
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#F5A623' }}>Full assessment</span>
          <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,.55)' }}>Five questions, then your recommendation.</p>
        </div>
        <div className="assess-rail-steps">
          {STEPS.map((label, i) => {
            const active = i === effectiveStep;
            const past = i < effectiveStep;
            return (
              <div
                key={label}
                className="rail-step"
                style={{ background: active ? 'rgba(255,255,255,.09)' : 'transparent', color: active ? '#fff' : past ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.32)' }}
              >
                <span
                  className="rail-dot"
                  style={{
                    background: active ? '#2E9E45' : past ? 'rgba(46,158,69,.28)' : 'rgba(255,255,255,.09)',
                    color: past && !active ? '#8FE0A2' : active ? '#fff' : 'rgba(255,255,255,.45)',
                  }}
                >
                  {past ? '✓' : String(i + 1)}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'rgba(255,255,255,.4)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E9E45' }} />
          {effectiveStep > 0 && effectiveStep < 8 ? 'Progress saved' : 'Nothing saved yet'}
        </div>
      </div>

      <div className="assess-content">
        {step === 0 && !done && (
          <div style={{ animation: 'gvfade .3s ease both' }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>Is this for a home or a business?</h3>
            <p style={{ margin: '8px 0 26px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>It changes which appliances we show you and how we size for peak demand.</p>
            <div className="assess-cards">
              {[
                { id: 'home', label: 'My home', note: 'Flat, duplex or family house' },
                { id: 'business', label: 'My business', note: 'Shop, office, clinic or workshop' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={'assess-card' + (property === o.id ? ' on' : '')}
                  onClick={() => {
                    setProperty(o.id);
                    setTimeout(() => go(1), 160);
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.01em' }}>{o.label}</span>
                  <span style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(20,55,94,.58)' }}>{o.note}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && !done && (
          <div style={{ animation: 'gvfade .3s ease both' }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>Why are you considering solar?</h3>
            <p style={{ margin: '8px 0 26px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>Pick the closest reason. It shapes the recommendation you get at the end.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: 600 }}>
              {REASONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={'assess-pill' + (reason === o.id ? ' on' : '')}
                  onClick={() => {
                    setReason(o.id);
                    setTimeout(() => go(2), 160);
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && !done && (
          <div style={{ animation: 'gvfade .3s ease both', minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>What should the system power?</h3>
            <p style={{ margin: '8px 0 20px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>
              Tap to add, then set quantities. Running total: <strong style={{ color: '#14375E' }}>{result.watts.toLocaleString()}W</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxHeight: 330, overflowY: 'auto', paddingRight: 6 }}>
              {groups.map((group) => (
                <div key={group.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,55,94,.45)' }}>{group.name}</span>
                    <span style={{ flex: 1, height: 1, background: 'rgba(20,55,94,.1)' }} />
                  </div>
                  <div className="assess-chip-group">
                    {group.items.map((item) => {
                      const qty = sel[item.id] || 0;
                      const on = qty > 0;
                      return (
                        <div key={item.id} className={'assess-chip' + (on ? ' on' : '')}>
                          <button
                            type="button"
                            style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'inherit', fontSize: 13, fontWeight: 500 }}
                            onClick={() => bump(item.id, qty > 0 ? -qty : 1, item.default_quantity)}
                          >
                            {item.name}
                          </button>
                          {on && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, paddingLeft: 7, marginLeft: 2, borderLeft: '1px solid rgba(46,158,69,.35)' }}>
                              <button
                                type="button"
                                aria-label="Fewer"
                                style={{ width: 20, height: 20, borderRadius: 6, border: 0, background: 'rgba(46,158,69,.14)', color: '#14602A', fontSize: 13, lineHeight: 1, cursor: 'pointer' }}
                                onClick={() => bump(item.id, -1, item.default_quantity)}
                              >
                                –
                              </button>
                              <span style={{ minWidth: 14, textAlign: 'center', fontSize: 12.5, fontWeight: 600 }}>{qty}</span>
                              <button
                                type="button"
                                aria-label="More"
                                style={{ width: 20, height: 20, borderRadius: 6, border: 0, background: 'rgba(46,158,69,.14)', color: '#14602A', fontSize: 13, lineHeight: 1, cursor: 'pointer' }}
                                onClick={() => bump(item.id, 1, item.default_quantity)}
                              >
                                +
                              </button>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && !done && (
          <div style={{ animation: 'gvfade .3s ease both' }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>How long should it run with no grid supply?</h3>
            <p style={{ margin: '8px 0 26px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>This sets the battery bank, not the panel array.</p>
            <div className="assess-cards">
              {BACKUP_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={'assess-card' + (backup === o.id ? ' on' : '')}
                  onClick={() => {
                    setBackup(o.id);
                    setTimeout(() => go(4), 160);
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.01em' }}>{o.label}</span>
                  <span style={{ fontSize: 12.5, color: 'rgba(20,55,94,.55)' }}>{o.note}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && !done && (
          <div style={{ animation: 'gvfade .3s ease both' }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>What do you spend on generator fuel each month?</h3>
            <p style={{ margin: '8px 0 30px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>Petrol or diesel, your rough average. We compare it against the system cost.</p>
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-.03em' }}>{fmt(fuel)}</span>
                <span style={{ fontSize: 14, color: 'rgba(20,55,94,.5)' }}>per month</span>
              </div>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={fuel}
                onChange={(e) => setFuel(Number(e.target.value))}
                style={{ width: '100%', margin: '22px 0 6px', accentColor: '#2E9E45', height: 6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'rgba(20,55,94,.4)' }}>
                <span>₦0</span>
                <span>₦500,000+</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
                {[20000, 60000, 120000, 250000].map((v) => (
                  <button key={v} type="button" className={'pill-btn' + (fuel === v ? ' active' : '')} onClick={() => setFuel(v)}>
                    {fmt(v)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && !done && (
          <div style={{ animation: 'gvfade .3s ease both', minWidth: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#2E9E45' }}>Your recommendation</span>
            <div className="grid grid-2" style={{ marginTop: 14 }}>
              <div style={{ padding: 22, borderRadius: 16, background: '#101328', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,rgba(245,166,35,.36),rgba(245,166,35,0) 70%)' }} />
                <div style={{ position: 'relative' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>System size</span>
                  <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.05, marginTop: 4 }}>{result.tier ? result.tier.name : '—'}</div>
                  <p style={{ margin: '4px 0 16px', fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>
                    {result.watts.toLocaleString()}W load · {backupLabel()} backup
                  </p>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>Indicative price</span>
                  <div style={{ fontSize: 19, fontWeight: 600, color: '#F5A623', marginTop: 4 }}>
                    {result.tier ? `${fmt(result.tier.price_range_min)} – ${fmt(result.tier.price_range_max)}` : '—'}
                  </div>
                </div>
              </div>
              <div style={{ padding: 22, borderRadius: 16, background: '#F2EDE3', border: '1px solid rgba(20,55,94,.1)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,55,94,.5)' }}>Against your fuel spend</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 14 }}>
                  {compareRows.map((r) => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingBottom: 9, borderBottom: '1px solid rgba(20,55,94,.09)' }}>
                      <span style={{ fontSize: 12.5, color: 'rgba(20,55,94,.65)', lineHeight: 1.4 }}>{r.label}</span>
                      <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: '20px 22px', borderRadius: 16, border: '1px solid rgba(46,158,69,.3)', background: 'rgba(46,158,69,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: '#2E9E45', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>G</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#14602A' }}>What this means for you</span>
              </div>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: '#14375E', minHeight: 76 }}>
                {aiText}
                <span style={{ animation: typing ? 'gvcaret 1s step-end infinite' : 'none', display: typing ? 'inline' : 'none', color: '#2E9E45', marginLeft: 1 }}>▌</span>
              </p>
            </div>
          </div>
        )}

        {step === 6 && !done && (
          <div style={{ animation: 'gvfade .3s ease both' }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>Where should we send this?</h3>
            <p style={{ margin: '8px 0 26px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>
              Your {result.tier ? result.tier.name : '—'} recommendation is ready. Leave your name, phone number and email, and an engineer will call to
              arrange the site inspection.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
              <label className="field">
                <span>Full name</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adaeze Okonkwo" />
              </label>
              <label className="field">
                <span>Phone number</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" />
              </label>
              <label className="field">
                <span>Email address</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </label>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: 'rgba(20,55,94,.5)' }}>
                We call once to arrange the inspection, and send the written recommendation to your email. No marketing lists.
              </p>
            </div>
          </div>
        )}

        {step === 7 && !done && (
          <div style={{ animation: 'gvfade .3s ease both' }}>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: '-.025em' }}>How would you prefer to pay?</h3>
            <p style={{ margin: '8px 0 24px', fontSize: 14, color: 'rgba(20,55,94,.6)' }}>Nothing is charged here. It tells the engineer what to prepare.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxWidth: 520 }}>
              {PAYMENT_METHODS.map((o) => (
                <button key={o.id} type="button" className={'assess-pill' + (payment === o.id ? ' on' : '')} onClick={() => setPayment(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginTop: 22, maxWidth: 520, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={inspection}
                onChange={() => setInspection((v) => !v)}
                style={{ marginTop: 3, width: 17, height: 17, accentColor: '#2E9E45' }}
              />
              <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.75)' }}>
                Request a free site inspection. An engineer visits, confirms the roof and load, and issues the final quote.
              </span>
            </label>
          </div>
        )}

        {done && (
          <div style={{ animation: 'gvfade .35s ease both', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', flex: 1, maxWidth: 520 }}>
            <span style={{ width: 46, height: 46, borderRadius: 14, background: '#2E9E45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600 }}>
              ✓
            </span>
            <h3 style={{ margin: '20px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: '-.025em' }}>Assessment complete</h3>
            <p style={{ margin: '12px 0 0', fontSize: 15, lineHeight: 1.7, color: 'rgba(20,55,94,.65)' }}>
              Thank you, {nameOrYou}. Your {result.tier ? result.tier.name : '—'} recommendation and everything you entered has gone to our team. An
              engineer will call {phoneOrSoon} to arrange the inspection.
            </p>
            <div style={{ marginTop: 24, padding: '16px 18px', borderRadius: 13, background: '#F2EDE3', fontSize: 13, lineHeight: 1.6, color: 'rgba(20,55,94,.7)' }}>
              Reference <strong style={{ color: '#14375E' }}>{ref}</strong> — quote it when you call us on 0800 GAVIKINA.
            </div>
            <button type="button" className="btn btn-outline btn-md" style={{ marginTop: 24 }} onClick={restart}>
              Run another assessment
            </button>
          </div>
        )}

        {!done && (
          <div className="assess-nav">
            <button
              type="button"
              className="btn"
              style={{
                visibility: step === 0 ? 'hidden' : 'visible',
                padding: '12px 18px',
                borderRadius: 11,
                border: '1px solid rgba(20,55,94,.16)',
                background: 'none',
                color: 'rgba(20,55,94,.7)',
                fontWeight: 500,
                fontSize: 13.5,
              }}
              onClick={() => go(step - 1)}
            >
              ← Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 12.5, color: 'rgba(20,55,94,.45)' }}>Step {step + 1} of 8</span>
              <button
                type="button"
                className="btn"
                disabled={!nextEnabled}
                style={{
                  padding: '13px 24px',
                  borderRadius: 11,
                  background: nextEnabled ? '#2E9E45' : 'rgba(20,55,94,.14)',
                  color: nextEnabled ? '#fff' : 'rgba(20,55,94,.4)',
                  fontSize: 14,
                }}
                onClick={() => {
                  if (!nextEnabled) return;
                  if (lastStep) setDone(true);
                  else go(step + 1);
                }}
              >
                {lastStep ? 'Submit assessment' : step === 5 ? 'Continue' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
