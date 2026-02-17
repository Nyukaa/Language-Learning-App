import { supabase } from "../supabaseClient";
export const fetchWithAuth = async (url: string, options: any = {}) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
