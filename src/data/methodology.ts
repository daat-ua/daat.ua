// "Як працює ATLAS": what ATLAS assesses (enablers, RADAR-IT, the 1–5 scale), how a project runs (seven
// phases, each leaving an artifact) and the notes beside the phases. Strings may hold HTML (set:html).

import { enablerNames } from "./enablers";

export const enablers = Object.values(enablerNames);

export const radar = [
  "<strong>Результати</strong>&nbsp;— чого ви досягаєте",
  "<strong>Підхід</strong>&nbsp;— чи є визначений спосіб",
  "<strong>Впровадження</strong>&nbsp;— чи застосовується послідовно",
  "<strong>Оцінка</strong>&nbsp;— чи вимірюється й удосконалюється",
  "<strong>Ризик</strong>&nbsp;— скільки коштуватиме бездіяльність",
];

/** the maturity levels, from 5 down to 1 */
export const scale = [
  { level: 5, name: "Оптимізований", text: "взірець для ринку" },
  { level: 4, name: "Вимірюваний", text: "удосконалюється на даних" },
  { level: 3, name: "Визначений", text: "стандарт усюди" },
  { level: 2, name: "Формується", text: "подекуди, непослідовно" },
  { level: 1, name: "Ad hoc", text: "підходу немає" },
];

export const notes = [
  "<strong>Конфіденційність:</strong> NDA підписуємо у фазі&nbsp;0&nbsp;— до передачі будь-яких даних.",
  "<strong>Що потрібно від вас:</strong> інтерв’ю з керівниками й ключовими ролями та доступ на читання до даних, які ви вже збираєте.",
  "<strong>10&nbsp;годин</strong> часу вашої команди на всю діагностику&nbsp;— решту робимо ми",
];

/** Where each phase falls in the 4–5 weeks, in half weeks from the start: [from, to), 0–10 (week 1 is 0–2).
 * TODO confirm: illustrative. The copy only fixes the frame (a few days) and the evidence (1–2 weeks) */
export type Phase = { title: string; text: string; artifact: string; weeks: [number, number] };

export const phases: Phase[] = [
  {
    title: "Ініціація",
    text: "Скоуп, доступи, NDA",
    artifact: "Бриф проєкту",
    weeks: [0, 1],
  },
  {
    title: "Докази",
    text: 'Документи, інтерв’ю, дані систем, <span class="nowrap">1–2 тижні</span>',
    artifact: "Реєстр доказів",
    weeks: [1, 4],
  },
  {
    title: "Оцінювання",
    text: "28&nbsp;клітинок за рубриками",
    artifact: "Scorecard зрілості",
    weeks: [4, 6],
  },
  {
    title: "Синтез",
    text: "Групування за першопричинами",
    artifact: "Мапа тем",
    weeks: [5, 7],
  },
  {
    title: "Ризики",
    text: "Імовірність&nbsp;× вплив",
    artifact: "Реєстр ризиків",
    weeks: [6, 7],
  },
  {
    title: "Чіткий план змін",
    text: "Пріоритети, 3&nbsp;горизонти",
    artifact: "План змін на&nbsp;18&nbsp;місяців",
    weeks: [7, 9],
  },
  {
    title: "Валідація",
    text: "Ви перевіряєте факти",
    artifact: "Звіт + сесія з&nbsp;керівництвом",
    weeks: [8, 10],
  },
];
