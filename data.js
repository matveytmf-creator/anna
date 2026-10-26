/* ================================================
   DATA.JS — Museum Editorial Archive [2411]
   Контент и конфигурация архива Matvey & Anya.
   Совместим с исходным script.js; существующие ключи сохранены.
   ================================================ */

const APP_DATA = {
  config: {
    startDate: "2025-10-22T00:15:00", // Дата начала отсчёта
    pinCode: "2411",
    girlName: "Аня",
    myName: "Матвей",
    archiveTitle: "Matvey & Anna",
    archiveCode: "2411",
    audioSrc: "assets/audio/favorite_song.mp3"
  },

  // Подписи для аналогового радиоприёмника времени.
  // Существующие ключи сохранены: script.js выбирает ближайшую частоту.
  frequencyQuotes: {
    "22.00": "Дипфейки Ани с Сахы",
    "22.10": "Богдан, харкайся",
    "22.25": "Поездка в Гала, посиделки в горке",
    "22.50": "Официальное начало отношений",
    "23.00": "ФудФест и долгие объятия после него (бухая ева падает на листок)",
    "23.25": "Сводим Кирюху и Еву",
    "23.50": "Русский дом и поход на каток, к сожалению без тебя",
    "24.00": "Поход на анимешный оркестр с кучей фоток на крыше",
    "24.11": "Ура Годик",
  },

  // Фотографии для хаотичного архива.
  chaosPhotos: [
    { image: "assets/photos/chain_1.jpg", title: "Ева нарисовала" },
    { image: "assets/photos/chain_2.jpg", title: "Ракета в Гала" },
    { image: "assets/photos/chain_3.jpg", title: "14 февраля" },
    { image: "assets/photos/chain_4.jpg", title: "после физры" },
    { image: "assets/photos/chain_5.jpg", title: "что замазано?)" },

  ],

  // Кадры 35-мм киноплёнки Kodak.
  filmFrames: [
    { id: 1, image: "assets/photos/chain_1.jpg", title: "Frame 0045", subtitle: ""},
    { id: 2, image: "assets/photos/chain_2.jpg", title: "Frame 0046", subtitle: "" },
    { id: 3, image: "assets/photos/chain_3.jpg", title: "Frame 0047", subtitle: "" },
    { id: 4, image: "assets/photos/chain_4.jpg", title: "Frame 0047", subtitle: "" },
    { id: 5, image: "assets/photos/chain_5.jpg", title: "Frame 0047", subtitle: "" },
    { id: 6, image: "assets/photos/chain_6.jpg", title: "Frame 0047", subtitle: "" },
    { id: 7, image: "assets/photos/chain_7.jpg", title: "Frame 0047", subtitle: "" },
    { id: 8, image: "assets/photos/chain_8.jpg", title: "Frame 0047", subtitle: "" },
    { id: 9, image: "assets/photos/chain_9.jpg", title: "Frame 0047", subtitle: "" },
    { id: 10, image: "assets/photos/chain_10.jpg", title: "Frame 0047", subtitle: "" },
    { id: 11, image: "assets/photos/chain_11.jpg", title: "Frame 0047", subtitle: "" },
    { id: 12, image: "assets/photos/chain_12.jpg", title: "Frame 0047", subtitle: "" },
    { id: 13, image: "assets/photos/chain_13.jpg", title: "Frame 0047", subtitle: "" },
    { id: 14, image: "assets/photos/chain_14.jpg", title: "Frame 0047", subtitle: "" },
    { id: 15, image: "assets/photos/chain_15.jpg", title: "Frame 0047", subtitle: "" },
    { id: 16, image: "assets/photos/chain_16.jpg", title: "Frame 0047", subtitle: "" },
    { id: 17, image: "assets/photos/chain_17.jpg", title: "Frame 0047", subtitle: "" },
    { id: 18, image: "assets/photos/chain_18.jpg", title: "Frame 0047", subtitle: "" },
    { id: 19, image: "assets/photos/chain_19.jpg", title: "Frame 0047", subtitle: "" },
    { id: 20, image: "assets/photos/chain_20.jpg", title: "Frame 0047", subtitle: "" },
    { id: 21, image: "assets/photos/chain_21.jpg", title: "Frame 0047", subtitle: "" },
    { id: 22, image: "assets/photos/chain_22.jpg", title: "Frame 0047", subtitle: "" },
    { id: 23, image: "assets/photos/chain_23.jpg", title: "Frame 0047", subtitle: "" },
    { id: 24, image: "assets/photos/chain_24.jpg", title: "Frame 0047", subtitle: "" },
    { id: 25, image: "assets/photos/chain_25.jpg", title: "Frame 0047", subtitle: "" },
    { id: 26, image: "assets/photos/chain_26.jpg", title: "Frame 0047", subtitle: "" },
    { id: 27, image: "assets/photos/chain_27.jpg", title: "Frame 0047", subtitle: "" },
    { id: 28, image: "assets/photos/chain_28.jpg", title: "Frame 0047", subtitle: "" },
    { id: 29, image: "assets/photos/chain_29.jpg", title: "Frame 0047", subtitle: "" },
    { id: 30, image: "assets/photos/chain_30.jpg", title: "Frame 0047", subtitle: "" },
    { id: 31, image: "assets/photos/chain_31.jpg", title: "Frame 0047", subtitle: "" },
    { id: 32, image: "assets/photos/chain_32.jpg", title: "Frame 0047", subtitle: "" },
    { id: 33, image: "assets/photos/chain_33.jpg", title: "Frame 0047", subtitle: "" },
    { id: 34, image: "assets/photos/chain_34.jpg", title: "Frame 0047", subtitle: "" },
    { id: 35, image: "assets/photos/chain_35.jpg", title: "Frame 0047", subtitle: "" },
    { id: 36, image: "assets/photos/chain_36.jpg", title: "Frame 0047", subtitle: "" },
    { id: 37, image: "assets/photos/chain_37.jpg", title: "Frame 0047", subtitle: "" },
    { id: 38, image: "assets/photos/chain_38.jpg", title: "Frame 0047", subtitle: "" },
    { id: 39, image: "assets/photos/chain_39.jpg", title: "Frame 0047", subtitle: "" },
    { id: 40, image: "assets/photos/chain_40.jpg", title: "Frame 0047", subtitle: "" },
    { id: 41, image: "assets/photos/chain_41.jpg", title: "Frame 0047", subtitle: "" },
    { id: 42, image: "assets/photos/chain_42.jpg", title: "Frame 0047", subtitle: "" },
    { id: 43, image: "assets/photos/chain_43.jpg", title: "Frame 0047", subtitle: "" },
    { id: 44, image: "assets/photos/chain_44.jpg", title: "Frame 0047", subtitle: "" },
    { id: 45, image: "assets/photos/chain_45.jpg", title: "Frame 0047", subtitle: "" },
    { id: 46, image: "assets/photos/chain_46.jpg", title: "Frame 0047", subtitle: "" },
    { id: 47, image: "assets/photos/chain_47.jpg", title: "Frame 0047", subtitle: "" },
  ],

  // Причины для блока письма / проявки.
  reasons: [
  "За твою улыбку.",
  "За твой смех.",
  "За твои глаза.",
  "За твой характер.",
  "За твои милые привычки.",
  "За то, что с тобой я могу быть собой.",
  "За то, что ты терпишь мои тупые шутки.",
  "За твои реакции на мои приколы.",
  "За то, что иногда смеёшься даже над самой ужасной шуткой.",
  "За твой взгляд, когда я опять пошутил не вовремя.",
  "За то, что даже после моих неуместных шуток мне хочется тебя обнять.",
  "За наши разговоры обо всём на свете.",
  "За наши переписки.",
  "За наши общие шутки, которые никто другой не поймёт.",
  "За то, что с тобой даже обычный день становится особенным.",
  "За то, что мне хочется рассказывать тебе обо всём.",
  "За то, что ты первый человек, которому хочется написать.",
  "За то, что я скучаю по тебе даже после недавнего прощания.",
  "За то, что ты умеешь поднимать мне настроение.",
  "За то, что рядом с тобой мне хорошо.",
  "За твою нежность.",
  "За твою заботу.",
  "За то, что мне важно твоё настроение.",
  "За то, что мне хочется поддерживать тебя.",
  "За то, что я хочу учиться лучше понимать тебя.",
  "За то, что ты вдохновляешь меня становиться лучше.",
  "За то, что мне хочется беречь твои чувства.",
  "За то, что я хочу научиться вовремя быть серьёзным, когда тебе это нужно.",
  "За то, что с тобой хочется делиться даже мелочами.",
  "За то, что ты умеешь удивлять меня.",
  "За наши воспоминания.",
  "За моменты, когда мы смеёмся над какой-то ерундой.",
  "За то, что у нас есть свои маленькие секреты.",
  "За то, что мне хочется придумывать для тебя сюрпризы.",
  "За то, что я запоминаю мелочи, связанные с тобой.",
  "За то, что мне хочется проводить с тобой больше времени.",
  "За то, что я представляю наше будущее.",
  "За то, что мне хочется открывать с тобой новые места.",
  "За то, что даже простые планы с тобой становятся особенными.",
  "За то, что я хочу создавать с тобой новые воспоминания.",
  "За то, что ты можешь сделать мой день лучше одним сообщением.",
  "За то, что мне интересно узнавать тебя снова и снова.",
  "За то, что ты не обязана быть идеальной, чтобы быть любимой.",
  "За то, что я хочу быть рядом не только в хорошие дни.",
  "За то, что мне хочется видеть тебя счастливой.",
  "За то, что рядом с тобой я могу быть и смешным, и серьёзным.",
  "За то, что с тобой хочется говорить даже тогда, когда уже не о чем.",
  "За то, что мне нравится сама мысль о наших будущих встречах.",
  "За то, что среди миллионов людей именно ты стала такой важной для меня.",
  "За то, что это ты. И мне не нужна другая причина."
],

  // Переписка для блока секретного архива.
  telegramChat: [
    { sender: "her", type: "text", text: "матвей" },
    { sender: "her", type: "text", text: "матвей" },
    { sender: "her", type: "text", text: "матвей" },
    { sender: "her", type: "text", text: "матвей" },
    { sender: "her", type: "text", text: "матвей" },
    { sender: "her", type: "text", text: "матвей" },
    { sender: "me", type: "text", text: "Што" },
    { sender: "her", type: "text", text: "го в бс" },
    {
      sender: "her",
      type: "image",
      image: "assets/photos/бь.jpg",
    },
  ],

  // Подписи для новых экспонатов в обновлённом index.html.
  // Это контентная конфигурация; сама интерактивная логика реализуется в script.js.
  archiveArtifacts: {
    timeLock: {
      title: "ХРОНОЛОГИЧЕСКИЙ ЗАМОК",
      lockedMessage: "Этот экспонат откроется в нужный момент. Некоторые воспоминания любят точность.",
      unlockedMessage: "Архив открыт. Самое важное время — то, которое мы разделили."
    },
    audio: {
      title: "АУДИОАРХИВ",
      source: "assets/audio/favorite_song.mp3",
      idleLabel: "Прослушать фрагмент памяти",
      playingLabel: "Пауза"
    },
    metadata: {
      title: "ПАСПОРТ ЭКСПОНАТА",
      fields: [
        { label: "Коллекция", value: "Matvey & Anya" },
        { label: "Архивный номер", value: "2411" },
        { label: "Категория", value: "Личные воспоминания" },
        { label: "Статус", value: "Сохранено навсегда" }
      ]
    },
    ticket: {
      title: "БИЛЕТ В НАШ АРХИВ",
      serial: "MA-2411-1022",
      stamp: "ADMIT ONE · FOREVER"
    },
    comparison: {
      beforeLabel: "ТОГДА",
      afterLabel: "СЕЙЧАС",
      beforeImage: "assets/photos/chain_1.jpg",
      afterImage: "assets/photos/date_1.jpg"
    },
    easterEgg: {
      triggerLabel: "НЕ НАЖИМАТЬ",
      message: "Секрет найден. Из всех случайностей эта — моя любимая. ❤️"
    },
    melody: {
      // Значения должны совпадать с data-note у кнопок в index.html.
      sequence: ["2", "4", "1", "1"],
      successMessage: "Мелодия совпала. Доступ к воспоминанию открыт. ❤️",
      errorMessage: "Почти. Попробуй ещё раз — у каждой истории свой ритм."
    }
  }
};
