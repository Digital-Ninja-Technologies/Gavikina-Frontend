import { useModal } from '../context/ModalContext';

const STEPS_LONG = [
  { num: '01', title: 'Tell us what you run', body: 'The assessment walks you through property type, appliances, how long you need to run without the grid, and what you currently spend on fuel. You see the recommendation before we ask for your name.', meta: 'Ten minutes, online' },
  { num: '02', title: 'We call to book the inspection', body: 'An engineer calls to confirm what you entered and agree a visit. Nothing is charged and nothing is ordered at this stage.', meta: 'Within one working day' },
  { num: '03', title: 'Site inspection', body: 'We measure the real load at the board, assess the roof or ground area, check cable runs and shading, and confirm where the batteries and inverter will live.', meta: 'Free, about two hours' },
  { num: '04', title: 'Fixed quote', body: 'You get a single figure, a component list with brands and warranties, and a payment schedule. The figure does not move after this point unless you change the scope.', meta: 'Within two working days' },
  { num: '05', title: 'Installation and commissioning', body: 'Mounting, DC and AC wiring, protection devices, and full commissioning with you present. We hand over the as-built drawing and register every warranty in your name.', meta: 'One to three days for most homes' },
  { num: '06', title: 'Aftercare', body: 'Workmanship faults are ours to fix. Components carry manufacturer cover we registered for you. Call the same number you called at the start.', meta: 'Ongoing' },
];

export default function HowItWorks() {
  const { openAssess } = useModal();
  return (
    <div className="page-hero">
      <span className="eyebrow">How it works</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '20ch' }}>Six steps, and then it just runs.</h1>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 48, maxWidth: 880 }}>
        {STEPS_LONG.map((s, i) => (
          <div key={s.num} style={{ display: 'grid', gridTemplateColumns: '74px minmax(0,1fr)', gap: 28, padding: '0 0 38px', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: '#101328', color: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, flex: 'none', zIndex: 1 }}>
                {s.num}
              </span>
              {i < STEPS_LONG.length - 1 && <span style={{ flex: 1, width: 1, background: 'rgba(20,55,94,.13)', marginTop: 6 }} />}
            </div>
            <div style={{ paddingTop: 8 }}>
              <h3 style={{ margin: 0, fontSize: 22 }}>{s.title}</h3>
              <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.72, color: 'rgba(20,55,94,.66)', maxWidth: '60ch' }}>{s.body}</p>
              <span style={{ display: 'inline-block', marginTop: 10, fontSize: 12.5, fontWeight: 600, color: '#2E9E45' }}>{s.meta}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: '34px 38px', borderRadius: 20, background: '#F2EDE3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 22 }}>Start at step one now</h3>
          <p style={{ margin: '8px 0 0', fontSize: 14.5, color: 'rgba(20,55,94,.65)', maxWidth: '46ch' }}>
            The assessment is the enquiry. Ten minutes, and an engineer calls to book the inspection.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-lg" style={{ flex: 'none' }} onClick={() => openAssess()}>
          Take the full assessment
        </button>
      </div>
    </div>
  );
}
