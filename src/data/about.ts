// "Про нас" (src/pages/uk-UA/about.astro): the founders, linked from the first screen, and "Daat у цифрах".
// The stats' texts may contain HTML (&nbsp;) and are rendered with set:html.

export interface Founder {
  name: string;
  href: string;
}

export const founders: [Founder, Founder] = [
  { name: "Сергій Герасимов", href: "https://www.linkedin.com/in/serhiiherasymov/" },
  { name: "Олена Кияновська", href: "https://www.linkedin.com/in/helenkyianovska/" },
];

export interface Stat {
  title: string;
  text: string;
  value: string;
}

export const stats: Stat[] = [
  {
    title: "Рік заснування",
    text: "Олена та Сергій перетворили багаторічний досвід керівників в IT на консалтинг для інших компаній.",
    value: "2024",
  },
  {
    title: "Проведені аудити",
    text: "Діагностика зростання для сервісних компаній та продуктових команд різного масштабу.",
    value: "30+",
  },
  {
    title: "Років досвіду",
    text: "Сумарний досвід команди в управлінні розробкою, процесами та продуктами.",
    value: "25+",
  },
  {
    title: "Фокус на результат",
    text: "Кожен аудит завершується конкретним планом дій, а не абстрактними рекомендаціями.",
    value: "100%",
  },
];
