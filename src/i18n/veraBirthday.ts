export type VeraLanguage = 'es' | 'ru' | 'en';

export type VeraScene = {
  title: string;
  body: string[];
};

export type VeraBirthdayTranslation = {
  scenes: VeraScene[];
};

export const languageLabels: Record<VeraLanguage, string> = {
  es: 'ES',
  ru: 'RU',
  en: 'EN',
};

export const veraBirthdayTranslations: Record<VeraLanguage, VeraBirthdayTranslation> = {
  es: {
    scenes: [
      {
        title: 'EN NUESTRO ENCUENTRO',
        body: [
          'Como aquella flor que acaba de brotar,',
          'todo comienza con algo sencillo.',
          'Una conversación.',
          'Una historia compartida.',
          'Una pequeña curiosidad por conocer a quien está al otro lado.',
          'Y sin darse cuenta,',
          'la flor comienza a abrirse.',
        ],
      },
      {
        title: 'TRES FORMAS DE DECIRLO',
        body: [
          'Puede ser dicho en la hermosura del Español,',
          'en la intelectualidad del Ruso,',
          'o en esa rebelde formalidad del English.',
        ],
      },
      {
        title: 'NUESTRO TIEMPO',
        body: [
          'Pero quiero que sepas que en todo este tiempo,',
          'ya casi dos meses,',
          'donde todos los días compartimos alguna historia',
          'o reflexiones de vida...',
        ],
      },
      {
        title: 'UN LINDO ENCUENTRO',
        body: [
          'Ha sido para mí un lindo encuentro,',
          'como aquel día en que la flor encontró',
          'por primera vez ese rayo de luz',
          'y se abrió para mostrar al mundo sus colores.',
        ],
      },
      {
        title: 'PARA TI, VERA',
        body: ['Vera,', 'espero que hoy en tu día', 'sientas esa bella energía.'],
      },
      {
        title: 'С ДНЁМ РОЖДЕНИЯ, ВЕРА',
        body: ['Feliz cumpleaños.'],
      },
      {
        title: 'EL JARDÍN Y EL SOL',
        body: ['El jardín florece completamente.', 'El sol aparece,', 'todo brilla.'],
      },
    ],
  },
  ru: {
    scenes: [
      {
        title: 'НАША ВСТРЕЧА',
        body: [
          'Как цветок, который только начинает расти,',
          'всё начинается с чего-то простого.',
          'Разговор.',
          'Общая история.',
          'Маленькое любопытство узнать того, кто по другую сторону.',
          'И незаметно',
          'цветок начинает раскрываться.',
        ],
      },
      {
        title: 'ТРИ СПОСОБА СКАЗАТЬ ЭТО',
        body: [
          'Это можно сказать в красоте испанского,',
          'в интеллектуальности русского,',
          'или в мятежной формальности английского.',
        ],
      },
      {
        title: 'НАШЕ ВРЕМЯ',
        body: [
          'Но я хочу, чтобы ты знала: за всё это время,',
          'почти два месяца,',
          'когда каждый день мы делились историями',
          'или размышлениями о жизни...',
        ],
      },
      {
        title: 'КРАСИВАЯ ВСТРЕЧА',
        body: [
          'Для меня это была красивая встреча,',
          'как тот день, когда цветок впервые нашёл',
          'луч света',
          'и раскрылся, чтобы показать миру свои цвета.',
        ],
      },
      {
        title: 'ДЛЯ ТЕБЯ, ВЕРА',
        body: ['Вера,', 'я надеюсь, что сегодня, в твой день,', 'ты почувствуешь эту прекрасную энергию.'],
      },
      {
        title: 'С ДНЁМ РОЖДЕНИЯ, ВЕРА',
        body: ['С днём рождения.'],
      },
      {
        title: 'САД И СОЛНЦЕ',
        body: ['Сад полностью расцветает.', 'Появляется солнце,', 'всё сияет.'],
      },
    ],
  },
  en: {
    scenes: [
      {
        title: 'IN OUR ENCOUNTER',
        body: [
          'Like a flower that has just begun to bloom,',
          'everything starts with something simple.',
          'A conversation.',
          'A shared story.',
          'A small curiosity to know who is on the other side.',
          'And without noticing,',
          'the flower begins to open.',
        ],
      },
      {
        title: 'THREE WAYS TO SAY IT',
        body: [
          'It can be said in the beauty of Spanish,',
          'in the intellect of Russian,',
          'or in that rebellious formality of English.',
        ],
      },
      {
        title: 'OUR TIME',
        body: [
          'But I want you to know that in all this time,',
          'almost two months now,',
          'where every day we shared a story',
          'or reflections about life...',
        ],
      },
      {
        title: 'A LOVELY ENCOUNTER',
        body: [
          'For me it has been a lovely encounter,',
          'like the day the flower found',
          'its first ray of light',
          'and opened to show the world its colors.',
        ],
      },
      {
        title: 'FOR YOU, VERA',
        body: ['Vera,', 'I hope today, on your day,', 'you feel that beautiful energy.'],
      },
      {
        title: 'С ДНЁМ РОЖДЕНИЯ, ВЕРА',
        body: ['Happy birthday.'],
      },
      {
        title: 'THE GARDEN AND THE SUN',
        body: ['The garden blooms completely.', 'The sun appears,', 'everything shines.'],
      },
    ],
  },
};
