"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabase = getSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
let cachedClient = null;
let warned = false;
function getSupabase() {
    if (cachedClient)
        return cachedClient;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
        if (!warned) {
            console.warn("Supabase env vars are not set. Skipping analytics. Expected SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.");
            warned = true;
        }
        return null;
    }
    cachedClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return cachedClient;
}
