import FullAssessment from '../components/FullAssessment';

export default function AssessmentPage() {
  return (
    <div className="page-hero" style={{ maxWidth: 1160 }}>
      <span className="eyebrow">Full assessment</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '22ch' }}>Ten minutes for a real recommendation.</h1>
      <p style={{ margin: '16px 0 34px', fontSize: 16, lineHeight: 1.7, color: 'rgba(20,55,94,.65)', maxWidth: '58ch' }}>
        Your size, your price range, and how it compares to what you already spend on fuel. We ask for your details only after you have
        seen the result.
      </p>
      <FullAssessment />
    </div>
  );
}
