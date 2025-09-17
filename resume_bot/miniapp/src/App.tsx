import { useEffect } from "react";
import ProjectList from "./components/ProjectList";

function App() {

  useEffect(()=> {
    //@ts-ignore
    const tg = window.Telegram?.WebApp;
    if(tg) {
      tg.ready();
      tg.MainButton.setText("Закрыть портфолио")
    }
  },[])

  return (
    <div style={{padding: 20}}>
      <h1> Привет, я фронтенд разработчик</h1>
      <h2>Мои проекты:</h2>
      <ProjectList />
    </div>
  )
}

export default App;