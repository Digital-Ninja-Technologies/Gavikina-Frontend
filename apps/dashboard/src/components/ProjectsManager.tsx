import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SIZE_TIERS  } from '@gavikina/engine';
import type {Project} from '@gavikina/engine';
import { projectDraftSchema  } from '@gavikina/schemas';
import type {ProjectDraftValues} from '@gavikina/schemas';
import { Field, Input, Textarea, cn } from '@gavikina/ui';
import { deleteProject, saveProject, useProjects } from '../store/projects';

function emptyDraft(): ProjectDraftValues {
  return { title: '', location: '', size: SIZE_TIERS[2], category: 'home', caseStudy: false, images: 0, body: '' };
}

export default function ProjectsManager() {
  const projects = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<ProjectDraftValues>({
    resolver: zodResolver(projectDraftSchema),
    defaultValues: emptyDraft(),
  });

  const startNew = () => {
    form.reset(emptyDraft());
    setEditingId(null);
    setOpen(true);
  };

  const startEdit = (p: Project) => {
    form.reset(p);
    setEditingId(p.id);
    setOpen(true);
  };

  const onSubmit = form.handleSubmit((values) => {
    saveProject({ ...values, id: editingId || '' });
    setOpen(false);
  });

  const onDelete = () => {
    if (editingId) deleteProject(editingId);
    setOpen(false);
  };

  const images = form.watch('images');

  return (
    <div className="animate-gv-fade">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[27px] font-semibold tracking-tight">Past Projects</h1>
          <p className="mt-2 text-sm text-navy/58">Everything here appears on the public Past Projects page.</p>
        </div>
        <button type="button" className="rounded-xl border-0 bg-green px-4.5 py-2.75 text-[13.5px] font-semibold text-white hover:bg-green-dark" onClick={startNew}>
          Add a project
        </button>
      </div>

      <div className={cn('mt-6 grid gap-5', open ? 'grid-cols-[minmax(0,1fr)_400px] max-[900px]:grid-cols-1' : 'grid-cols-1')}>
        <div className="flex flex-col gap-2.5">
          {projects.map((p) => (
            <div
              key={p.id}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 transition-colors',
                editingId === p.id && open ? 'border-green' : 'border-navy/10 hover:border-navy/20'
              )}
              onClick={() => startEdit(p)}
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium">{p.title}</span>
                <span className="text-xs text-navy/55">
                  {p.location} · {p.size} · {p.category === 'home' ? 'Home' : 'Business'} · {p.images} photo{p.images === 1 ? '' : 's'}
                </span>
              </div>
              <span
                className="flex-none rounded-md px-2.5 py-1 text-[11px] font-semibold"
                style={p.caseStudy ? { color: '#14602A', background: 'rgba(46,158,69,.13)' } : { color: 'rgba(20,55,94,.55)', background: 'rgba(20,55,94,.06)' }}
              >
                {p.caseStudy ? 'Case study' : 'Listed'}
              </span>
            </div>
          ))}
        </div>

        {open && (
          <form onSubmit={onSubmit} noValidate className="h-fit rounded-2xl border border-navy/10 bg-white p-6">
            <h2 className="m-0 text-base font-semibold tracking-tight">{editingId ? 'Edit project' : 'New project'}</h2>
            <div className="mt-4.5 flex flex-col gap-3.5">
              <Field label="Title" error={form.formState.errors.title?.message}>
                <Input type="text" placeholder="Lekki Phase 1 duplex" {...form.register('title')} />
              </Field>
              <Field label="Location" error={form.formState.errors.location?.message}>
                <Input type="text" placeholder="Lekki, Lagos" {...form.register('location')} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="System size">
                  <select {...form.register('size')} className="w-full rounded-[11px] border border-navy/18 bg-white px-3.5 py-3 text-sm text-navy">
                    {SIZE_TIERS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Category">
                  <select {...form.register('category')} className="w-full rounded-[11px] border border-navy/18 bg-white px-3.5 py-3 text-sm text-navy">
                    <option value="home">Home</option>
                    <option value="business">Business</option>
                  </select>
                </Field>
              </div>
              <Field label="Description" error={form.formState.errors.body?.message}>
                <Textarea rows={4} placeholder="What the system covers and how it changed things for the customer." {...form.register('body')} />
              </Field>
              <Field label="Photographs">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="rounded-xl border border-dashed border-navy/25 bg-[#FBFAF8] px-3 py-2.5 text-[12.5px] text-navy/70"
                  onChange={(e) => form.setValue('images', images + (e.target.files?.length || 0))}
                />
              </Field>
              <span className="text-xs text-navy/55">
                {images ? images + ' photograph' + (images === 1 ? '' : 's') + ' attached' : 'No photographs yet — the public page needs at least one.'}
              </span>
              <label className="flex cursor-pointer items-start gap-2.75">
                <input type="checkbox" {...form.register('caseStudy')} className="mt-0.5 h-4 w-4 accent-green" />
                <span className="text-[13px] leading-relaxed text-navy/75">Feature as the detailed case study</span>
              </label>
              <div className="flex items-center gap-2.5 pt-1.5">
                <button type="submit" className="rounded-xl border-0 bg-green px-4.5 py-2.75 text-[13.5px] font-semibold text-white hover:bg-green-dark">
                  Save project
                </button>
                <button type="button" className="rounded-xl border border-navy/16 bg-white px-4.5 py-2.75 text-[13.5px] font-medium" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                {editingId && (
                  <button type="button" className="ml-auto rounded-xl border border-red-200 bg-white px-4.5 py-2.75 text-[13.5px] font-medium text-red-600 hover:bg-red-50" onClick={onDelete}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
