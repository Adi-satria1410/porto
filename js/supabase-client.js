import { supabaseConfig } from './supabase-config.js';
import { validateConfig } from './admin-service.mjs';

let clientPromise;
let publicClientPromise;
export function getPublicSupabase() {
  if (!publicClientPromise) publicClientPromise = (async () => {
    validateConfig(supabaseConfig);
    const sdk = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    return sdk.createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'portfolio-public' },
    });
  })().catch(error => { publicClientPromise = undefined; throw error; });
  return publicClientPromise;
}
export function getSupabase() {
  if (!clientPromise) clientPromise = (async () => {
    validateConfig(supabaseConfig);
    let sdk;
    try {
      sdk = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    } catch {
      throw new Error('Koneksi ke layanan login gagal. Periksa internet lalu muat ulang halaman.');
    }
    return sdk.createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });
  })();
  return clientPromise;
}
