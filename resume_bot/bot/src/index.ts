import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { commandsBot } from "./commands"
import { logEvent } from "./analytics";
dotenv.config();

const botToken =
  process.env.BOT_TOKEN ||
  process.env.TELEGRAM_BOT_TOKEN ||
  process.env.TG_BOT_TOKEN ||
  process.env.VITE_BOT_TOKEN ||
  process.env.VITE_TELEGRAM_BOT_TOKEN ||
  process.env.VITE_TG_BOT_TOKEN;
if (!botToken) {
  throw new Error("Telegram bot token is not set. Define BOT_TOKEN or TELEGRAM_BOT_TOKEN");
}
const bot = new Telegraf(botToken);



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