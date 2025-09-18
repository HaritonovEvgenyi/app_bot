import { getSupabase } from "./supabase";

type AnalyticsEventName =
  | "bot_started"
  | "command_received"
  | "message_received"
  | "error";

interface AnalyticsEventPayload {
  user_id?: number;
  username?: string | null;
  chat_id?: number;
  command?: string;
  message_text?: string;
  error_message?: string;
  meta?: Record<string, unknown>;
}

export async function logEvent(event: AnalyticsEventName, payload: AnalyticsEventPayload = {}): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

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
  } catch (err) {
    console.warn("Analytics logging threw:", err);
  }
}


