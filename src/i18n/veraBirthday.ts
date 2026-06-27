export type VeraLanguage = 'es' | 'ru' | 'en';

export type VeraScene = {
  title: string;
  body: string[];
};

export type VeraBirthdayTranslation = {
  scenes: VeraScene[];
};

export const languageLabels: Record<VeraLanguage, string> = {
  es: '🇪🇸 ES',
  ru: '🇷🇺 RU',
  en: '🇬🇧 EN',
};

const poemScenesEs: VeraScene[] = [
  {
    title: '',
    body: [
      'Hola Vera.',
      '',
      'Quise crear este pequeño espacio para ti.',
      '',
      'Un lugar donde reunir algunas palabras, pensamientos y emociones',
      'que han surgido durante este tiempo.',
      '',
      'Porque, aunque no ha pasado tanto,',
      'ya son casi dos meses compartiendo historias, ideas',
      'y reflexiones sobre la vida.',
      '',
      'Y de alguna manera,',
      'me alegra mucho que nuestros caminos se hayan cruzado.',
      '',
      'Con alegría espero disfrutes de este pequeño detalle.',
      '',
      'Y ahora...',
      '',
      'Un poema para ti.',
      '✦',
      '(CON ALAS Y FLECHAS)',
      'Federico García Lorca',
    ],
  },
  {
    title: '',
    body: [
      'La primera vez',
      'no te conocí.',
      'La segunda, sí.',
      '',
      'Dime',
      'si el aire te lo dice.',
    ],
  },
  {
    title: '',
    body: [
      'Mañanita fría',
      'yo me puse triste,',
      'y luego me entraron',
      'ganas de reírme.',
    ],
  },
  {
    title: '',
    body: [
      'No te conocí.',
      'Sí me conociste.',
      'Sí te conocí.',
      'No me conociste.',
    ],
  },
  {
    title: '',
    body: [
      'Ahora entre los dos',
      'se alarga impasible,',
      'un mes, como un',
      'biombo de días grises.',
    ],
  },
  {
    title: '',
    body: [
      'La primera vez',
      'no te conocí.',
      'La segunda, sí.',
      '✦',
    ],
  },
  {
    title: '',
    body: [
      'Deseo que hoy en tu día sientas esa enorme energía',
      'la grandiosa fuerza vital para hacer de tus sueños una verdad.',
    ],
  },
  {
    title: '¡FELIZ\nCumpleaños!',
    body: [],
  },
];

const poemScenesRu: VeraScene[] = [
  {
    title: '',
    body: [
      'Привет, Вера.',
      '',
      'Я захотел создать это маленькое пространство для тебя.',
      '',
      'Место, где можно собрать несколько слов, мыслей и эмоций,',
      'которые появились за это время.',
      '',
      'Потому что, хотя прошло не так много времени,',
      'это уже почти два месяца, в течение которых мы делимся историями, идеями',
      'и размышлениями о жизни.',
      '',
      'И в каком-то смысле',
      'мне очень радостно, что наши пути пересеклись.',
      '',
      'С радостью надеюсь, что тебе понравится этот маленький знак внимания.',
      '',
      'А теперь...',
      '',
      'Стихотворение для тебя.',
      '✦',
      '(С КРЫЛЬЯМИ И СТРЕЛАМИ)',
      'Федерико Гарсия Лорка',
    ],
  },
  {
    title: '',
    body: [
      'В первый раз',
      'я тебя не узнал.',
      'Во второй — да.',
      '',
      'Скажи мне,',
      'говорит ли тебе об этом воздух.',
    ],
  },
  {
    title: '',
    body: [
      'Холодным утром',
      'мне стало грустно,',
      'а потом ко мне пришло',
      'желание рассмеяться.',
    ],
  },
  {
    title: '',
    body: [
      'Я тебя не узнал.',
      'Ты меня узнала.',
      'Я тебя узнал.',
      'Ты меня не узнала.',
    ],
  },
  {
    title: '',
    body: [
      'Теперь между нами',
      'невозмутимо тянется',
      'месяц, словно',
      'ширма серых дней.',
    ],
  },
  {
    title: '',
    body: [
      'В первый раз',
      'я тебя не узнал.',
      'Во второй — да.',
      '✦',
    ],
  },
  {
    title: '',
    body: [
      'Желаю, чтобы сегодня, в твой день, ты почувствовала эту огромную энергию',
      'великую жизненную силу, чтобы превратить свои мечты в реальность.',
    ],
  },
  {
    title: 'С ДНЁМ\nРОЖДЕНИЯ!',
    body: [],
  },
];

const poemScenesEn: VeraScene[] = [
  {
    title: '',
    body: [
      'Hi Vera.',
      '',
      'I wanted to create this little space for you.',
      '',
      'A place to gather a few words, thoughts, and emotions',
      'that have appeared during this time.',
      '',
      'Because, even though not so much time has passed,',
      'it has already been almost two months of sharing stories, ideas,',
      'and reflections about life.',
      '',
      'And somehow,',
      'I am very glad our paths crossed.',
      '',
      'With joy, I hope you enjoy this small gesture.',
      '',
      'And now...',
      '',
      'A poem for you.',
      '✦',
      '(WITH WINGS AND ARROWS)',
      'Federico García Lorca',
    ],
  },
  {
    title: '',
    body: [
      'The first time',
      'I did not know you.',
      'The second, yes.',
      '',
      'Tell me',
      'if the air tells you so.',
    ],
  },
  {
    title: '',
    body: [
      'Cold little morning,',
      'I became sad,',
      'and then I felt',
      'like laughing.',
    ],
  },
  {
    title: '',
    body: [
      'I did not know you.',
      'You did know me.',
      'I did know you.',
      'You did not know me.',
    ],
  },
  {
    title: '',
    body: [
      'Now between us',
      'there stretches, impassive,',
      'a month, like a',
      'screen of gray days.',
    ],
  },
  {
    title: '',
    body: [
      'The first time',
      'I did not know you.',
      'The second, yes.',
      '✦',
    ],
  },
  {
    title: '',
    body: [
      'I wish that today, on your day, you feel that enormous energy',
      'the grand vital force to make your dreams become true.',
    ],
  },
  {
    title: 'HAPPY\nBirthday!',
    body: [],
  },
];

export const veraBirthdayTranslations: Record<VeraLanguage, VeraBirthdayTranslation> = {
  es: {
    scenes: poemScenesEs,
  },
  ru: {
    scenes: poemScenesRu,
  },
  en: {
    scenes: poemScenesEn,
  },
};
