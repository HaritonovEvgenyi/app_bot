import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { commandsBot } from "./commands"
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

commandsBot(bot)

bot.launch();