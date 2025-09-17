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

  // Загрузка логов
  async function fetchLogs() {
    try {
      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .order("date", { ascending: false })
        .limit(50);

      console.log("Supabase data:", data);
      console.log("Supabase error:", error);

      if (error) console.error("Ошибка загрузки логов:", error);
      else setLogs(data as Log[]);
    } catch (err) {
      console.error("Ошибка fetchLogs:", err);
    } finally {
      setLoading(false);
    }
  }

  // Добавление нового лога
  async function saveLog(log: Omit<Log, "id">) {
    try {
      const { data, error } = await supabase.from("logs").insert([log]);
      if (error) console.error("Ошибка записи лога:", error);
      else {
        console.log("Лог успешно записан:", data);
        fetchLogs(); // обновляем таблицу после добавления
      }
    } catch (err) {
      console.error("Ошибка saveLog:", err);
    }
  }

useEffect(() => {
    if (!window.Telegram?.WebApp) {
        console.warn("Telegram WebApp недоступен");
        setLoading(false);
        return;
    }

    window.Telegram.WebApp.onEvent("mainButtonClicked", () => {});
    window.Telegram.WebApp.ready(); // гарантируем инициализацию

    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
    console.log("Telegram user:", tgUser);

    if (tgUser?.id === ADMIN_ID) {
        setAllowed(true);
        fetchLogs();
    } else {
        setAllowed(false);
        setLoading(false);
    }
}, []);

  if (loading) return <p>Загрузка логов ...</p>;
  if (!allowed) return <p>Доступа нет, вы не админ</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Логи пользователей бота</h1>

      {/* Кнопка для добавления тестового лога */}
      <button
        onClick={() =>
          saveLog({
            user_id: 12345,
            username: "testuser",
            first_name: "Test",
            last_name: "User",
            date: new Date().toISOString(),
          })
        }
      >
        Добавить тестовый лог
      </button>

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
