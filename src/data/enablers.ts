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
