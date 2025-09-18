import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { commandsBot } from "./commands"
import { logEvent } from "./analytics";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);



commandsBot(bot)

bot.launch()
  .then(() => {
    console.log("Бот запущен локально")
    logEvent("bot_started", {})
  })
  .catch((err) => {
    console.error(err);
    logEvent("error", { error_message: err instanceof Error ? err.message : String(err) })
  });