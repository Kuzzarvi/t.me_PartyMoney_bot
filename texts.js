const textStart = 'Welcome!\n'
  + 'Я бот который создан немного упростить бухгалтерию\n'
  + 'по организации финансовой части мероприятий.\n'
  + 'Данная версия бота ограничена следующем:\n'
  + '1. может записать людей на мероприятие\n'
  + ' с употреблением алко или без.\n'
  + '2. может записать суммы чеков и суммы чеков алко отдельно.\n'
  + '3. может рассчитать сумму потраченную\n'
  + ' на одного человека с алко или без,\n'
  + ' в зависимости от того как он записан.\n'
  + 'Кто первый запустил бота /start, тот админ.\n'
  + 'Для начала нажмите создать мероприятие';

const textCheck = 'Чтобы добавиться на событие пропишите в чат /+ \n'
  + 'Добавиться с употреблением алко пропишите в чат /+alco \n\n'
  + 'Добавить чек напишите "/check summa"\n'
  + ' примеры: "/check 7584р", "/check 6024"\n\n'
  + 'Добавить чек алкогольной продукции напишите "/alcocheck summa"\n'
  + ' примеры: "/alcocheck 7584р", "/alcocheck 6024"\n\n'
  + 'Отобразить добавленных людей и суммы нажмите\n'
  + ' "Показать всех участников"\n\n'
  + 'Незабудьте завершить подготовку чтобы\n'
  + ' зафиксировать людей и чеки нажатием на "Зафиксировать мероприятие"\n\n'
  + 'Когда данные больше не нужны удалите\n'
  + ' их нажатием на "Удалить мероприятие"\n\n';

const keyboard = {
  addEvent: { text: 'Создать мероприятие', callback_data: 'addEvent' },
  usersNoPay: { text: 'Показать должников', callback_data: 'Показать должников' },
  allUsers: { text: 'Показать всех участников', callback_data: 'allUsers' },
  fade: { text: 'Скрыть меню', callback_data: 'fadeMenu' },
  fixEvent: { text: 'Зафиксировать мероприятие', callback_data: 'fixEvent' },
  endEvent: { text: 'Завершить мероприятие', callback_data: 'endEvent' },
};
const keyboardStart = {
  reply_markup: {
    inline_keyboard: [
      [keyboard.addEvent],
    ],
  },
};

const keyboardCheck = {
  reply_markup: {
    inline_keyboard: [
      [keyboard.allUsers], [keyboard.fade], [keyboard.fixEvent], [keyboard.endEvent],
    ],
  },
};

module.exports = {
  textStart,
  keyboardStart,
  textCheck,
  keyboardCheck,
};
