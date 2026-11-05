// "Відгуки клієнтів і кейси". TODO content: everything here is a placeholder — the video posters (crops of
// the case photos), the logos (borrowed from the hero), the copy, the cases (up to four) and their links.

import case1 from "../assets/images/cases/case-1.webp";
import case2 from "../assets/images/cases/case-2.webp";
import case3 from "../assets/images/cases/case-3.webp";
import case4 from "../assets/images/cases/case-4.webp";
import hubspot from "../assets/clients/client-hubspot.svg";
import stripe from "../assets/clients/client-stripe.svg";
import video1 from "../assets/images/testimonials/video-1.webp";
import video2 from "../assets/images/testimonials/video-2.webp";
import type { Teaser } from "../components/ui/Carousel.astro";

/** Video testimonials: the first starts open; strings may hold HTML (set:html) */
export const testimonials = [
  {
    poster: video1,
    headline: "Як CTO повернув собі тиждень і&nbsp;перестав гасити пожежі",
    logo: stripe,
    company: "Stripe",
    text: 'Діагностика ATLAS і дорожня карта для продуктової компанії на <span class="nowrap">60 людей</span>',
    href: "#",
  },
  {
    poster: video2,
    headline: "Засновник більше не вузьке місце: управління, готове до інвестора",
    logo: hubspot,
    company: "HubSpot",
    text: 'Діагностика ATLAS і дорожня карта для аутсорс-компанії на <span class="nowrap">250 людей</span>',
    href: "#",
  },
];

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
