import { Telegraf } from "telegraf";

export const commandsBot = (bot: Telegraf) => {

    bot.start((ctx) => {
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

    bot.hears("Резюме", (ctx) => {
    ctx.replyWithDocument({source: "./resume2.pdf"})
})

    bot.hears("GitHub", (ctx) => {
    ctx.reply("Мой gitHub  👉  https://github.com/HaritonovEvgenyi")
})

    bot.hears("MiniApp", (ctx) => {
    ctx.reply("Открыть MiniApp внутри telegram 👇", {
        reply_markup: {
            inline_keyboard: [[{text: "Открыть портфолио", web_app: {url : "https://app-bot-xi.vercel.app/"}}]]
        }
    })
})
    bot.hears("Contacts", (ctx) => {
    ctx.reply("Email: luckydjone@inbox.ru\nTelegram: @Haritonov_Evgenuy")
})
        bot.hears("Погода в Москве", async (ctx) => {
            try {
                const apiKey = process.env.WEATHER_API_KEY;
                const city = "Moscow";
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
                const res = await fetch(url)
                const data = await res.json()
                console.log(data)

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
                ctx.reply("Произошла ошибка")
            }
})

}