// "Знахідки аудитів": the teaser carousel. TODO content: draft teaser titles; link each card to its guide.

import finding1 from "../assets/images/findings/finding-1.webp";
import finding2 from "../assets/images/findings/finding-2.webp";
import finding3 from "../assets/images/findings/finding-3.webp";
import finding4 from "../assets/images/findings/finding-4.webp";
import finding5 from "../assets/images/findings/finding-5.webp";
import finding6 from "../assets/images/findings/finding-6.webp";
import finding7 from "../assets/images/findings/finding-7.webp";
import finding8 from "../assets/images/findings/finding-8.webp";
import type { Teaser } from "../components/ui/Carousel.astro";

export const findings: Teaser[] = [
  {
    image: finding1,
    tag: "Люди та ресурси",
    title: "Коли все тримається на трьох людях: як героїзм стає системним ризиком",
    href: "#",
  },
  {
    image: finding2,
    tag: "Операційна система delivery",
    title: "Fixed-price без Discovery: чому прибуткові угоди стають збитковими",
    href: "#",
  },
  {
    image: finding3,
    tag: "Спроможності та компетенції",
    title: "Матриця компетенцій, якої ніхто не відкриває: що замінює довільне оцінювання",
    href: "#",
  },
  {
    image: finding4,
    tag: "Операційна система delivery",
    title: "Code review, що зник: як якість просідає непомітно&nbsp;— і як її повернути",
    href: "#",
  },
  {
    image: finding5,
    tag: "Люди та ресурси",
    title: 'Керівники без часу на керування: як CTO повертає <span class="nowrap">60%</span> свого тижня',
    href: "#",
  },
  {
    image: finding6,
    tag: "Спроможності та компетенції",
    title: "AI-код без гейтів якості: що перевіряти, перш ніж зливати",
    href: "#",
  },
  {
    image: finding7,
    tag: "Операційна система delivery",
    title: "Один SDLC замість п’яти: як компанія перестала винаходити процес заново",
    href: "#",
  },
  {
    image: finding8,
    tag: "Люди та ресурси",
    title: "Утилізація проти вигорання: де межа, після якої команда перестає рости",
    href: "#",
  },
];
