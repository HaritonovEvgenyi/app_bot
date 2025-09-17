import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const ADMIN_ID = 74097192;

type Log = {
  id: number;
  user_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  date: string;
};

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  // Функция для загрузки логов
  async function fetchLogs() {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("date", { ascending: false })
      .limit(50);

    if (error) console.error("Ошибка загрузки логов:", error);
    else setLogs(data as Log[]);

    setLoading(false);
  }

  // Функция для сохранения логов
  async function saveLog(log: Omit<Log, "id">) {
    const { error } = await supabase.from("logs").insert([log]);
    if (error) console.error("Ошибка записи лога:", error);
    else fetchLogs();
  }

  useEffect(() => {
    console.log("tgWebApp:", window.Telegram?.WebApp);
    console.log("tgUser:", window.Telegram?.WebApp?.initDataUnsafe?.user);
  }, [])

  useEffect(() => {
    const tgWebApp = window.Telegram?.WebApp;

    if (!tgWebApp) {
      console.warn("Telegram WebApp недоступен. Открывай через Mini App.");
      setLoading(false);
      return;
    }

    // Ждем готовности WebApp (100ms обычно достаточно)
    setTimeout(() => {
      const tgUser = tgWebApp.initDataUnsafe?.user;

      if (!tgUser) {
        console.warn("Telegram user не определен. WebApp не передал данные.");
        setLoading(false);
        return;
      }

      // Сохраняем лог пользователя
      if (tgUser) {
             saveLog({
        user_id: tgUser.id,
        username: tgUser.username || null,
        first_name: tgUser.first_name || null,
        last_name: tgUser.last_name || null,
        date: new Date().toISOString(),
      });
      }
 

      // Проверяем админа
      if (tgUser.id === ADMIN_ID) {
        setAllowed(true);
        fetchLogs();
      } else {
        setAllowed(false);
        setLoading(false);
      }
    }, 300);
  }, []);

  if (loading) return <p>Загрузка логов...</p>;
  if (!allowed) return <p>Доступа нет, вы не админ</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Логи пользователей бота</h1>
      <table border={1} cellPadding={5} style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.user_id}</td>
              <td>{log.username || "-"}</td>
              <td>{log.first_name || "-"}</td>
              <td>{log.last_name || "-"}</td>
              <td>{new Date(log.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
