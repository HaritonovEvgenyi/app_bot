import { useEffect } from "react";
import ProjectList from "./components/ProjectList";
import AdminLogs from "./components/AdminLogs";

function App() {

  useEffect(()=> {
    //@ts-ignore
    const tg = window.Telegram?.WebApp;
    if(tg) {
      tg.ready();
      tg.expand(); // развернуть вебвью

      const tp = tg.themeParams || {};
      // Мягкий вариант: использовать цвета из темы
      tg.setBackgroundColor(tp.bg_color || "#ffffff");
      tg.setHeaderColor("bg_color");
      tg.MainButton.setText("Закрыть портфолио")
    }
  },[])

  return (
    <div style={{padding: 20}}>
      <h1> Привет, я фронтенд разработчик</h1>
      <h2>Мои проекты:</h2>
      <ProjectList />
      <AdminLogs />
    </div>
  )
}

export default App;