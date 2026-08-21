import { Store, useStore } from '@tanstack/react-store';
import { SEED_PROJECTS  } from '@gavikina/engine';
import type {Project} from '@gavikina/engine';

const PKEY = 'gv-admin-projects-v1';

function loadProjects(): Project[] {
  try {
    const p = localStorage.getItem(PKEY);
    if (p) return JSON.parse(p);
  } catch {
    /* ignore corrupt storage */
  }
  return SEED_PROJECTS;
}

function persist(projects: Project[]) {
  try {
    localStorage.setItem(PKEY, JSON.stringify(projects));
  } catch {
    /* storage unavailable */
  }
}

export const projectsStore = new Store<Project[]>(loadProjects());

export function saveProject(draft: Project) {
  projectsStore.setState((list) => {
    const next = draft.id && list.some((p) => p.id === draft.id)
      ? list.map((p) => (p.id === draft.id ? draft : p))
      : list.concat([{ ...draft, id: draft.id || 'p' + Date.now() }]);
    persist(next);
    return next;
  });
}

export function deleteProject(id: string) {
  projectsStore.setState((list) => {
    const next = list.filter((p) => p.id !== id);
    persist(next);
    return next;
  });
}

export function useProjects() {
  return useStore(projectsStore);
}
