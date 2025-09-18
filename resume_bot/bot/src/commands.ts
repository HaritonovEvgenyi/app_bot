import { Telegraf } from "telegraf";
import { logEvent } from "./analytics";

export const commandsBot = (bot: Telegraf) => {

    bot.start(async (ctx) => {
        console.log("TG_ID", ctx.from.id)
        logEvent("command_received", {
            user_id: ctx.from.id,
            username: ctx.from.username,
            chat_id: ctx.chat.id as number,
            command: "/start",
        });
    ctx.reply("Привет, я резюме бот :)", {
        reply_markup: {
            keyboard: [
                [{ text: "Резюме" }, { text: "GitHub" }],
                [{text: "MiniApp"}, { text: "Contacts"}],
                [{text: "Погода в Москве"}]
            ],
            resize_keyboard: true
        }
    })
})

    bot.hears("Резюме", async (ctx) => {
    logEvent("command_received", {
        user_id: ctx.from.id,
        username: ctx.from.username,
        chat_id: ctx.chat.id as number,
        command: "Резюме",
    });
    ctx.replyWithDocument({source: "./resume2.pdf"})
})

    bot.hears("GitHub", async (ctx) => {
    logEvent("command_received", {
        user_id: ctx.from.id,
        username: ctx.from.username,
        chat_id: ctx.chat.id as number,
        command: "GitHub",
    });
    ctx.reply("Мой gitHub  👉  https://github.com/HaritonovEvgenyi")
})

    bot.hears("MiniApp", async (ctx) => {
    logEvent("command_received", {
        user_id: ctx.from.id,
        username: ctx.from.username,
        chat_id: ctx.chat.id as number,
        command: "MiniApp",
    });
    ctx.reply("Открыть MiniApp внутри telegram 👇", {
        reply_markup: {
            inline_keyboard: [[{text: "Открыть портфолио", web_app: {url : "https://app-bot-xi.vercel.app/"}}]]
        }
    })
})
    bot.hears("Contacts", async (ctx) => {
    logEvent("command_received", {
        user_id: ctx.from.id,
        username: ctx.from.username,
        chat_id: ctx.chat.id as number,
        command: "Contacts",
    });
    ctx.reply("Email: luckydjone@inbox.ru\nTelegram: @Haritonov_Evgenuy")
})
        bot.hears("Погода в Москве", async (ctx) => {
            try {
                logEvent("command_received", {
                    user_id: ctx.from.id,
                    username: ctx.from.username,
                    chat_id: ctx.chat.id as number,
                    command: "Погода в Москве",
                });
                const apiKey =
                    process.env.WEATHER_API_KEY ||
                    process.env.OPENWEATHER_API_KEY ||
                    process.env.OPENWEATHERMAP_API_KEY ||
                    process.env.VITE_WEATHER_API_KEY ||
                    process.env.VITE_OPENWEATHER_API_KEY ||
                    process.env.VITE_OPENWEATHERMAP_API_KEY;
                const city = "Moscow";
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
                const res = await fetch(url)
                const data = await res.json()

                if (data.cod !== 200) {
                    return ctx.reply("Не удалось получить погоду")
                }
                    const temp = data.main.temp;
                    const desc = data.weather[0].description;
                    const feels = data.main.feels_like;
                    const humidity = data.main.humidity;

                      ctx.reply(
                        `Погода в Москве:\n🌡 Температура: ${temp}°C\n🤔 Ощущается как: ${feels}°C\n💧 Влажность: ${humidity}%\n🌥 ${desc}`
                      );
            } catch(err) {
                console.error(err);
                logEvent("error", {
                    user_id: ctx.from.id,
                    username: ctx.from.username,
                    chat_id: ctx.chat.id as number,
                    command: "Погода в Москве",
                    error_message: err instanceof Error ? err.message : String(err),
                });
                ctx.reply("Произошла ошибка")
            }
})

}