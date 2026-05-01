import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import {SECRET_SUPABASE_API_KEY} from "$env/static/private";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAdminKey = SECRET_SUPABASE_API_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    }
});