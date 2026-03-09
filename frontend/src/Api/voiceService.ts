import axios from "axios";
import { supabase } from "../../supabaseClient";

export const parseVoiceText = async (
  text: string,
  targetLanguage?: string
): Promise<{ word: string; context: string }> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("No auth session");

  const res = await axios.post(
    "/api/voice",
    { text, targetLanguage },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
