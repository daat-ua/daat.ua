// Placeholder case cards (the case pages' "other cases" when a case picks none). TODO content: everything here.
// The video testimonials are Sanity's "Video testimonials" (src/components/atlas-landing/sections/Testimonials.astro).

import case1 from "../assets/images/cases/case-1.webp";
import case2 from "../assets/images/cases/case-2.webp";
import case3 from "../assets/images/cases/case-3.webp";
import case4 from "../assets/images/cases/case-4.webp";
import type { Teaser } from "../components/ui/Carousel.astro";

export const cases: Teaser[] = [
  {
    image: case1,
    tag: "Аутсорс · 120 людей",
    title: "Fixed-price без збитків: як аутсорс-компанія вбудувала Discovery у кожну угоду",
    href: "#",
  },
  {
    image: case2,
    tag: "Продукт · 60 людей",
    title: "CTO, який знову став CTO: як продуктова команда вийшла з режиму пожеж",
    href: "#",
  },
  {
    image: case3,
    tag: "Аутсорс · 250 людей",
    title: "Засновник більше не вузьке місце: як компанія підготувала управління до інвестора",
    href: "#",
  },
  {
    image: case4,
    tag: "Аутстаф · 80 людей",
    title: "Один клієнт&nbsp;— один ризик: як компанія диверсифікувала виручку за рік",
    href: "#",
  },
];
