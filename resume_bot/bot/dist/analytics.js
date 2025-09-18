"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEvent = logEvent;
const supabase_1 = require("./supabase");
async function logEvent(event, payload = {}) {
    const supabase = (0, supabase_1.getSupabase)();
    if (!supabase)
        return;
    try {
        const { error } = await supabase.from("analytics_events").insert({
            event_name: event,
            user_id: payload.user_id ?? null,
            username: payload.username ?? null,
            chat_id: payload.chat_id ?? null,
            command: payload.command ?? null,
            message_text: payload.message_text ?? null,
            error_message: payload.error_message ?? null,
            meta: payload.meta ?? null,
        });
        if (error) {
            console.warn("Failed to log analytics event:", error.message);
        }
    }
    catch (err) {
        console.warn("Analytics logging threw:", err);
    }
}
