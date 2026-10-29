import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isBackendConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isBackendConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface RsvpSubmissionPayload {
  guestSlug: string;
  guestName: string;
  attendance: 'hadir' | 'tidak_hadir';
  pax: number;
  dietaryNotes?: string;
  message?: string;
}

export async function submitRsvpRecord(payload: RsvpSubmissionPayload) {
  if (!supabase) {
    // Local storage fallback when no external backend is configured
    localStorage.setItem('srib_rsvp', JSON.stringify({ ...payload, savedAt: new Date().toISOString() }));
    return { mode: 'local' as const, data: payload };
  }

  const { data, error } = await supabase
    .from('rsvp_submissions')
    .insert({
      guest_slug: payload.guestSlug,
      guest_name: payload.guestName,
      attendance: payload.attendance,
      pax: payload.pax,
      dietary_notes: payload.dietaryNotes ?? null,
      message: payload.message ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { mode: 'live' as const, data };
}
