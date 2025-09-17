import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_KEY!
)

const ADMIN_ID = 74097192;

type Log = {
    id: number;
    user_id: number;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    date: string;
}

export default function AdminLogs() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true)
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
        //@ts-ignore
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (tgUser === ADMIN_ID) {
            setAllowed(true)
            fetchLogs();
        } else {
            setLoading(false)
         }
    }, [allowed])

    async function fetchLogs() {
            const { data, error} = await supabase.from("logs").select("*").order("date", {ascending: false}).limit(50)
            if (error) {
                console.error("Ошибка загруки логов", error)
            } else {
                setLogs(data as Log[])
            }
            setLoading(false)
        }


    if (loading) return <p>Загрузка логов ...</p>
    if (!allowed) return <p>Доступа нет, вы не админ</p>

     return (
      <div style={{ padding: 20 }}>
        <h1>Логи пользователей бота</h1>
        <table border={1} cellPadding={5}>
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
