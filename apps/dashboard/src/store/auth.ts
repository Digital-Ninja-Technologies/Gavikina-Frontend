import { Store, useStore } from '@tanstack/react-store';

const AKEY = 'gv-admin-auth-v1';

function loadAuth(): string | null {
  try {
    const a = localStorage.getItem(AKEY);
    if (a) return JSON.parse(a).email || '';
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

export const authStore = new Store<{ email: string | null }>({ email: loadAuth() });

export function signIn(email: string) {
  try {
    localStorage.setItem(AKEY, JSON.stringify({ email }));
  } catch {
    /* storage unavailable */
  }
  authStore.setState(() => ({ email }));
}

export function signOut() {
  try {
    localStorage.removeItem(AKEY);
  } catch {
    /* storage unavailable */
  }
  authStore.setState(() => ({ email: null }));
}

export function useAuth() {
  return useStore(authStore);
}
