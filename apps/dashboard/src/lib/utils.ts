import { naira   } from './data';
import type {Lead, LeadType} from './data';

export function csvFor(list: Lead[]) {
  const head = ['Type', 'Name', 'Phone', 'Email', 'Email or phone', 'Area', 'Role applied for', 'CV file', 'Property', 'Reason', 'Backup', 'Monthly fuel spend', 'Calculated size', 'Price range', 'Preferred payment', 'Inspection requested', 'Completed', 'Appliances', 'Message / AI note', 'Received'];
  const cell = (v: unknown) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const lines = [head.map(cell).join(',')];
  list.forEach((l) => {
    lines.push(
      [
        l.type, l.name, l.phone, l.email, l.contact, l.area, l.role, l.cv, l.property, l.reason, l.backup,
        l.fuel ? naira(l.fuel) : '', l.size, l.price, l.payment,
        l.type === 'Customer' ? (l.inspection ? 'Yes' : 'No') : '',
        l.type === 'Customer' ? (l.completed ? 'Yes' : 'No') : '',
        (l.appliances || []).map((a) => a[0] + ' ×' + a[1]).join('; '),
        l.message || l.about || l.reason || l.ai || '', l.when,
      ].map(cell).join(',')
    );
  });
  return lines.join('\n');
}

export function download(name: string, text: string) {
  try {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } catch {
    /* download blocked — nothing else to do in the prototype */
  }
}

export function summaryOf(l: Lead) {
  if (l.type === 'Customer') return l.size + (l.completed ? '' : ' · partial');
  if (l.type === 'Agent') return l.occupation;
  if (l.type === 'Investor') return 'Requested materials';
  if (l.type === 'Career') return l.role;
  return 'Contact form';
}

const TAG_COLORS: Record<LeadType, [string, string]> = {
  Customer: ['#14602A', 'rgba(46,158,69,.13)'],
  Agent: ['#B57B00', 'rgba(245,166,35,.17)'],
  Investor: ['#14375E', 'rgba(20,55,94,.1)'],
  Career: ['#5A3E9B', 'rgba(90,62,155,.12)'],
  Contact: ['rgba(20,55,94,.6)', 'rgba(20,55,94,.07)'],
};
export function tagColors(type: LeadType) {
  return TAG_COLORS[type];
}
