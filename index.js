require('dotenv').config()
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy')
const { hydrate } = require('@grammyjs/hydrate')
const bot = new Bot(process.env.BOT_API_KEY)
bot.use(hydrate())

bot.command('mood', async (ctx) => {
    const moodKeyboard = new Keyboard().text('Хорошо').row().text('Плохо').row().text('Норм').resized()
    await ctx.reply("Как настроение?", {
        reply_markup: moodKeyboard
    })
})

bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Перезапустить бота',
    },
    {
        command: 'menu',
        description: 'Открыть меню',
    },
])


bot.command('start', async (ctx) => {
    const l = ctx.msg.from.username
    console.log(l)
    await ctx.react('❤‍🔥')
    await ctx.reply(`Вот ссылка!: <b><a href="t.me/${l}">@${l}</a></b>`, {
        reply_parameters: {message_id: ctx.msg.message_id},
        parse_mode: 'HTML',
        disable_web_page_preview: true,
    })

})

const menuKeyboard = new InlineKeyboard()
    .text('Узнать статус', 'order_status').row()
    .text('Поддержка', 'support')
const backKeyboard = new InlineKeyboard()
    .text('Назад в меню', 'back_to_menu')

bot.command('menu', async (ctx) => {
    await ctx.reply('Меню:', {
        reply_markup: menuKeyboard
    })
})

bot.callbackQuery('order_status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Статус заказа: в пути', {
        reply_markup: backKeyboard
    })
    ctx.answerCallbackQuery()
})

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Поддержка открыта', {
        reply_markup: backKeyboard
    })
    ctx.answerCallbackQuery()
})

bot.callbackQuery('back_to_menu', async (ctx) => {
    await ctx.callbackQuery.message.editText('Меню:', {
        reply_markup: menuKeyboard
    })
    ctx.answerCallbackQuery()
})

// bot.command('inline',  async (ctx) => {
//     const inline_keyboard = new InlineKeyboard().text('1', 'callback_1').row()
//     .text('2', 'callback_2').row()
//     .text('3', 'callback_3').row()

//     await ctx.reply('Цифра', {
//         reply_markup: inline_keyboard
//     })
// })

// bot.callbackQuery('callback_1', async (ctx) => {
//     const start_keyboard = new Keyboard().text('/start')

//     await ctx.reply(`Вы выбрали цифру: 1`, {
//         reply_markup: start_keyboard,
//         disable_web_page_preview: true,
//     })

//     ctx.answerCallbackQuery('Готово!')
// })

// bot.on('callback_query:data', async (ctx) => {
//     const start_keyboard = new Keyboard().text('/start')

//     await ctx.reply(`Вы выбрали цифру: ${ctx.callbackQuery.}`, {
//         reply_markup: start_keyboard,
//         disable_web_page_preview: true,
//     })

//     ctx.answerCallbackQuery()
// })

const getRandOfArr = (arr) => {
    return arr[Math.floor(Math.random()*items.length)]
}



bot.catch((err) => {
    const ctx = err.ctx
    console.log(`Error while handling update ${ctx.update.update_id}`)
    const e = err.error

    if (e instanceof GrammyError) {
        console.log("Error in req: "+e.description)
    } else if (e instanceof HttpError) {
        console.log("Could not contact Telegram: "+e)
    } else {
        console.log("Unfound error: "+e)
    }
})

bot.start()