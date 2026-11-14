// "Все про менеджмент делівері" (DAA-231): Olena Kyianovska's YouTube series, an index and a page per episode
// (src/pages/uk-UA/delivery-management/). Placeholder content until the episodes come from Sanity: the titles,
// dates and descriptions are the playlist's; each episode's text, its retelling as prose (not a verbatim
// transcript), is placeholder copy in square brackets.

export const playlistUrl = "https://www.youtube.com/playlist?list=PLnPvYdKtAEr6Iu244KhyxFpCAbC9SLZoL";

export interface Episode {
  slug: string;
  youtubeId: string;
  title: string;
  /** ISO date; orders the episodes (not shown) */
  publishedAt: string;
  /** one or two sentences for the teasers */
  teaser: string;
  /** the episode page's opening paragraph */
  lead: string;
  /** the episode retold as prose, paragraph by paragraph */
  body: string[];
}

const placeholderBody = [
  "[Абзац: перша думка випуску, переказана як текст статті, а не дослівний транскрипт.]",
  "[Абзац: як ця проблема виглядає в компанії, з прикладом або кейсом, який наводить Олена.]",
  "[Абзац: що з цим робити: кроки, інструменти чи рішення з випуску.]",
  "[Абзац: висновок і до чого варто придивитися у своїй компанії.]",
];

/** newest first */
export const episodes: Episode[] = [
  {
    slug: "who-does-your-company-need",
    youtubeId: "6HezyNDQjM8",
    title: "Кого насправді потребує ваша компанія?",
    publishedAt: "2026-06-10",
    teaser: "Delivery-менеджер — панацея від усіх проблем? Ні!",
    lead: "Delivery-менеджер — панацея від усіх проблем? Ні! У 80%+ випадків маленьким і середнім компаніям потрібен не delivery-менеджер, а PM Lead.",
    body: placeholderBody,
  },
  {
    slug: "ceo-as-chief-pm",
    youtubeId: "zE8vvhCmKpw",
    title: "CEO = головний PM? Чому команда вчиться безпорадності",
    publishedAt: "2026-06-03",
    teaser: "CEO кидає все і вирішує ескалацію, а команда складає руки і чекає. Знайомо?",
    lead: "CEO кидає все і вирішує ескалацію, а команда складає руки і чекає. Знайомо? Загинайте пальці, якщо бачили такі кейси.",
    body: placeholderBody,
  },
  {
    slug: "ferrari-and-the-childrens-hospital",
    youtubeId: "a3yxj5ot7Ac",
    title: "Як Ferrari врятувала життя дітей у лондонській лікарні (і до чого тут IT)",
    publishedAt: "2026-04-29",
    teaser:
      "Що спільного між командою Formula 1 Ferrari, дитячою лікарнею Great Ormond Street Hospital у Лондоні та IT?",
    lead: "Що спільного між командою Formula 1 Ferrari, дитячою лікарнею Great Ormond Street Hospital у Лондоні та IT?",
    body: placeholderBody,
  },
  {
    slug: "cheap-project-managers-cost-more",
    youtubeId: "nfB6V_-4Jr0",
    title: "Чому дешеві project-менеджери коштують дорого",
    publishedAt: "2026-03-18",
    teaser:
      "Чому не треба наймати дешевих project-менеджерів? Розповідаю кейс, коли компанія наймала тільки trainee/junior PM без сталого фреймворку управління проєктами.",
    lead: "Чому не треба наймати дешевих project-менеджерів? Розповідаю кейс, коли компанія наймала тільки trainee/junior PM без сталого фреймворку управління проєктами. Результат: проєкт на $40K перетворився на $115K безкоштовної роботи.",
    body: placeholderBody,
  },
  {
    slug: "how-teams-kill-client-ltv",
    youtubeId: "HrBaoyCGwfU",
    title: "Як команда вбиває LTV клієнта",
    publishedAt: "2026-03-12",
    teaser: "Ви працюєте з клієнтом довго, вклали зусилля в стосунки, нарешті з’явилась довіра.",
    lead: "Ви працюєте з клієнтом довго, вклали зусилля в стосунки, нарешті з’явилась довіра. Можна розслабитись? НІ!",
    body: placeholderBody,
  },
  {
    slug: "net-5-payment-terms",
    youtubeId: "HymeRoJActY",
    title: "Як переконати клієнта платити Net 5",
    publishedAt: "2026-02-25",
    teaser: "Маленькі та середні компанії бояться говорити з клієнтом про payment terms.",
    lead: "Маленькі та середні компанії бояться говорити з клієнтом про payment terms. Даремно! Гарне делівері не допоможе, якщо клієнт заплатить через 2 місяці.",
    body: placeholderBody,
  },
  {
    slug: "overdependency-on-big-clients",
    youtubeId: "SsvORg_zs7A",
    title: "Оверзалежність від великих клієнтів",
    publishedAt: "2026-02-19",
    teaser: "«Добре зафіксований пацієнт не потребує анестезії» — але в ролі пацієнта ваша компанія.",
    lead: "«Добре зафіксований пацієнт не потребує анестезії» — але в ролі пацієнта ваша компанія. Коли один клієнт займає 80% revenue, він диктує умови поставок, оплат, прайси і викручує руки на повну. Кожна 2-3 IT компанія стикається з цим.",
    body: placeholderBody,
  },
  {
    slug: "design-driven-approach",
    youtubeId: "94hJGFRSgog",
    title: "Чому design-driven підхід вбиває малий IT-бізнес",
    publishedAt: "2026-02-11",
    teaser:
      "«Нам простіше знімати вимоги, коли у клієнта дизайн перед очима» — так у моє життя ввійшов design-driven approach.",
    lead: "«Нам простіше знімати вимоги, коли у клієнта дизайн перед очима» — так у моє життя ввійшов design-driven approach. Окей для клієнтів без досвіду, але чому маленькі та середні аутсорсингові компанії роблять цю помилку? Розбираємо, чому цей підхід не працює для малого бізнесу.",
    body: placeholderBody,
  },
  {
    slug: "dont-skip-discovery",
    youtubeId: "2FLTQXdrrY4",
    title: "4 причини не пропускати Discovery-фазу в розробці",
    publishedAt: "2026-02-04",
    teaser:
      "Робити проєкти без discovery — це суцільне гусарство. Уявіть дуель, де ви приблизно знаєте дату, приблизно розумієте зброю, і всі намагаються влучити в ціль, яка рухається.",
    lead: "Робити проєкти без discovery — це суцільне гусарство. Уявіть дуель, де ви приблизно знаєте дату, приблизно розумієте зброю, і всі намагаються влучити в ціль, яка рухається. Це повноцінний бедлам!",
    body: placeholderBody,
  },
  {
    slug: "clients-who-pay-late",
    youtubeId: "eoplSnN9NZA",
    title: "Що робити з клієнтами, які не платять вчасно",
    publishedAt: "2026-01-28",
    teaser: "Немає жодної компанії, яка не стикалась з клієнтами, які затримують оплату.",
    lead: "Немає жодної компанії, яка не стикалась з клієнтами, які затримують оплату. Чому ви субсидуєте бізнес клієнта за рахунок своєї компанії? Розбираємо покроковий план, як змусити клієнтів платити вчасно.",
    body: placeholderBody,
  },
  {
    slug: "documented-development-process",
    youtubeId: "fI1hG43UkR4",
    title: "Бюрократія чи необхідність? Чому вам потрібен описаний процес",
    publishedAt: "2026-01-21",
    teaser: "У консалтинговій практиці ми часто бачимо невпорядковані процеси розробки.",
    lead: "У консалтинговій практиці ми часто бачимо невпорядковані процеси розробки. Після delivery-аудиту одна з ключових рекомендацій — описати SDLC (Software Development Lifecycle). Але навіщо це потрібно?",
    body: placeholderBody,
  },
  {
    slug: "upsell-process",
    youtubeId: "D_-jzXB-Pi0",
    title: "Як налаштувати системний процес апсейлів",
    publishedAt: "2026-01-14",
    teaser: "На ринку всі шукають нових клієнтів, але забувають про роботу з поточними.",
    lead: "На ринку всі шукають нових клієнтів, але забувають про роботу з поточними. В більшості компаній немає системного процесу апсейлів. Розбираємо покроковий фреймворк для налаштування upsell процесів у вашій компанії.",
    body: placeholderBody,
  },
  {
    slug: "delivery-manager-skills",
    youtubeId: "o-58AxilHYs",
    title: "6 ключових навичок делівері-менеджера",
    publishedAt: "2026-01-07",
    teaser: "Чому гарний проджект-менеджер не завжди стає успішним делівері-менеджером?",
    lead: "Чому гарний проджект-менеджер не завжди стає успішним делівері-менеджером? Розбираємо 6 ключових навичок, які необхідні для успіху на позиції delivery manager.",
    body: placeholderBody,
  },
  {
    slug: "weekly-project-metrics",
    youtubeId: "QZe6X_YPC0o",
    title: "4 групи показників для щотижневого контролю ваших проєктів",
    publishedAt: "2025-12-25",
    teaser:
      "Проблеми з делівері проєктів? Дізнайтеся про 4 ключові групи показників, які потрібно відстежувати щотижня, щоб тримати ваші проєкти під контролем.",
    lead: "Проблеми з делівері проєктів? Дізнайтеся про 4 ключові групи показників, які потрібно відстежувати щотижня, щоб тримати ваші проєкти під контролем. У цьому відео розглядаємо: Показники роботи проєкту (SPI & CPI) — Встигайте в рамках дедлайнів і бюджетів Відстеження проблем - Виявляйте та вирішуйте проблеми до того, як вони стануть очевидні клієнту Фінансове здоров’я клієнта - Контролюйте інвойси, платежі та запобігайте боргам Показники якості - Відстежуйте баги, аудити процесів та рівень задоволеності клієнтів Ці показники допоможуть вам:",
    body: placeholderBody,
  },
  {
    slug: "who-is-a-delivery-manager",
    youtubeId: "GyfhfZ-zJ5Q",
    title: "Хто такий Delivery Manager? Все про одну з найбільш неоднозначних позицій в IT",
    publishedAt: "2025-12-19",
    teaser:
      "Delivery Manager — професія, якої офіційно не існує в класифікаторах, але люди та цінність, яку вони приносять, реальні.",
    lead: "Delivery Manager — професія, якої офіційно не існує в класифікаторах, але люди та цінність, яку вони приносять, реальні. Розбираємо чотири типи делівері-менеджерів на ринку.",
    body: placeholderBody,
  },
];

/** YouTube's still for an episode: 320 / 640 / 1280 px wide (all 16:9 but the 640, letterboxed 4:3) */
export const thumbnail = (id: string, size: "mqdefault" | "sddefault" | "maxresdefault") =>
  `https://i.ytimg.com/vi/${id}/${size}.jpg`;
export const thumbnailSrcset = (id: string) =>
  `${thumbnail(id, "mqdefault")} 320w, ${thumbnail(id, "maxresdefault")} 1280w`;
