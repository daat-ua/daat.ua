// "Як працює ATLAS": what ATLAS assesses (enablers, RADAR-IT, the 1–5 scale), how a project runs (seven
// phases, each leaving an artifact) and the notes beside the timeline. Strings may hold HTML (set:html).

import { enablerNames } from "./enablers";

export const enablers = Object.values(enablerNames);

export const radar = [
  "<strong>Результати</strong>&nbsp;— чого ви досягаєте",
  "<strong>Підхід</strong>&nbsp;— чи є визначений спосіб",
  "<strong>Впровадження</strong>&nbsp;— чи застосовується послідовно",
  "<strong>Оцінка</strong>&nbsp;— чи вимірюється й удосконалюється",
  "<strong>Ризик</strong>&nbsp;— скільки коштуватиме бездіяльність",
];

/** maturity levels from 5 down to 1 (each gets its signal-strength icon) */
export const scale = [
  "<strong>Оптимізований</strong>&nbsp;— взірець для ринку",
  "<strong>Вимірюваний</strong>&nbsp;— удосконалюється на даних",
  "<strong>Визначений</strong>&nbsp;— стандарт усюди",
  "<strong>Формується</strong>&nbsp;— подекуди, непослідовно",
  "<strong>Ad hoc</strong>&nbsp;— підходу немає",
];

export const notes = [
  "<strong>Конфіденційність:</strong> NDA підписуємо у фазі&nbsp;0&nbsp;— до передачі будь-яких даних.",
  "<strong>Що потрібно від вас:</strong> інтерв’ю з керівниками й ключовими ролями та доступ на читання до даних, які ви вже збираєте.",
  "<strong>10&nbsp;годин</strong> часу вашої команди на всю діагностику&nbsp;— решту робимо ми",
];

export const phases = [
  {
    title: "Ініціація",
    text: "Скоуп, доступи, NDA",
    artifact: "Хартія проєкту",
  },
  {
    title: "Докази",
    text: 'Документи, інтерв’ю, дані систем, <span class="nowrap">1–2 тижні</span>',
    artifact: "Реєстр доказів",
  },
  {
    title: "Оцінювання",
    text: "28 клітинок за рубриками",
    artifact: "Scorecard зрілості",
  },
  {
    title: "Синтез",
    text: "Групування за першопричинами",
    artifact: "Мапа тем",
  },
  {
    title: "Ризики",
    text: "Імовірність × вплив",
    artifact: "Реєстр ризиків",
  },
  {
    title: "Дорожня карта",
    text: "Пріоритети, 3 горизонти",
    artifact: "Дорожня карта зростання",
  },
  {
    title: "Валідація",
    text: "Ви перевіряєте факти",
    artifact: "Звіт + сесія з керівництвом",
  },
];
