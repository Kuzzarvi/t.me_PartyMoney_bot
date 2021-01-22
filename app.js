require('dotenv').config();
const { Telegraf } = require('telegraf');
const {
  textStart, keyboardStart, textCheck, keyboardCheck,
} = require('./texts');

const bot = new Telegraf(process.env.T_TOKEN);
let state = 'start';
let adminId = process.env.ADMIN_ID;
let event = {
  allUsers: {
    users: [],
    amountUsers: 0,
    check: 0,
  },
  alcoUsers: {
    users: [],
    amountUsers: 0,
    check: 0,
  },
};

const sendKeyboard = (ctx, text, keyboard) => ctx.telegram.sendMessage(ctx.chat.id, text, keyboard);

bot.start((ctx) => {
  if (state === 'start') {
    adminId = ctx.message.from.id;
    state = 'begin';
    return sendKeyboard(ctx, textStart, keyboardStart);
  }

  sendKeyboard(ctx, textCheck, keyboardCheck);
});

bot.on('callback_query', async (ctx) => {
  if (ctx.update.callback_query.data === 'addEvent') {
    if (adminId === ctx.update.callback_query.from.id) {
      event.visible = false;
      ctx.deleteMessage();
      sendKeyboard(ctx, textCheck, keyboardCheck);
    }

    // ctx.reply('Введите название события');
    // bot.on('message', (ctx) => {
    //   if (ctx.update.message.text.length) {
    //     event.title = ctx.update.message.text;
    //     sendKeyboard(ctx, textCheck, keyboardCheck);
    //   }
    // });
    bot.hears(/^\/\+alco$/, (ctx) => {
      if (state !== 'fix') {
        if (!event.alcoUsers.users.find((el) => el === ctx.message.from.username)) {
          event.alcoUsers.users.push(ctx.message.from.username);
          event.allUsers.users = event.allUsers.users.filter((el) => el !== ctx.message.from.username);
          return ctx.reply(`@${ctx.message.from.username} добавлен в мероприятие с алкоЧеком`);
        }
        return ctx.reply(`@${ctx.message.from.username} Вы уже c алко`);
      }
    });

    bot.hears(/^\/\+$/, (ctx) => {
      if (state !== 'fix') {
        if (!event.allUsers.users.find((el) => el === ctx.message.from.username) && !event.alcoUsers.users.find((el) => el === ctx.message.from.username)) {
          event.allUsers.users.push(ctx.message.from.username);
          return ctx.reply(`@${ctx.message.from.username} добавлен в мероприятие`);
        }
        return ctx.reply(`@${ctx.message.from.username} Вы уже в мероприятии`);
      }
    });

    bot.hears(/^\/check\s\d+/, async (ctx) => {
      if (state !== 'fix') {
        if (adminId === ctx.message.from.id) {
          event.allUsers.check += Number(+/\d+/.exec(ctx.message.text));
          ctx.reply(`В общем чеке ${event.allUsers.check}`);
        }
      }
    });

    bot.hears(/^\/alcocheck\s\d+/, async (ctx) => {
      if (adminId === ctx.message.from.id) {
        event.alcoUsers.check += Number(+/\d+/.exec(ctx.message.text));
        ctx.reply(`В алкоЧеке ${event.alcoUsers.check}`);
      }
    });
  }

  if (ctx.update.callback_query.data === 'fadeMenu') {
    if (adminId === ctx.update.callback_query.from.id) {
      ctx.deleteMessage();
    }
  }

  if (ctx.update.callback_query.data === 'fixEvent') {
    if (adminId === ctx.update.callback_query.from.id) {
      state = 'fix';
      ctx.reply('Внимание! Статус мероприятия зафиксирован, изменению не подлежит!');
      ctx.answerCbQuery();
    }
  }

  if (ctx.update.callback_query.data === 'endEvent') {
    if (adminId === ctx.update.callback_query.from.id) {
      state = 'start';
      ctx.reply('Внимание! Мероприятие удалено!\n'
      + 'Можете создать новое вызвав главное меню /start');
      ctx.deleteMessage();
      adminId = process.env.ADMIN_ID;
      event = {
        allUsers: {
          users: [],
          amountUsers: 0,
          check: 0,
        },
        alcoUsers: {
          users: [],
          amountUsers: 0,
          check: 0,
        },
      };
    }
  }

  // if (ctx.update.callback_query.data === 'addUser') {
  //   try {
  //     if (allUsers.find((el) => el.username === ctx.update.callback_query.from.username)) {
  //       ctx.answerCbQuery();
  //       return ctx.reply('Ты уже в теме');
  //     }
  //     allUsers.push({ username: ctx.update.callback_query.from.username });
  //     ctx.answerCbQuery();
  //     ctx.reply(` @${ctx.update.callback_query.from.username} добавлен`);
  //   } catch (e) {
  //     ctx.reply('Произошла ошибка, сообщите о ней разработчикам бота');
  //   }
  // }

  if (ctx.update.callback_query.data === 'allUsers') {
    try {
      if (event.allUsers.amountUsers <= event.allUsers.users.length) {
        event.allUsers.amountUsers = event.allUsers.users.length;
      }
      if (event.alcoUsers.amountUsers <= event.alcoUsers.users.length) {
        event.alcoUsers.amountUsers = event.alcoUsers.users.length;
      }
      if (event.allUsers.users.length && event.alcoUsers.users.length) {
        const users = event.allUsers.users.map((el) => ` @${el}`);
        const usersPay = Math.round(event.allUsers.check / event.allUsers.amountUsers + event.alcoUsers.amountUsers);
        const alcoUsers = event.alcoUsers.users.map((el) => ` @${el}`);
        const alcoUsersPay = usersPay + Math.round(event.alcoUsers.check / event.alcoUsers.amountUsers);
        ctx.answerCbQuery();
        return ctx.reply('Список участников:\n'
          + `Торчат бабки в размере: ${usersPay}\n`
          + `${users}\n`
          + `Торчат бабки в размере (с алко): ${alcoUsersPay}\n`
          + `${alcoUsers}`);
      } if (event.alcoUsers.users.length) {
        const usersPay = Math.round(event.allUsers.check / event.alcoUsers.amountUsers);
        const alcoUsers = event.alcoUsers.users.map((el) => ` @${el}`);
        const alcoUsersPay = usersPay + Math.round(event.alcoUsers.check / event.alcoUsers.amountUsers);
        ctx.answerCbQuery();
        return ctx.reply('Список участников:\n'
          + `Торчат бабки в размере (с алко): ${alcoUsersPay}\n`
          + `${alcoUsers}`);
      } if (event.allUsers.users.length) {
        const users = event.allUsers.users.map((el) => ` @${el}`);
        const usersPay = Math.round(event.allUsers.check / event.allUsers.amountUsers);
        ctx.answerCbQuery();
        return ctx.reply('Список участников:\n'
          + `Торчат бабки в размере: ${usersPay}\n`
          + `${users}\n`);
      }
      ctx.deleteMessage();
      return ctx.reply('Участников ещё нет');
    } catch (e) {
      ctx.reply('Произошла ошибка, сообщите о ней разработчикам бота');
    }
  }
});

bot.command('help', (ctx) => ctx.reply('Связь с создателем бота @kuzzarvi'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
