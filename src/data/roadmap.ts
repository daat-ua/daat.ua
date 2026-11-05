// The roadmap: three horizons (tabs + columns) and the illustrative revenue-impact table.
// Strings may hold HTML (&nbsp;, <span class="nowrap">) and are rendered with set:html.

export interface Horizon {
  /** h1 | h2 | h3: element ids and the table's data-active */
  id: string;
  tab: string;
  label: string;
  title: string;
  lead: string;
  actions: { title: string; text: string }[];
}

export const horizons: Horizon[] = [
  {
    id: "h1",
    tab: '<span class="nowrap">0–3 місяці</span>',
    label: 'H1 · <span class="nowrap">0–3 місяці</span>',
    title: "Стабілізувати й розблокувати",
    lead: "Розірвати коло на вході: звільнити час керівників і навести лад в оцінці, щоб з’явився простір для змін.",
    actions: [
      {
        title: "Захистити час керівників",
        text: '<span class="horizon__key">Відповідальний:</span> CEO · <span class="horizon__key">Готово, коли:</span> CTO <span class="nowrap">≥60%</span> часу працює як CTO; жоден delivery-менеджер не веде понад 5 активних проєктів.',
      },
      {
        title: "Фільтр на оцінку fixed-price",
        text: '<span class="horizon__key">Відповідальні:</span> Head of Delivery + CTO · <span class="horizon__key">Готово, коли:</span> 100% нових fixed-price угод проходять Discovery → переоцінку → погодження delivery.',
      },
      {
        title: "Раннє попередження про концентрацію",
        text: '<span class="horizon__key">Відповідальні:</span> CFO + продажі · <span class="horizon__key">Готово, коли:</span> працює дашборд залежності від клієнтів; сценарій «обриву» виручки прораховано для борду.',
      },
    ],
  },
  {
    id: "h2",
    tab: '<span class="nowrap">3–9 місяців</span>',
    label: 'H2 · <span class="nowrap">3–9 місяців</span>',
    title: "Інституціоналізувати",
    lead: "Перетворити добрі задуми на практику, яка переживе зміну людей.",
    actions: [
      {
        title: "Запровадити управління якістю",
        text: '<span class="horizon__key">Відповідальний:</span> CTO · <span class="horizon__key">Готово, коли:</span> code review відновлено; працюють гейти покриття тестами й статичного аналізу, зокрема для коду, згенерованого AI.',
      },
      {
        title: "Кодифікувати інституційні знання",
        text: '<span class="horizon__key">Відповідальний:</span> Head of Delivery · <span class="horizon__key">Готово, коли:</span> опубліковано єдиний SDLC і SOP; одне джерело правди на кожен проєкт.',
      },
      {
        title: "Перезапустити OKR і матрицю компетенцій",
        text: '<span class="horizon__key">Відповідальні:</span> CEO + HR · <span class="horizon__key">Готово, коли:</span> цілі каскадовано із залученням команди; вимірювана матриця замінила довільне оцінювання.',
      },
    ],
  },
  {
    id: "h3",
    tab: '<span class="nowrap">9–18 місяців</span>',
    label: 'H3 · <span class="nowrap">9–18 місяців</span>',
    title: "Масштабувати й знизити ризики",
    lead: "Взятися за структурні ризики&nbsp;— і довести прогрес.",
    actions: [
      {
        title: "Хеджувати концентрацію клієнтів",
        text: '<span class="horizon__key">Відповідальні:</span> CEO + продажі · <span class="horizon__key">Готово, коли:</span> працюють диверсифікований пайплайн і програма розширення акаунтів.',
      },
      {
        title: "Завершити передачу повноважень від засновника",
        text: '<span class="horizon__key">Відповідальний:</span> CEO · <span class="horizon__key">Готово, коли:</span> права ухвалення рішень задокументовано; управління працює без засновника в кімнаті.',
      },
      {
        title: "Повторний аудит ATLAS",
        text: '<span class="horizon__key">Відповідальні:</span> Daat + CEO · <span class="horizon__key">Готово, коли:</span> індекс зрілості переоцінено з вужчими інтервалами; прогрес підтверджено.',
      },
    ],
  },
];

/** Revenue impact: an illustrative ~50-person IT-services company; one column per horizon after "Зараз" */
export const impact = {
  caption:
    'Умовна <span class="nowrap">IT-сервісна</span> компанія на ~50 людей із виручкою <span class="nowrap">$3,0 млн</span>/рік. Цифри ілюстративні&nbsp;— ваш сценарій будується на ваших фінансових даних.',
  columns: [
    "Показник",
    "Зараз",
    'H1 · <span class="nowrap">0–3 міс.</span>',
    'H2 · <span class="nowrap">3–9 міс.</span>',
    'H3 · <span class="nowrap">9–18 міс.</span>',
  ],
  revenue: {
    label: "Річна виручка (run-rate, кінець горизонту)",
    /** text, and the bar's length on one $0 → $4,0 млн scale */
    values: [
      { text: "$3,0 млн", bar: 0.75 },
      { text: "$3,1 млн", bar: 0.775 },
      { text: "$3,45 млн", bar: 0.8625 },
      { text: "$4,0 млн", bar: 1.0 },
    ],
  },
  rows: [
    { label: "Приріст до бази", cells: ["—", "+3%", "+15%", "+33%"] },
    {
      label: "Додаткова виручка за горизонт",
      cells: [
        "—",
        '<span class="nowrap">+$40 тис.</span>',
        '<span class="nowrap">+$140 тис.</span>',
        '<span class="nowrap">+$545 тис.</span>',
      ],
    },
    { label: "Валова маржа", cells: ["22%", "25%", "27%", "29%"] },
    { label: "Частка найбільшого клієнта", cells: ["45%", "44%", "38%", "28%"] },
    {
      label: "Що дає ефект",
      cells: [
        "Базова лінія",
        "Fixed-price без перевитрат; change requests оплачуються",
        'Утилізація <span class="nowrap">+6 в.п.</span>; upsell у наявних акаунтах',
        "Нові та enterprise-клієнти; засновник&nbsp;— у продажах",
      ],
      drivers: true,
    },
  ],
  enablers: {
    label: "Прогноз за енейблерами (індекс зрілості, цільові значення)",
    rows: [
      { label: "Операційна система delivery", cells: ["2,3", "2,6", "3,0", "3,4"] },
      { label: "Люди та ресурси", cells: ["2,2", "2,7", "3,0", "3,3"] },
      { label: "Спроможності та компетенції", cells: ["2,3", "2,5", "2,9", "3,3"] },
      { label: "Інженерна культура й культура delivery", cells: ["1,8", "2,0", "2,6", "3,1"] },
      { label: "Структура та управління", cells: ["3,0", "3,0", "3,2", "3,5"] },
      { label: "Лідерство та ухвалення рішень", cells: ["2,8", "2,8", "3,0", "3,4"] },
      { label: "Стратегія та портфель", cells: ["3,1", "3,1", "3,1", "3,4"] },
    ],
    total: { label: "Загальний індекс зрілості", cells: ["2,5", "2,7", "3,0", "3,4"] },
  },
};
