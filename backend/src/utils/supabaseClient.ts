import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // или anon key, если только проверка токена

export const supabase = createClient(supabaseUrl, supabaseKey);
