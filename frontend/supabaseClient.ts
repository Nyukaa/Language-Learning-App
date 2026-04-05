import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://ueeiimylpgqokitosdmf.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "sb_publishable_8zzMCXT8FXGRU3b_S9p3Xg_HflcTYQC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
