import { Telegraf } from "telegraf";

export const commandsBot = (bot: Telegraf) => {

    bot.start((ctx) => {
    ctx.reply("Привет, я резюме бот :)", {
        reply_markup: {
            keyboard: [
                [{ text: "Резюме" }, { text: "GitHub" }],
                [{text: "MiniApp"}, { text: "Contacts"}]
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

}