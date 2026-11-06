// The seven ATLAS enablers: the keys a finding's `enabler` holds in Sanity (studio/schemaTypes/post.ts)
// and their Ukrainian names, in the methodology's order. `satisfies` fails the build if the Studio's list
// gains an option that has no name here.

import type { Post } from "../sanity/sanity.types";

export type Enabler = NonNullable<Post["enabler"]>;

export const enablerNames = {
  "strategy-portfolio": "Стратегія та портфель",
  "structure-governance": "Структура та управління",
  "delivery-operating-system": "Операційна система delivery",
  "engineering-delivery-culture": "Інженерна культура й культура delivery",
  "leadership-decision-making": "Лідерство та ухвалення рішень",
  "people-capacity": "Люди та ресурси",
  "capabilities-competency": "Спроможності та компетенції",
} as const satisfies Record<Enabler, string>;

/** One line on what each enabler covers, under its heading in the findings catalogue */
export const enablerDescriptions = {
  "strategy-portfolio":
    "Чи узгоджені стратегія, портфель проєктів і пріоритети компанії\u00a0— і чи доходять вони до команд.",
  "structure-governance":
    "Як влаштовані ролі, відповідальність і управління: хто ухвалює рішення і як компанія контролює виконання.",
  "delivery-operating-system":
    "Процеси, практики й інструменти, з якими компанія передбачувано доставляє результат клієнтам.",
  "engineering-delivery-culture":
    "Інженерні практики, якість і культура delivery: як команди працюють щодня і що вважають нормою.",
  "leadership-decision-making":
    "Як лідери ставлять цілі, ухвалюють рішення й делегують\u00a0— і наскільки компанія залежить від окремих людей.",
  "people-capacity":
    "Завантаження, розподіл і утримання людей: чи вистачає команди, щоб виконувати зобов’язання без вигорання.",
  "capabilities-competency":
    "Навички та компетенції, яких потребує зростання компанії, і системи, що їх розвивають і оцінюють.",
} as const satisfies Record<Enabler, string>;
