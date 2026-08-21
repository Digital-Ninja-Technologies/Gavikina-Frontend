import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LEADS, naira, viewInfo } from '../lib/data';
import type {Lead} from '../lib/data';
import { csvFor, download, tagColors } from '../lib/utils';

function fieldsFor(open: Lead): [string, string][] {
  const fields: [string, string][] = [];
  if (open.type === 'Customer') {
    fields.push(['Property type', open.property || '']);
    fields.push(['Reason for solar', open.reason || 'Not given']);
    fields.push(['What should the system power?', open.appliances && open.appliances.length ? open.appliances.map((a) => a[0]).join(', ') : 'Not reached']);
    fields.push(['Backup duration', open.backup || 'Not reached']);
    fields.push(['Monthly fuel spend', open.fuel ? naira(open.fuel) : 'Not reached']);
    fields.push(['Preferred payment', open.payment || 'Not reached']);
    fields.push(['Site inspection', open.completed ? (open.inspection ? 'Requested' : 'Not requested') : 'Not reached']);
    fields.push(['Phone', open.phone || 'Not captured — dropped before contact step']);
    fields.push(['Email', open.email || 'Not captured']);
  } else if (open.type === 'Agent') {
    fields.push(['Location', open.area || '']);
    fields.push(['Occupation', open.occupation || '']);
    fields.push(['Phone', open.phone || '']);
    fields.push(['Email', open.email || '']);
    fields.push(['Why they applied', open.reason || '']);
  } else if (open.type === 'Career') {
    fields.push(['Applying for', open.role || '']);
    fields.push(['Location', open.area || '']);
    fields.push(['Phone', open.phone || '']);
    fields.push(['Email', open.email || '']);
    fields.push(['CV', open.cv ? open.cv + ' · download below' : 'Not attached']);
    fields.push(['Relevant experience', open.about || '']);
  } else if (open.type === 'Investor') {
    fields.push(['Phone', open.phone || 'Not given']);
    fields.push(['Email', open.email || 'Not given']);
    fields.push(['What they are looking for', open.message || '']);
  } else {
    fields.push(['Email or phone', open.contact || 'Not given']);
    fields.push(['Message', open.message || '']);
  }
  fields.push(['Received', open.when]);
  return fields;
}

interface EnquiryDetailViewProps {
  view: string;
  id: string;
}

export default function EnquiryDetailView({ view, id }: EnquiryDetailViewProps) {
  const navigate = useNavigate();
  const open = useMemo(() => LEADS.find((l) => l.id === id), [id]);
  if (!open) return null;

  const [title] = viewInfo(view);
  const [tagColor, tagBg] = tagColors(open.type);
  const detailFields = fieldsFor(open);
  const totalWatts = open.appliances ? open.appliances.reduce((n, a) => n + a[2], 0) : 0;

  const downloadCv = () => {
    const body =
      'CV placeholder for ' + open.name + '\n\nRole applied for: ' + open.role +
      '\nLocation: ' + open.area + '\nPhone: ' + open.phone + '\nEmail: ' + open.email +
      '\nSubmitted: ' + open.when + '\n\n' + open.about + '\n\nIn the live build this button serves the file the applicant uploaded.';
    download((open.cv || 'cv').replace(/\.pdf$/, '') + '.txt', body);
  };

  const detailMeta =
    open.type === 'Customer'
      ? (open.completed ? 'Completed assessment · ' + open.when : 'Abandoned assessment · last activity ' + open.when)
      : open.type + ' enquiry · ' + open.when;

  const phoneHref = open.phone ? 'tel:' + open.phone.replace(/\s/g, '') : '#';
  const mailTarget = open.email || (open.contact && open.contact.indexOf('@') > -1 ? open.contact : '');
  const mailHref = mailTarget ? 'mailto:' + mailTarget : '#';
  const statusNote = open.phone || open.email || open.contact
    ? 'Contact details captured. Reach out using the details above.'
    : 'No contact details were captured before drop-off. Only the entered assessment data is available.';

  return (
    <div className="animate-gv-fade">
      <button
        type="button"
        className="border-0 bg-transparent p-0 text-[13px] font-medium text-navy/65 hover:text-navy"
        onClick={() => navigate({ to: '/enquiries/$view', params: { view } })}
      >
        ← Back to {title}
      </button>
      <div className="mt-3.5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-md px-2 py-1 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: tagColor, background: tagBg }}>
            {open.type}
          </span>
          <h1 className="m-0 mt-3 text-[27px] font-semibold tracking-tight">{open.name}</h1>
          <p className="mt-2 text-sm text-navy/58">{detailMeta}</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-navy/16 bg-white px-4 py-2.5 text-[13px] font-medium hover:bg-cream"
          onClick={() => download('gavikina-' + open.id + '.csv', csvFor([open]))}
        >
          Download CSV
        </button>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6 max-[900px]:grid-cols-1">
        <div className="flex flex-col gap-5">
          {open.type === 'Customer' && (
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-navy/10 bg-white p-5.5 max-[560px]:grid-cols-1">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">Calculated size</span>
                <div className="mt-1 text-[31px] font-semibold tracking-tight">{open.size}</div>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">Price range</span>
                <div className="mt-1 text-[19px] font-semibold tracking-tight">{open.price}</div>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">Fuel spend</span>
                <div className="mt-1 text-[19px] font-semibold tracking-tight">{open.fuel ? naira(open.fuel) + ' / mo' : 'Not reached'}</div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-navy/10 bg-white">
            {detailFields.map(([label, value], i) => (
              <div key={label} className={'flex flex-wrap items-baseline justify-between gap-2 px-5.5 py-3.5' + (i > 0 ? ' border-t border-navy/8' : '')}>
                <span className="text-[12.5px] text-navy/55">{label}</span>
                <span className="max-w-100 text-right text-[13.5px] font-medium">{value}</span>
              </div>
            ))}
          </div>

          {open.cv && (
            <div className="flex items-center gap-3.5 rounded-2xl border border-navy/10 bg-white p-4.5">
              <span className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-xl bg-cream text-[11px] font-bold text-navy/70">
                {(open.cv.split('.').pop() || 'file').toUpperCase()}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[13.5px] font-medium">{open.cv}</span>
                <span className="text-xs text-navy/55">CV attached to this application · {open.cvSize}</span>
              </div>
              <button type="button" className="flex-none rounded-xl border-0 bg-green px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-green-dark" onClick={downloadCv}>
                Download CV
              </button>
            </div>
          )}

          {open.appliances && open.appliances.length > 0 && (
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <h2 className="m-0 text-base font-semibold tracking-tight">Appliances selected</h2>
              <div className="mt-3.5 flex flex-col gap-2">
                {open.appliances.map((a) => (
                  <div key={a[0]} className="flex items-center gap-3 border-b border-navy/6 pb-2 text-[13px] last:border-b-0">
                    <span className="min-w-0 flex-1">{a[0]}</span>
                    <span className="text-navy/55">× {a[1]}</span>
                    <span className="w-20 text-right tabular-nums text-navy/75">{a[2].toLocaleString()}W</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-navy/10 pt-3 text-sm font-semibold">
                <span>Total load</span>
                <span className="tabular-nums">{totalWatts.toLocaleString()}W</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4.5">
          {open.ai && (
            <div className="rounded-2xl border border-green/25 bg-green/5 p-5.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/50">
                {open.type === 'Agent' ? 'AI first read shown to applicant' : 'AI note shown to customer'}
              </span>
              <p className="mt-2.75 text-[13.5px] leading-relaxed text-navy/80">{open.ai}</p>
            </div>
          )}
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <h2 className="m-0 text-base font-semibold tracking-tight">Status</h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-navy/65">{statusNote}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={phoneHref} className="rounded-xl bg-green px-4 py-2.75 text-center text-[13px] font-semibold text-white no-underline hover:bg-green-dark">
                Call {open.phone || 'unavailable'}
              </a>
              <a href={mailHref} className="rounded-xl border border-navy/16 px-4 py-2.75 text-center text-[13px] font-semibold text-navy no-underline hover:bg-cream">
                Send an email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
