import { Dialog, DialogContent } from '@gavikina/ui';
import { closeModal, openAssess, useModalState } from '../store/modal';
import SolarCalculator from './SolarCalculator';
import FullAssessment from './FullAssessment';

export default function Modal() {
  const { kind, prefillSelection } = useModalState();

  const title = kind === 'calc' ? 'Solar calculator' : 'Full assessment — AI lead qualifier';
  const maxWidth = kind === 'calc' ? 1080 : 1120;

  return (
    <Dialog open={!!kind} onOpenChange={(open) => !open && closeModal()}>
      {kind && (
        <DialogContent title={title} maxWidth={maxWidth}>
          {kind === 'calc' && <SolarCalculator onAssessment={openAssess} />}
          {kind === 'assess' && <FullAssessment initialSelection={prefillSelection} />}
        </DialogContent>
      )}
    </Dialog>
  );
}
