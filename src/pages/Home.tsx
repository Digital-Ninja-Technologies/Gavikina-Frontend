import { useNavigate } from 'react-router-dom';
import ImageSlot from '../components/ImageSlot';
import Reveal from '../components/Reveal';
import SolarCalculator from '../components/SolarCalculator';
import { useModal } from '../context/ModalContext';
import { fmtRange, TIERS } from '../lib/engine';
import { HERO_SLOTS, PROJECTS } from '../lib/content';

const VALUE_PROPS = [
  { icon: '⌁', title: 'Sized from a measured load', body: 'We add up what you actually run, add engineering headroom, then pick the tier. No guessing from your house size.' },
  { icon: '₦', title: 'Cheaper than the generator', body: 'Most customers are already spending a system every few years on fuel. The assessment shows you that comparison in your own numbers.' },
  { icon: '✓', title: 'One team, start to finish', body: 'The engineer who sizes your system is the one who commissions it, and the one you call afterwards.' },
];

const HERO_FACTS = [
  { value: '1.5–10kVA', label: 'Five system tiers, sized from your real load' },
  { value: 'Free', label: 'Site inspection before any quote is fixed' },
  { value: 'One price', label: 'Panels, inverter, batteries, install, commissioning' },
];

const STEPS_SHORT = [
  { num: '01', title: 'Size it', body: 'Use the calculator, or go straight to the full assessment.' },
  { num: '02', title: 'Inspect', body: 'An engineer visits, measures the load and checks the roof.' },
  { num: '03', title: 'Install', body: 'Mounting, wiring, protection and commissioning by our team.' },
  { num: '04', title: 'Aftercare', body: 'Warranty registered in your name, and we stay reachable.' },
];

const KEN_ANIM = ['gvKenA', 'gvKenB', 'gvKenA', 'gvKenB'];
const KEN_DELAY = ['0s', '-24s', '-16s', '-8s'];

export default function Home() {
  const navigate = useNavigate();
  const { openCalc, openAssess } = useModal();
  const homeProjects = PROJECTS.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section style={{ background: '#101328', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              'linear-gradient(rgba(46,158,69,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(46,158,69,.16) 1px,transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 80% at 15% 30%,#000,transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -140,
            right: -60,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%,rgba(245,166,35,.3),rgba(245,166,35,0) 66%)',
          }}
        />
        <div
          className="container"
          style={{
            position: 'relative',
            padding: '88px 32px 96px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,.85fr)',
            gap: 60,
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#F5A623' }}>
              <span style={{ width: 22, height: 1, background: '#F5A623' }} />
              Homes &amp; businesses across Nigeria
            </span>
            <h1 className="hero-h1" style={{ margin: '20px 0 0' }}>Stop renting your power from a generator.</h1>
            <p style={{ margin: '22px 0 0', fontSize: 17.5, lineHeight: 1.65, color: 'rgba(255,255,255,.68)', maxWidth: '52ch' }}>
              We design, install and maintain solar systems sized to what you actually run. Size yours in ninety seconds — no contact details
              required.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary btn-lg" onClick={openCalc}>
                Size my system
              </button>
              <button type="button" className="btn btn-outline-dark btn-lg" onClick={() => openAssess()}>
                Take the full assessment
              </button>
            </div>
            <div style={{ display: 'flex', gap: 34, marginTop: 52, flexWrap: 'wrap' }}>
              {HERO_FACTS.map((f) => (
                <div className="stat" key={f.label}>
                  <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: '#fff' }}>{f.value}</span>
                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.5)', maxWidth: '20ch', lineHeight: 1.4 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
              {HERO_SLOTS.map((slot, i) => (
                <div key={slot.id} style={{ position: 'absolute', inset: 0, animation: `${KEN_ANIM[i]} 32s ease-in-out infinite`, animationDelay: KEN_DELAY[i], willChange: 'transform,opacity' }}>
                  <ImageSlot {...slot} />
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: -26, left: -26, zIndex: 2, background: '#fff', color: '#14375E', borderRadius: 15, padding: '16px 20px', boxShadow: '0 22px 44px -18px rgba(16,19,40,.55)', maxWidth: 230 }}>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,55,94,.45)' }}>Typical outcome</span>
              <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.5, fontWeight: 500 }}>A 3.5kVA system replaces the generator for most two-bedroom homes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="container" style={{ padding: '80px 32px 20px' }}>
        <div className="grid grid-3">
          {VALUE_PROPS.map((v, i) => (
            <Reveal key={v.title} delay={i * 60}>
              <div className="card" style={{ padding: 28 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 11, background: 'rgba(46,158,69,.1)', color: '#2E9E45', fontSize: 16, fontWeight: 600 }}>
                  {v.icon}
                </span>
                <h3 style={{ margin: '18px 0 0', fontSize: 18 }}>{v.title}</h3>
                <p style={{ margin: '9px 0 0', fontSize: 14, lineHeight: 1.65, color: 'rgba(20,55,94,.62)' }}>{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CALCULATOR TEASER */}
      <section className="section-cream" style={{ marginTop: 80, padding: '78px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30, flexWrap: 'wrap', marginBottom: 34 }}>
            <div>
              <span className="eyebrow">Solar calculator</span>
              <h2 className="h2" style={{ margin: '12px 0 0', maxWidth: '22ch' }}>Size your system without leaving this page.</h2>
            </div>
          </div>
          <SolarCalculator onAssessment={openAssess} />
        </div>
      </section>

      {/* TIERS */}
      <section className="container" style={{ padding: '82px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30, flexWrap: 'wrap', marginBottom: 32 }}>
          <div>
            <span className="eyebrow">System tiers</span>
            <h2 className="h2" style={{ margin: '12px 0 0' }}>Five sizes. One honest price range each.</h2>
          </div>
          <button type="button" className="btn btn-outline btn-md" onClick={() => navigate('/catalogue')}>
            See the full catalogue →
          </button>
        </div>
        <div className="grid grid-5">
          {TIERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 50}>
              <div className="card" style={{ padding: '22px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-.03em' }}>{t.name}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#2E9E45' }}>{fmtRange(t)}</span>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'rgba(20,55,94,.6)', flex: 1 }}>{t.notes}</p>
                <button type="button" className="btn-ghost" style={{ padding: '9px 0', borderTop: '1px solid rgba(20,55,94,.1)', fontSize: 12.5, textAlign: 'left' }} onClick={openCalc}>
                  Check my fit →
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RECENT PROJECTS */}
      <section className="container" style={{ padding: '82px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30, flexWrap: 'wrap', marginBottom: 30 }}>
          <h2 className="h2">Recently commissioned</h2>
          <button type="button" className="btn btn-outline btn-md" onClick={() => navigate('/projects')}>
            All past projects →
          </button>
        </div>
        <div className="grid grid-3">
          {homeProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 16, overflow: 'hidden', background: '#F2EDE3' }}>
                  <ImageSlot src={p.src} placeholder={p.placeholder} credit={p.credit} creditHref={p.creditHref} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
                  <span style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-.01em' }}>{p.title}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#2E9E45', whiteSpace: 'nowrap' }}>{p.system_size}</span>
                </div>
                <span style={{ fontSize: 12.5, color: 'rgba(20,55,94,.55)' }}>{p.location}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="container" style={{ padding: '82px 32px 0' }}>
        <h2 className="h2" style={{ marginBottom: 34 }}>From first call to power on</h2>
        <div className="grid grid-4" style={{ gap: 0, borderTop: '1px solid rgba(20,55,94,.12)' }}>
          {STEPS_SHORT.map((s) => (
            <div key={s.num} style={{ padding: '24px 24px 24px 0', borderRight: '1px solid rgba(20,55,94,.08)' }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#F5A623', letterSpacing: '.1em' }}>{s.num}</span>
              <h3 style={{ margin: '12px 0 0', fontSize: 16.5 }}>{s.title}</h3>
              <p style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.6)' }}>{s.body}</p>
            </div>
          ))}
        </div>
        <button type="button" className="btn-ghost" style={{ marginTop: 26, fontSize: 13.5 }} onClick={() => navigate('/how-it-works')}>
          The full process, step by step →
        </button>
      </section>

      {/* CTA */}
      <section style={{ margin: '90px 0 0', background: '#14375E', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -160, left: '40%', width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,rgba(46,158,69,.4),rgba(46,158,69,0) 68%)' }} />
        <div className="container" style={{ position: 'relative', padding: '76px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 44, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, letterSpacing: '-.032em', maxWidth: '22ch', lineHeight: 1.12 }}>
              Ready for the number that comes with a plan?
            </h2>
            <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.68)', maxWidth: '50ch' }}>
              The full assessment adds your backup hours and fuel spend, then gives you a personalised recommendation and a free site inspection.
            </p>
          </div>
          <button type="button" className="btn btn-amber btn-lg" style={{ flex: 'none' }} onClick={() => openAssess()}>
            Start the full assessment
          </button>
        </div>
      </section>
    </div>
  );
}
