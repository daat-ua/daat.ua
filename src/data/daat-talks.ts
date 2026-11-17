// Daat Talks (DAA-239): the podcast's episodes (the YouTube playlist), the articles written from them and the guests,
// for the index (/uk-UA/daat-talks), the episode pages (/uk-UA/daat-talks/<slug>) and the articles
// (/uk-UA/article/<slug>). Dummy data for now, shaped as the planned Sanity types (daatTalksEpisode,
// daatTalksArticle, daatTalksContributor): the episodes are the playlist's, the articles' text is a draft.

import type { TypedObject } from "astro-portabletext/types";

export interface TalksContributor {
  name: string;
  slug: string;
  role: string;
  company?: string;
  linkedin?: string;
}

export interface TalksEpisode {
  number: number;
  title: string;
  slug: string;
  youtubeUrl: string;
  /** the index's short description */
  teaser: string;
  /** the episode page's description, paragraph by paragraph */
  description: string[];
  guests: TalksContributor[];
  /** the hosts' names (Sanity's `authors`) */
  hosts: string[];
}

export interface TalksArticle {
  title: string;
  slug: string;
  episode: number;
  /** cards on the index and the episode page: the first paragraph */
  excerpt: string;
  /** the second paragraph on the cards, and the article's lead */
  summary: string;
  body: TypedObject[];
  authors: string[];
  contributors: TalksContributor[];
  publishedAt: string;
}

// ---------- Portable Text, written by hand (the shape Sanity will return) ----------

let keys = 0;
const key = () => `k${++keys}`;
const block = (style: string, text: string, extra: object = {}) => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
  ...extra,
});
const p = (text: string) => block("normal", text);
const h2 = (text: string) => block("h2", text);
const h3 = (text: string) => block("h3", text);
const h4 = (text: string) => block("h4", text);
const bullets = (...items: string[]) => items.map((text) => block("normal", text, { listItem: "bullet", level: 1 }));
const numbered = (...items: string[]) => items.map((text) => block("normal", text, { listItem: "number", level: 1 }));
const quote = (text: string, speaker: string, time?: string) => ({
  _type: "pullQuote",
  _key: key(),
  text,
  speaker,
  time,
});
const callout = (title: string, text: string) => ({ _type: "callout", _key: key(), title, text });
const image = (src: string, alt: string, caption?: string) => ({ _type: "image", _key: key(), src, alt, caption });
/** a table as the Rich Table plugin stores it (`richTableBlock`): the first row gives the column titles; an empty
 * first cell there makes the first column the row titles */
const table = ([head, ...rows]: string[][]) => {
  const hasRowTitles = head[0] === "";
  const cells = (row: string[]) => (hasRowTitles ? row.slice(1) : row);
  return {
    _type: "richTableBlock",
    _key: key(),
    hasColumnTitles: true,
    hasRowTitles,
    columnHeaders: cells(head).map((title, cellIndex) => ({ _key: key(), title, cellIndex })),
    rows: rows.map((row) => ({
      _type: "row",
      _key: key(),
      title: hasRowTitles ? row[0] : undefined,
      cells: cells(row).map((text) => ({ _key: key(), content: [p(text)] })),
    })),
  };
};

// ---------- Hosts and guests ----------

const HOSTS = ["Олена Кияновська", "Сергій Герасимов"];
const guest = (name: string, slug: string, role: string, company?: string, linkedin?: string): TalksContributor => ({
  name,
  slug,
  role,
  company,
  linkedin,
});

const vyshnova = guest("Женя Вишньова", "zhenia-vyshnova", "Засновниця та CEO", "Dinarys", "https://www.linkedin.com/");
const kobzar = guest(
  "Тетяна Кобзар",
  "tetiana-kobzar",
  "Фаундерка Diversido, Strategic Account Manager",
  "TechMagic",
  "https://www.linkedin.com/",
);
const loginchuk = guest("Ярослав Логінчук", "yaroslav-loginchuk", "Засновник, fractional CMO/CRO", "O-CMO");
const stupachenko = guest("Сергій Ступаченко", "serhii-stupachenko", "CEO", "Techery");
const verkalets = guest("Іван Веркалець", "ivan-verkalets", "Співзасновник і CTO", "COAX");

// ---------- Episodes: the playlist, newest first ----------

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const episodes: TalksEpisode[] = [
  {
    number: 17,
    title: "Чому підприємці змушені створювати роботу самі собі",
    slug: "chomu-pidpryiemtsi-stvoriuiut-robotu-sami-sobi",
    youtubeUrl: yt("zX71CMQ2wCY"),
    teaser:
      "Шлях жінки-CEO в IT: від першого бізнесу у 2009 році до DevOps-консалтингу, переїзд до Берліна і як AI змінює розробку та запити клієнтів.",
    description: [
      "У новому епізоді говоримо з Женею Вишньовою — засновницею та CEO IT-компанії Dinarys — про підприємництво, жіноче лідерство в технологіях і про те, як будувати та масштабувати бізнес у часи постійних змін.",
      "Від першого бізнесу у 2009 році до DevOps-консалтингу та нового напряму Execution Sustainability — Женя відверто розповідає, що означає бути серійною підприємицею й жінкою-CEO в IT: повернення на сцену після семи років паузи, старт бізнесу в турбулентні часи, переїзд до Берліна і вплив штучного інтелекту на розробку.",
    ],
    guests: [vyshnova],
    hosts: HOSTS,
  },
  {
    number: 16,
    title: "Як продати свою IT-компанію: реальна історія Diversido та TechMagic",
    slug: "yak-prodaty-svoiu-it-kompaniiu",
    youtubeUrl: yt("Ac146NGAZZc"),
    teaser:
      "11 років Diversido, «скляна стеля» на 30 людях і продаж компанії за рекордні два місяці: як проходить M&A для невеликого аутсорсу.",
    description: [
      "Що робити фаундеру, коли компанія стабільна, але «скляна стеля» вже відчувається? Як виглядає M&A-процес для української IT-компанії розміром до 30 людей? І чому інколи стратегічна сесія закінчується сльозами — а через пів року продажем бізнесу?",
      "Олена Кияновська говорить з Тетяною Кобзар — фаундеркою Diversido, яка 11 років будувала компанію в нішах HealthTech, EdTech та IoT, а нещодавно продала її львівській TechMagic.",
    ],
    guests: [kobzar],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 15,
    title: "Як перестати тягнути ковдру і почати заробляти разом",
    slug: "yak-perestaty-tiahnuty-kovdru",
    youtubeUrl: yt("58ul0plNOzs"),
    teaser:
      "Як мають взаємодіяти delivery і маркетинг у сервісних IT-компаніях: від цілей клієнта з першого дня до case study й AI в контенті.",
    description: [
      "Олена Кияновська та Ярослав Логінчук (засновник O-CMO, fractional CMO/CRO) розбирають тему, яку рідко обговорюють відкрито: як насправді мають взаємодіяти delivery і маркетинг у сервісних IT-компаніях.",
      "Хто відповідає за ріст акаунтів, чому маркетинг не може компенсувати погане delivery, як розуміння бізнес-цілей клієнта з першого дня змінює все — від upsell до case study, і як AI допомагає масштабувати контент.",
    ],
    guests: [loginchuk],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 14,
    title: "AI змінює все — від управління командами до delivery проєктів",
    slug: "ai-zminiuie-vse",
    youtubeUrl: yt("wj0YpBI0rMQ"),
    teaser:
      "CEO Techery Сергій Ступаченко — про те, як штучний інтелект змінює розробку, управління командами й delivery, і з чого почати компанії, яка тільки підходить до AI.",
    description: [
      "Розмова з CEO компанії Techery Сергієм Ступаченком, який інтегрує штучний інтелект у розробку програмного забезпечення: як AI змінює все — від управління командами до delivery проєктів, і що це означає для майбутнього tech-індустрії.",
      "Сергій ділиться досвідом впровадження AI-рішень у реальних проєктах, розповідає про помилки та успіхи і дає практичні поради тим, хто тільки починає свій шлях в AI.",
    ],
    guests: [stupachenko],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 13,
    title: "Як керувати IT-компанією під час війни",
    slug: "yak-keruvaty-it-kompaniieiu-pid-chas-viiny",
    youtubeUrl: yt("_jZaFVoreYE"),
    teaser:
      "Іван Веркалець — про шлях від розробника до C-рівня, розвиток COAX, ролі в команді та антикризове управління від COVID-19 до повномасштабної війни.",
    description: [
      "Розмова про навігацію в IT-індустрії в безпрецедентні часи. Іван Веркалець ділиться шляхом від розробника до керівника C-рівня: створення та розвиток компанії COAX, структура команди і постійне навчання в технологічному лідерстві.",
      "Як будувати стійкий IT-бізнес, зберігаючи командний дух і соціальну відповідальність у найскладніших обставинах.",
    ],
    guests: [verkalets],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 12,
    title: "Від перших кроків у бізнесі до AI-інновацій",
    slug: "vid-pershykh-krokiv-do-ai-innovatsii",
    youtubeUrl: yt("_6tKOhIt1b4"),
    teaser:
      "Ірина Микитин — про переломні моменти Coxit, експерименти з AI, майбутнє C++ і досвід жінки в технологіях.",
    description: [
      "Ірина Микитин розповідає про свій шлях у світі технологій та підприємництва: стратегії компанії Coxit, експерименти зі штучним інтелектом, виклики C++-розробки та підходи до управління бізнесом.",
    ],
    guests: [guest("Ірина Микитин", "iryna-mykytyn", "CEO", "Coxit")],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 11,
    title: "Як невеликій сервісній IT-компанії залучати ентерпрайз-клієнтів",
    slug: "yak-zaluchaty-enterpraiz-kliientiv",
    youtubeUrl: yt("fU4fYtMvxlw"),
    teaser:
      "Росс Дзіковський — про співпрацю малого бізнесу з корпоративними замовниками: сертифікації, акаунт-менеджмент і чесність у комунікації.",
    description: [
      "CEO IT-сервісної компанії Росс Дзіковський — про особливості роботи малого бізнесу з великими клієнтами: як будувати стосунки з корпоративними замовниками, виживати на конкурентному ринку та управляти ризиками.",
    ],
    guests: [guest("Росс Дзіковський", "ross-dzikovskyi", "CEO", "IT-сервісна компанія")],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 10,
    title: "Сімейний стартап, Економічний форум та нутриціологія — що спільного?",
    slug: "simeinyi-startap-ekonomichnyi-forum",
    youtubeUrl: yt("6kmN_ix6-rg"),
    teaser:
      "Рей Астафічев — про стартап Eatid: від ідеї до Всесвітнього економічного форуму в Давосі, нетворкінг і самопрезентацію на міжнародних подіях.",
    description: [
      "Історія Рея та Ірини Астафічевих, засновників українського стартапу Eatid: від ідеї до представлення на Всесвітньому економічному форумі у Давосі.",
    ],
    guests: [
      guest("Рей Астафічев", "rei-astafichev", "Співзасновник", "Eatid", "https://www.linkedin.com/in/rayasta/"),
    ],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 9,
    title: "Розробники змінюють правила: злет українського продуктового мислення",
    slug: "zlet-ukrainskoho-produktovoho-myslennia",
    youtubeUrl: yt("S_g-DQkRvbo"),
    teaser:
      "Олег Фролов — про шлях від аутсорсу до власних продуктів в умовах війни, фінансування, маркетингові експерименти й подолання перфекціонізму.",
    description: [
      "Трансформація української IT-індустрії: шлях від аутсорсу до власних продуктів в умовах війни, фінансування, маркетингові експерименти та партнерства.",
    ],
    guests: [guest("Олег Фролов", "oleh-frolov", "Засновник")],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 8,
    title: "Як захистити свій цифровий бізнес",
    slug: "yak-zakhystyty-tsyfrovyi-biznes",
    youtubeUrl: yt("ba1PH3xN1-M"),
    teaser:
      "Максим Носарев — про юридичне забезпечення IT-бізнесу: якісні контракти, борги без судів і як попереджати конфлікти з клієнтами.",
    description: [
      "IT-юриспруденція — сфера, де технології зустрічаються з правом: від надійних контрактів до ефективної комунікації з клієнтами і вирішення боргових питань без судових розглядів.",
    ],
    guests: [guest("Максим Носарев", "maksym-nosarev", "IT-юрист")],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 7,
    title: "Маркетинг в аутсорсі: від сліпої віри до стратегічних експериментів",
    slug: "marketynh-v-autsorsi",
    youtubeUrl: yt("Sj1EdVu5t8Q"),
    teaser:
      "Данило Федірко — про акаунт-бейс маркетинг, чому маркетинг іноді нагадує казино і як не витрачати бюджет намарно.",
    description: [
      "Від традиційних підходів до акаунт-бейс маркетингу: чому маркетинг іноді нагадує казино, як не витрачати бюджет намарно і чому персоналізація — ваш козир.",
    ],
    guests: [
      guest("Данило Федірко", "danylo-fedirko", "Маркетолог", undefined, "https://www.linkedin.com/in/danylofedirko/"),
    ],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 6,
    title: "Пітер Тіль, Кертіс Ярвін, Ілон Маск та всі-всі-всі",
    slug: "piter-til-kertis-iarvin-ilon-mask",
    youtubeUrl: yt("8kpOl4vnOXw"),
    teaser:
      "Політолог Максим Несвітайлов — про технократичні еліти, їхні амбіції та можливі сценарії геополітичних змін для України.",
    description: [
      "Разом з політологом і експертом-міжнародником Максимом Несвітайловим досліджуємо взаємозв’язок технологій і політики та вплив технократичних еліт на сучасне суспільство.",
    ],
    guests: [guest("Максим Несвітайлов", "maksym-nesvitailov", "Політолог, експерт-міжнародник")],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 5,
    title: "Повернення переможців: ветерани у цивільному житті",
    slug: "povernennia-peremozhtsiv",
    youtubeUrl: yt("vWa7fFv3xAo"),
    teaser:
      "Проєкт After Front — про реінтеграцію ветеранів у цивільне життя й бізнес: освіта, вакансії, міфи та культура комунікації.",
    description: [
      "Реінтеграція ветеранів у цивільне життя та бізнес-середовище в Україні: освітні програми, ярмарки вакансій, навігатор послуг і культура комунікації між ветеранами та бізнесом.",
    ],
    guests: [guest("Команда After Front", "after-front", "Проєкт реінтеграції ветеранів")],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 4,
    title: "Від стандартного аутсорсу до стратегічного партнерства",
    slug: "vid-autsorsu-do-stratehichnoho-partnerstva",
    youtubeUrl: yt("P3vbiKnAhYU"),
    teaser:
      "Алекс Пшеняников — про шлях від аутсорсу до AI: нетехнічні клієнти, культурний фіт і поради тим, хто починає бізнес під час війни.",
    description: [
      "Від монополістичних амбіцій і нетехнічних клієнтів до культурних фітів та експериментів з AI — і вплив війни на ринок.",
    ],
    guests: [
      guest(
        "Алекс Пшеняников",
        "aleks-pshenianykov",
        "Співзасновник",
        "Techery",
        "https://www.linkedin.com/in/pshenianykov/",
      ),
    ],
    hosts: ["Олена Кияновська"],
  },
  {
    number: 3,
    title: "Agile Partnership",
    slug: "agile-partnership",
    youtubeUrl: yt("tly8u8ClTas"),
    teaser:
      "Микола Черемісін — про партнерство в бізнесі: як уникати конфліктів, коли час «розлучатися» і чому медіація — ваш найкращий друг.",
    description: [
      "Все про партнерство в бізнесі — від першого «привіт» до останнього «до побачення»: як уникнути конфліктів, що робити, коли пора розходитися з партнером, і чому медіація — не страшне слово.",
    ],
    guests: [
      guest(
        "Микола Черемісін",
        "mykola-cheremisin",
        "Підприємець",
        undefined,
        "https://www.linkedin.com/in/nikolay-cheremisin/",
      ),
    ],
    hosts: ["Олена Кияновська"],
  },
];

// ---------- Articles ----------

/** the body of an article written from an episode, until the real ones are in (the summary is its lead) */
const draftBody = (excerpt: string, speaker: string) => [
  p(excerpt),
  h2("З чого почалася розмова"),
  p(
    "Ведучі попросили гостя пригадати конкретну ситуацію, з якої все почалося, і розібрати її крок за кроком: що було відомо на старті, які рішення ухвалювали і що з цього вийшло.",
  ),
  quote("Найдорожчі помилки — ті, про які ми знали заздалегідь, але вирішили не говорити вголос.", speaker),
  h2("Що варто взяти собі"),
  ...bullets(
    "Назвіть проблему вголос, щойно її помітили.",
    "Домовтеся, хто й коли ухвалює рішення.",
    "Перевіряйте припущення на малому масштабі, перш ніж міняти процес для всіх.",
  ),
  p("Повну розмову можна подивитися у відео епізоду."),
];

const article = (
  episode: number,
  slug: string,
  title: string,
  excerpt: string,
  summary: string,
  publishedAt: string,
  body?: TypedObject[],
): TalksArticle => {
  const ep = episodes.find((e) => e.number === episode)!;
  return {
    title,
    slug,
    episode,
    excerpt,
    summary,
    body: body ?? draftBody(excerpt, ep.guests[0].name),
    authors: ep.hosts,
    contributors: ep.guests,
    publishedAt,
  };
};

const cover17 = `https://i.ytimg.com/vi/zX71CMQ2wCY/maxresdefault.jpg`;

export const articles: TalksArticle[] = [
  article(
    17,
    "pidpryiemnytstvo-tse-testuvannia-hipotez",
    "Підприємництво — це швидке тестування гіпотез, а не страх",
    "Женя Вишньова будує бізнеси з 2009 року — і за цей час переконалася: підприємництво починається не з упевненості, а з готовності перевіряти ідеї.",
    "Чому краще швидко протестувати гіпотезу, ніж місяцями писати бізнес-план, і як не боятися відмовлятися від того, що не працює.",
    "2026-06-20",
    [
      h2("Почати, не чекаючи ідеального моменту"),
      p(
        "Перший бізнес Женя запустила у 2009 році — у розпал кризи, без інвесторів і без чіткого плану. Тоді це здавалося вимушеним кроком: роботи, яка б її влаштовувала, просто не було. Сьогодні вона називає це головним уроком: ідеального моменту не буває, а чекати його — найдорожча стратегія.",
      ),
      p(
        "За шістнадцять років у неї було кілька компаній, і кожна починалася однаково: з питання, яке можна перевірити за тиждень, а не з презентації на п’ятдесят слайдів.",
      ),
      quote(
        "Підприємець — це не той, хто не боїться. Це той, хто встигає перевірити ідею раніше, ніж страх устигне її вбити.",
        "Женя Вишньова",
        "03:42",
      ),
      h2("Гіпотеза замість бізнес-плану"),
      p(
        "Бізнес-план фіксує припущення, гіпотеза — пропонує їх перевірити. Різниця не в документах, а в тому, що ви робите наступного ранку: захищаєте план чи шукаєте, де він помиляється.",
      ),
      h3("Як виглядає перевірка на практиці"),
      p(
        "Dinarys перевіряла кожен новий напрям однаково: один клієнт, обмежений бюджет і заздалегідь названий критерій, за яким напрям закривають.",
      ),
      image(cover17, "Женя Вишньова в студії Daat Talks", "Женя Вишньова в студії Daat Talks, епізод 17"),
      h4("Три питання до кожної гіпотези"),
      ...numbered(
        "Що саме ми вважаємо правдою і чому?",
        "Який найменший експеримент це перевірить?",
        "За яким результатом ми чесно визнаємо, що помилилися?",
      ),
      table([
        ["", "Бізнес-план", "Гіпотеза"],
        ["Горизонт", "Рік і більше", "Тиждень–місяць"],
        ["Що вимірюємо", "Відхилення від плану", "Чи підтвердилось припущення"],
        ["Що робимо з помилкою", "Пояснюємо", "Закриваємо напрям"],
      ]),
      callout(
        "Ключова думка",
        "Відмовитися від ідеї, що не працює, — не поразка, а зекономлені місяці. Критерій закриття варто назвати до старту, поки рішення не стало особистим.",
      ),
      h2("Турбулентність як нормальний стан"),
      p(
        "Пандемія, повномасштабна війна, переїзд до Берліна — за останні роки Dinarys не мала жодного «спокійного» року. Женя переконана: компанія, яка вміє швидко перевіряти гіпотези, переживає турбулентність легше, бо для неї невизначеність — робочий режим, а не виняток.",
      ),
      ...bullets(
        "Плануйте короткими циклами — квартал, а не рік.",
        "Тримайте кілька напрямів у стадії перевірки одночасно.",
        "Розповідайте команді, що саме ви перевіряєте і чому.",
      ),
      h2("Три поради тим, хто починає"),
      p(
        "Почніть з однієї проблеми, яку ви розумієте краще за інших. Знайдіть першого клієнта раніше, ніж напишете код. І домовтеся з собою, за якої умови зупинитеся, — це звільняє від страху більше, ніж будь-яка впевненість.",
      ),
    ],
  ),
  article(
    17,
    "zhinoche-liderstvo-v-tekhnolohiiakh",
    "Жіноче лідерство в технологіях: без міфів про інтуїцію та емпатію",
    "Інтуїція, емпатія, «м’яке» лідерство — довкола жінок-CEO в IT чимало стереотипів.",
    "Женя розповідає, як насправді виглядає лідерство в технологіях, як вона повернулася на сцену після семи років паузи і чому міфи заважають більше, ніж допомагають.",
    "2026-06-24",
  ),
  article(
    17,
    "yak-ai-zminiuie-rozrobku",
    "Як AI змінює розробку, склад команд і запити клієнтів",
    "AI вже змінив розробку: інструменти, склад команд і те, чого клієнти чекають від підрядника.",
    "Досвід Dinarys з e-commerce-проєктами та клієнтами в DACH-регіоні: що змінилося і до чого готуватися далі.",
    "2026-06-27",
  ),
  article(
    16,
    "skliana-stelia-na-30-liudiakh",
    "«Скляна стеля» на 30 людях: коли фаундеру час думати про екзит",
    "Компанія стабільна, клієнти задоволені — але на 30 людях фаундер упирається в «скляну стелю».",
    "Тетяна Кобзар розповідає, як стратсесія, що закінчилась сльозами, через пів року привела до продажу Diversido.",
    "2026-05-28",
  ),
  article(
    16,
    "m-and-a-dlia-autsorsu",
    "M&A для аутсорсу до 50 людей: як проходить продаж компанії",
    "Як виглядає M&A-процес для української IT-компанії розміром до 30 людей: брокер, потенційні покупці, перемовини.",
    "І чому угоду з TechMagic вдалося закрити за рекордні два місяці.",
    "2026-06-01",
  ),
  article(
    16,
    "yurysty-chatgpt-i-due-diligence",
    "Юристи, ChatGPT і due diligence: з чого складається ціна угоди",
    "Due diligence для невеликого аутсорсу — це не лише юристи.",
    "Скільки коштує юридичний супровід угоди, які ролі виконали ChatGPT, Claude та Gemini і що Тетяна зробила б інакше.",
    "2026-06-04",
  ),
  article(
    15,
    "khto-vidpovidaie-za-rist-akauntiv",
    "Хто відповідає за ріст акаунтів: delivery, sales чи акаунт-менеджер?",
    "Delivery, sales чи акаунт-менеджер — хто насправді відповідає за ріст акаунтів у сервісній компанії?",
    "Ярослав Логінчук пояснює, чому маркетинг не може компенсувати погане delivery і що змінилося після 2021 року.",
    "2026-04-02",
  ),
  article(
    15,
    "case-study-z-pershoho-dnia",
    "Case study з першого дня: чому дані треба збирати одразу",
    "Написати case study наприкінці проєкту майже неможливо: дані загубилися, а клієнт уже думає про інше.",
    "Чому дані треба збирати з першого дня і хто в команді має за це відповідати.",
    "2026-04-06",
  ),
  article(
    15,
    "ai-u-marketynhu-servisnoi-kompanii",
    "AI у маркетингу сервісної компанії: від 4 до 20 статей на місяць",
    "Синтетичні персони, ghostwriter-и та логи гіпотез: як AI допомагає масштабувати контент сервісної компанії.",
    "Шлях від 4 до 20 статей на місяць — і editorial policy, яка тримає якість.",
    "2026-04-09",
  ),
  article(
    14,
    "z-choho-pochaty-ai-u-servisnii-kompanii",
    "З чого почати AI у сервісній компанії",
    "Більшість компаній починають з інструментів — і тому застрягають на пілотах.",
    "Сергій Ступаченко пояснює, чому почати варто з процесів, які вже болять, і як виміряти, що AI справді допоміг.",
    "2025-06-26",
  ),
  article(
    14,
    "yak-ai-zminiuie-upravlinnia-komandamy",
    "Як AI змінює управління командами",
    "Коли частину рутини бере на себе AI, змінюється і роль менеджера.",
    "Що Techery змінила в структурі команд, у code review та в тому, як оцінює роботу інженерів.",
    "2025-06-30",
  ),
  article(
    13,
    "vid-rozrobnyka-do-c-rivnia",
    "Від розробника до C-рівня: що довелося розучитися робити",
    "Шлях від розробника до керівника — це не лише нові навички, а й старі звички, від яких доводиться відмовлятися.",
    "Іван Веркалець розповідає, що було найважче віддати команді і як змінилося його розуміння відповідальності.",
    "2025-06-11",
  ),
  article(
    13,
    "antykryzove-upravlinnia",
    "Антикризове управління: від COVID-19 до повномасштабної війни",
    "Дві кризи поспіль навчили COAX планувати інакше.",
    "Які рішення допомогли зберегти команду і клієнтів і що компанія робить, щоб бути готовою до наступної кризи.",
    "2025-06-14",
  ),
];

// ---------- Queries over the data ----------

export const EPISODES_PER_PAGE = 5;

/** an episode's articles, oldest first (the order they were published in) */
export const articlesOf = (episode: TalksEpisode) =>
  articles.filter((a) => a.episode === episode.number).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));

export const episodeOf = (article: TalksArticle) => episodes.find((e) => e.number === article.episode)!;

/** "ЖВ": the avatar's initials, until the guests have photos */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** every `text` in a body, however deep (paragraphs, quotes, callouts, table cells) */
const textsOf = (node: unknown): string[] => {
  if (Array.isArray(node)) return node.flatMap(textsOf);
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([k, v]) => (k === "text" && typeof v === "string" ? [v] : textsOf(v)));
};

/** minutes to read the body, at 180 words a minute */
export function readingMinutes(body: TypedObject[]) {
  const words = textsOf(body).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

/** "20 червня 2026" */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(iso))
    .replace(/\s*р\.$/, "");
