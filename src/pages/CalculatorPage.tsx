import SolarCalculator from '../components/SolarCalculator';
import { useModal } from '../context/ModalContext';

export default function CalculatorPage() {
  const { openAssess } = useModal();
  return (
    <div className="page-hero">
      <span className="eyebrow">Solar calculator</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '22ch' }}>What size do you actually need?</h1>
      <p style={{ margin: '16px 0 34px', fontSize: 16, lineHeight: 1.7, color: 'rgba(20,55,94,.65)', maxWidth: '58ch' }}>
        Pick your appliances. We compute the load, add engineering headroom, and match it to a system tier — the same calculation an
        engineer runs on site.
      </p>
      <SolarCalculator onAssessment={openAssess} />
    </div>
  );
}
