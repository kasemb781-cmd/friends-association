import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(
  "PASTE_YOUR_PROJECT_URL_HERE",
  "PASTE_YOUR_ANON_PUBLIC_KEY_HERE"
);
