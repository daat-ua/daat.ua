// Case studies (DAA-230): the content model of a case page (src/pages/uk-UA/case-studies/[slug].astro) and,
// for now, one sample with the mockup's placeholder copy ("Шаблон сторінки кейсу"). Square brackets mark what
// a real case fills in. Strings may contain HTML (&nbsp;, <strong>, <span class="brand">) and are rendered
// with set:html. A draft is built but kept out of search results.

import type { ImageMetadata } from "astro";
import type { Enabler } from "./enablers";
import growthCeilingHero from "../assets/images/cases/case-2-hero.jpg";

export interface CaseStudy {
  slug: string;
  draft?: boolean;
  /** the first screen's artwork, faded into the paper behind the title */
  image: ImageMetadata;
  title: string;
  lead: string;
  /** "Профіль клієнта": label and value; a value with `href` links to it */
  profile: { label: string; value: string; href?: string }[];
  /** the key figures under the hero */
  figures: { value: string; label: string }[];
  context: { paragraphs: string[]; quote: string };
  phases: { label: string; title: string; text: string }[];
  phasesText: string[];
  findings: {
    intro: string;
    items: { title: string; text: string; finding: { slug?: string; label: string } }[];
  };
  /** the maturity index (1–5) per maturity component, and overall */
  maturity: { scores: Record<Enabler, number>; total: number; totalNote: string };
  /** the roadmap: the trajectory, then one tab and column per horizon */
  roadmap: { lead: string; horizons: { tab: string; label: string; title: string; text: string }[] };
  changes: { rows: { metric: string; before: string; after: string; period: string }[]; text: string[] };
  testimonial: { quote: string; author: string; transcriptHref?: string };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "growth-ceiling-founder",
    draft: true,
    image: growthCeilingHero,
    title: "Звідки береться стеля зростання, коли все тримається на засновнику",
    lead: 'Українська <span class="nowrap">IT-сервісна</span> компанія на ~50 людей росла, але кожен новий проєкт давався важче. Діагностика ATLAS за 5 тижнів знайшла одне ключове обмеження&nbsp;— і клієнт почав його усувати ще до фінального звіту.',
    profile: [
      { label: "Галузь", value: "IT-сервіси / аутсорс" },
      { label: "Розмір", value: "~50 людей" },
      { label: "Ринок", value: "Україна · [клієнти: ЄС / США]" },
      { label: "Замовник", value: "Засновник-CEO" },
      { label: "Ситуація", value: "S-5 · Масштабування без зламів", href: "#" },
      { label: "Тривалість", value: "4–5 тижнів" },
      { label: "Рік", value: "[2026]" },
    ],
    figures: [
      { value: "5", label: "інтерв’ю з керівниками" },
      { value: "8", label: "наскрізних тем" },
      { value: "1", label: "ключове обмеження зростання" },
      { value: "2,5 → 3,4", label: "цільовий індекс зрілості за 18 місяців" },
    ],
    context: {
      paragraphs: [
        "[Абзац 1: хто клієнт, на якому етапі зростання, що відбувалося з компанією, коли вона звернулася.]",
        "[Абзац 2: які симптоми бачив власник і що вже пробували змінити до діагностики.]",
      ],
      quote: "[Як клієнт сам описував проблему на старті&nbsp;— цитата з інтерв’ю.]",
    },
    phases: [
      { label: "Фаза 0", title: "Ініціація", text: "Скоуп, стейкхолдери, NDA" },
      { label: "Фаза 1", title: "Докази", text: "5 інтерв’ю, документи, дані систем" },
      { label: "Фази 2–4", title: "Оцінювання й синтез", text: "28 клітинок, теми, ризики" },
      { label: "Фази 5–6", title: "Дорожня карта й валідація", text: "3 горизонти, сесія з керівництвом" },
    ],
    phasesText: ["[Абзац: хто брав участь, скільки інтерв’ю, які дані зібрали і скільки часу це забрало в команди.]"],
    findings: {
      intro:
        "Із 8 наскрізних тем чотири склались у ключову петлю: дефіцит часу керівників не давав упровадити те, що вже було спроєктовано.",
      items: [
        {
          title: "Оцінка fixed-price без Discovery",
          text: "Маржа губилась ще на етапі продажу: оцінку робила одна перевантажена людина, delivery не брав участі в пресейлі.",
          finding: {
            slug: "insufficient-skills-among-project-managers",
            label: "недостатні навички проджект менеджерів",
          },
        },
        {
          title: "Засновник&nbsp;— єдина точка інтеграції",
          text: "Ключові рішення, клієнти й ескалації проходили через CEO&nbsp;— компанія не могла рости швидше за його календар.",
          finding: { label: "[знахідка про роль засновника&nbsp;— в плані]" },
        },
        {
          title: "Дизайн випереджає впровадження",
          text: "Процеси й фреймворки були добре спроєктовані, але не приживались: бракувало часу й залученості, щоб їх упровадити.",
          finding: { slug: "lack-of-standartised-sdlc", label: "відсутність стандартизованого SDLC" },
        },
        {
          title: "Знання в головах, а не в процесах",
          text: "Інституційні знання трималися на окремих людях&nbsp;— кожен відхід забирав шматок компанії.",
          finding: {
            slug: "lack-of-standardized-resource-management-in-it-companies",
            label: "відсутність стандартизованого ресурс менеджменту",
          },
        },
      ],
    },
    maturity: {
      scores: {
        "strategy-portfolio": 3.1,
        "structure-governance": 3.0,
        "leadership-decision-making": 2.8,
        "delivery-operating-system": 2.3,
        "capabilities-competency": 2.3,
        "people-capacity": 2.2,
        "engineering-delivery-culture": 1.8,
      },
      total: 2.5,
      totalNote: "нижче рівня «Визначений»",
    },
    roadmap: {
      lead: "Цільова траєкторія індексу зрілості: 2,5&nbsp;→ 2,7&nbsp;→ 3,0&nbsp;→ 3,4 за 18&nbsp;місяців. Головний «розблокувальник»&nbsp;— захист часу керівників.",
      horizons: [
        {
          tab: '<span class="nowrap">0–3 місяці</span>',
          label: "H1 · 0–3 міс.",
          title: "Стабілізувати й розблокувати",
          text: "Захистити час керівників; фільтр на оцінку fixed-price; раннє попередження про концентрацію.",
        },
        {
          tab: '<span class="nowrap">3–9 місяців</span>',
          label: "H2 · 3–9 міс.",
          title: "Інституціо&shy;налізувати", // a break point for a narrow column
          text: "Управління якістю й code review; єдиний SDLC і SOP; OKR і матриця компетенцій.",
        },
        {
          tab: '<span class="nowrap">9–18 місяців</span>',
          label: "H3 · 9–18 міс.",
          title: "Масштабувати й знизити ризики",
          text: "Хеджування концентрації клієнтів; передача повноважень від засновника; повторна діагностика.",
        },
      ],
    },
    changes: {
      rows: [
        { metric: "[Метрика 1]", before: "[до]", after: "[після]", period: "[за N міс.]" },
        { metric: "[Метрика 2]", before: "[до]", after: "[після]", period: "[за N міс.]" },
        { metric: "[Метрика 3]", before: "[до]", after: "[після]", period: "[за N міс.]" },
      ],
      text: [
        "[Абзац: лише реальні, погоджені з клієнтом цифри. Якщо результатів ще немає&nbsp;— що вже зроблено і дата повторної діагностики.]",
      ],
    },
    testimonial: {
      quote: "[Цитата з відео про результат&nbsp;— до 25 слів.]",
      author: "[Ім’я], [посада]",
      transcriptHref: "#",
    },
  },
];
