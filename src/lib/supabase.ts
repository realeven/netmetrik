// ============================================================================
// NetMetrik - Supabase Client & Offline-First Data Layer
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('netmetrik_custom_supabase_url') || '' : '';
const localKey = typeof window !== 'undefined' ? localStorage.getItem('netmetrik_custom_supabase_key') || '' : '';

export const supabaseUrl = envUrl || localUrl;
export const supabaseAnonKey = envKey || localKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

export let supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Configure Supabase credentials directly from the app UI or settings
 */
export function setCustomSupabaseConfig(url: string, key: string): boolean {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  if (typeof window !== 'undefined') {
    localStorage.setItem('netmetrik_custom_supabase_url', cleanUrl);
    localStorage.setItem('netmetrik_custom_supabase_key', cleanKey);
  }
  if (cleanUrl && cleanKey && cleanUrl.startsWith('http')) {
    supabase = createClient(cleanUrl, cleanKey);
    return true;
  }
  return false;
}

/**
 * Remove custom in-app Supabase credentials
 */
export function removeCustomSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('netmetrik_custom_supabase_url');
    localStorage.removeItem('netmetrik_custom_supabase_key');
  }
  supabase = envUrl && envKey && !envUrl.includes('your-project-id') ? createClient(envUrl, envKey) : null;
}

/**
 * Checks if the user is authenticated with Supabase.
 */
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase henüz yapılandırılmadı. Lütfen API bilgilerinizi girin.');
  }
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!supabase) {
    throw new Error('Supabase henüz yapılandırılmadı. Lütfen API bilgilerinizi girin.');
  }
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) return;
  return supabase.auth.signOut();
}
