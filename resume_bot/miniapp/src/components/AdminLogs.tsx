import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const ADMIN_IDS: number[] = ((import.meta.env.VITE_ADMIN_IDS as string) || (import.meta.env.VITE_ADMIN_ID as string) || "")
  .split(",")
  .map((s) => Number(String(s).trim()))
  .filter((n) => Number.isFinite(n));
const FALLBACK_ADMIN_ID = 74097192;

type AnalyticsEvent = {
  id: number;
  created_at: string;
  event_name: string;
  user_id: number | null;
  username: string | null;
  chat_id: number | null;
  command: string | null;
  message_text: string | null;
  error_message: string | null;
  meta: Record<string, unknown> | null;
};

export default function AdminLogs() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{ userId?: number; adminIds?: number[]; hasTelegram?: boolean; hasUser?: boolean; envAdminId?: string; envAdminIds?: string }>({});
  const [limit, setLimit] = useState(50);
  const [onlyErrors, setOnlyErrors] = useState(false);

  const columns = useMemo(
    () => [
      { key: "id", title: "ID" },
      { key: "created_at", title: "Время" },
      { key: "event_name", title: "Событие" },
      { key: "user_id", title: "User ID" },
      { key: "username", title: "Username" },
      { key: "chat_id", title: "Chat ID" },
      { key: "command", title: "Команда" },
      { key: "message_text", title: "Текст" },
      { key: "error_message", title: "Ошибка" },
    ],
    []
  );

  async function fetchEvents(options?: { limit?: number; onlyErrors?: boolean }) {
    const take = options?.limit ?? limit;
    const justErrors = options?.onlyErrors ?? onlyErrors;
    let query = supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(take);

    if (justErrors) {
      query = query.eq("event_name", "error");
    }

    const { data, error } = await query;
    if (error) {
      console.error("Ошибка загрузки событий:", error);
    } else {
      setEvents((data as AnalyticsEvent[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    const tgWebApp = (window as any)?.Telegram?.WebApp;
    if (!tgWebApp) {
      console.warn("Telegram WebApp недоступен. Открывай через Mini App.");
      setDebugInfo((d) => ({
        ...d,
        hasTelegram: false,
        hasUser: false,
        envAdminId: String(import.meta.env.VITE_ADMIN_ID ?? ""),
        envAdminIds: String(import.meta.env.VITE_ADMIN_IDS ?? ""),
        adminIds: ADMIN_IDS.length ? ADMIN_IDS : [FALLBACK_ADMIN_ID],
      }));
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const tgUser = tgWebApp.initDataUnsafe?.user;
      if (!tgUser) {
        console.warn("Telegram user не определен. WebApp не передал данные.");
        setDebugInfo((d) => ({
          ...d,
          hasTelegram: true,
          hasUser: false,
          envAdminId: String(import.meta.env.VITE_ADMIN_ID ?? ""),
          envAdminIds: String(import.meta.env.VITE_ADMIN_IDS ?? ""),
          adminIds: ADMIN_IDS.length ? ADMIN_IDS : [FALLBACK_ADMIN_ID],
        }));
        setLoading(false);
        return;
      }

      const effectiveAdminIds = ADMIN_IDS.length > 0 ? ADMIN_IDS : [FALLBACK_ADMIN_ID];
      const currentUserId = Number(tgUser.id);
      setDebugInfo({
        userId: currentUserId,
        adminIds: effectiveAdminIds,
        hasTelegram: true,
        hasUser: true,
        envAdminId: String(import.meta.env.VITE_ADMIN_ID ?? ""),
        envAdminIds: String(import.meta.env.VITE_ADMIN_IDS ?? ""),
      });
      if (Number.isFinite(currentUserId) && effectiveAdminIds.includes(currentUserId)) {
        setAllowed(true);
        fetchEvents();
      } else {
        setAllowed(false);
        setLoading(false);
      }
    }, 200);
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (!allowed)
    return (
      <div style={{ padding: 20 }}>
        <p>Доступ запрещён</p>
        <div style={{ opacity: 0.8, fontSize: 12, marginTop: 8, lineHeight: 1.6 }}>
          {debugInfo.userId !== undefined && (
            <div>Ваш user_id: {debugInfo.userId}</div>
          )}
          <div>Разрешённые admin IDs: {debugInfo.adminIds?.join(", ") || "нет"}</div>
          <div>VITE_ADMIN_ID: {debugInfo.envAdminId || "(не задан)"}</div>
          <div>VITE_ADMIN_IDS: {debugInfo.envAdminIds || "(не задан)"}</div>
          <div>Telegram WebApp: {String(debugInfo.hasTelegram)}</div>
          <div>Telegram user: {String(debugInfo.hasUser)}</div>
        </div>
        <p style={{ opacity: 0.7, fontSize: 12 }}>
          Задайте VITE_ADMIN_ID или VITE_ADMIN_IDS=comma,separated в .env мини-приложения, затем пересоберите.
        </p>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Логи бота (analytics_events)</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "10px 0" }}>
        <label>
          Показать только ошибки
          <input
            type="checkbox"
            checked={onlyErrors}
            onChange={(e) => {
              setOnlyErrors(e.target.checked);
              fetchEvents({ onlyErrors: e.target.checked });
            }}
            style={{ marginLeft: 8 }}
          />
        </label>
        <label>
          Лимит
          <select
            value={limit}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLimit(v);
              fetchEvents({ limit: v });
            }}
            style={{ marginLeft: 8 }}
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <button onClick={() => fetchEvents()}>Обновить</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table border={1} cellPadding={6} style={{ marginTop: 10, minWidth: 900 }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>{e.event_name}</td>
                <td>{e.user_id ?? "-"}</td>
                <td>{e.username ?? "-"}</td>
                <td>{e.chat_id ?? "-"}</td>
                <td>{e.command ?? "-"}</td>
                <td style={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {e.message_text ?? "-"}
                </td>
                <td style={{ color: e.event_name === "error" ? "#b00020" : undefined }}>
                  {e.error_message ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
