import {ALL_FIELDS_GROUP, defineArrayMember, defineField, defineType} from 'sanity'

// A case study (DAA-230): one field per block of the case page (src/pages/uk-UA/atlas/case-studies/[slug].astro),
// one tab per section of the page. Keys of the lists below are mapped to Ukrainian by the website
// (src/data/case-studies.ts): keep them stable.

const enablers = [
  {name: 'strategy_portfolio', title: 'Strategy & Portfolio'},
  {name: 'structure_governance', title: 'Structure & Governance'},
  {name: 'delivery_operating_system', title: 'Delivery Operating System'},
  {name: 'engineering_delivery_culture', title: 'Engineering & Delivery Culture'},
  {name: 'leadership_decision_making', title: 'Leadership & Decision-making'},
  {name: 'people_capacity', title: 'People & Capacity'},
  {name: 'capabilities_competency', title: 'Capabilities & Competency'},
]

const maturityScore = (rule: any) => rule.required().min(1).max(5).precision(1)

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Studies',
  type: 'document',

  groups: [
    {name: 'main', title: 'Main', default: true},
    {name: 'client', title: 'Client'},
    {name: 'figures', title: 'Key figures'},
    {name: 'context', title: 'Context'},
    {name: 'diagnosis', title: 'Diagnosis'},
    {name: 'findings', title: 'Findings'},
    {name: 'maturity', title: 'Maturity'},
    {name: 'roadmap', title: 'Roadmap'},
    {name: 'changes', title: 'What changed'},
    {name: 'testimonial', title: 'Testimonial'},
    {name: 'related', title: 'Other cases'},
    {name: 'seo', title: 'SEO'},
    {...ALL_FIELDS_GROUP, hidden: true},
  ],

  fields: [
    // ---------- Main: the first screen and the cards in carousels ----------
    defineField({
      name: 'title',
      description: 'The page heading and the card title in carousels',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'slug',
      description: 'The URL: /uk-UA/atlas/case-studies/<slug>',
      type: 'slug',
      options: {source: 'title'},
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lead',
      description: '2–3 sentences under the title; the SEO description when that is empty',
      type: 'text',
      rows: 3,
      group: 'main',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      description:
        'Behind the title, faded into the page; also the card image and the sharing image by default',
      type: 'image',
      options: {hotspot: true},
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cardTag',
      title: 'Card tag',
      description:
        'The label on the card image, e.g. "Аутсорс · 120 людей". Empty: industry · size',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'main',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      description: 'Show in the case studies carousel on the ATLAS page',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),

    // ---------- Client: the profile card ----------
    defineField({
      name: 'industry',
      type: 'string',
      group: 'client',
      options: {
        list: [
          {value: 'it-services', title: 'IT-сервіси / аутсорс'},
          {value: 'product', title: 'Продукт'},
          {value: 'outstaffing', title: 'Аутстаф'},
          {value: 'other', title: 'Інше'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'companySize',
      title: 'Company size',
      description: 'e.g. "~50 людей"',
      type: 'string',
      group: 'client',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'market',
      description: 'e.g. "Україна · клієнти: ЄС / США"',
      type: 'string',
      group: 'client',
    }),
    defineField({
      name: 'commissionedBy',
      title: 'Commissioned by',
      type: 'string',
      group: 'client',
      options: {
        list: [
          {value: 'founder-ceo', title: 'Засновник-CEO'},
          {value: 'ceo', title: 'CEO'},
          {value: 'cto', title: 'CTO'},
          {value: 'coo', title: 'COO'},
          {value: 'investor', title: 'Інвестор'},
        ],
      },
    }),
    defineField({
      name: 'duration',
      description: 'e.g. "4–5 тижнів"',
      type: 'string',
      group: 'client',
    }),
    defineField({
      name: 'year',
      type: 'number',
      group: 'client',
      validation: (rule) => rule.integer().min(2020).max(2100),
    }),
    defineField({
      name: 'anonymised',
      description: 'The company is not named and identifying details are left out',
      type: 'boolean',
      group: 'client',
      initialValue: true,
    }),
    defineField({
      name: 'clientApproved',
      title: 'Approved by the client',
      description: 'The client has agreed to this text and its figures. Required to publish',
      type: 'boolean',
      group: 'client',
      initialValue: false,
      validation: (rule) =>
        rule.custom(
          (value) => value === true || 'The client has to approve a case before it is published',
        ),
    }),

    // ---------- Key figures ----------
    defineField({
      name: 'figures',
      description:
        'Up to four figures under the first screen, e.g. "2,5 → 3,4" / "цільовий індекс зрілості за 18 місяців". Put the main result first: the case studies index shows the first one',
      type: 'array',
      group: 'figures',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'figure',
          fields: [
            {name: 'value', type: 'string', validation: (rule) => rule.required()},
            {name: 'label', type: 'string', validation: (rule) => rule.required()},
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
      validation: (rule) => rule.max(4),
    }),

    // ---------- Context ----------
    defineField({
      name: 'context',
      description: 'Who the client is and what was happening when they came',
      type: 'array',
      of: [{type: 'block'}],
      group: 'context',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contextQuote',
      title: 'Client quote',
      description: 'How the client described the problem at the start, in their words',
      type: 'text',
      rows: 2,
      group: 'context',
    }),

    // ---------- Diagnosis: how it went ----------
    defineField({
      name: 'phases',
      description: 'The diagnosis phases; filled with ATLAS’s phases, adjust the details',
      type: 'array',
      group: 'diagnosis',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phase',
          fields: [
            {
              name: 'label',
              type: 'string',
              description: 'e.g. "Фаза 1"',
              validation: (rule) => rule.required(),
            },
            {name: 'title', type: 'string', validation: (rule) => rule.required()},
            {name: 'text', type: 'string'},
          ],
          preview: {select: {title: 'title', subtitle: 'label'}},
        }),
      ],
      initialValue: [
        {
          _key: 'phase-0',
          _type: 'phase',
          label: 'Фаза 0',
          title: 'Ініціація',
          text: 'Скоуп, стейкхолдери, NDA',
        },
        {
          _key: 'phase-1',
          _type: 'phase',
          label: 'Фаза 1',
          title: 'Докази',
          text: '5 інтерв’ю, документи, дані систем',
        },
        {
          _key: 'phase-2',
          _type: 'phase',
          label: 'Фази 2–4',
          title: 'Оцінювання й синтез',
          text: '28 клітинок, теми, ризики',
        },
        {
          _key: 'phase-3',
          _type: 'phase',
          label: 'Фази 5–6',
          title: 'Дорожня карта й валідація',
          text: '3 горизонти, сесія з керівництвом',
        },
      ],
    }),
    defineField({
      name: 'phasesText',
      title: 'About the process',
      description: 'Who took part, how many interviews, which data',
      type: 'array',
      of: [{type: 'block'}],
      group: 'diagnosis',
    }),

    // ---------- Findings: what the diagnosis found ----------
    defineField({
      name: 'findingsIntro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      group: 'findings',
    }),
    defineField({
      name: 'conclusions',
      type: 'array',
      group: 'findings',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'conclusion',
          fields: [
            {name: 'title', type: 'string', validation: (rule) => rule.required()},
            {name: 'text', type: 'text', rows: 3, validation: (rule) => rule.required()},
            {
              name: 'finding',
              title: 'Audit finding',
              description: 'Links the conclusion to its finding',
              type: 'reference',
              to: [{type: 'post'}],
            },
            {
              name: 'findingLabel',
              title: 'Finding label',
              description: 'Instead of the finding’s title, or for a finding not written yet',
              type: 'string',
            },
          ],
          preview: {select: {title: 'title', subtitle: 'finding.title'}},
        }),
      ],
      validation: (rule) => rule.max(6),
    }),

    // ---------- Maturity profile ----------
    defineField({
      name: 'maturity',
      title: 'Maturity profile',
      description: 'The maturity index (1–5) per maturity component, as in the report',
      type: 'object',
      group: 'maturity',
      fields: [
        ...enablers.map(({name, title}) => ({
          name,
          title,
          type: 'number',
          validation: maturityScore,
        })),
        {name: 'total', title: 'Overall index', type: 'number', validation: maturityScore},
        {
          name: 'totalNote',
          title: 'Overall note',
          description: 'e.g. "нижче рівня «Визначений»"',
          type: 'string',
        },
      ],
    }),

    // ---------- Roadmap ----------
    defineField({
      name: 'roadmapLead',
      title: 'Trajectory',
      description: 'e.g. "Цільова траєкторія індексу зрілості: 2,5 → 3,4 за 18 місяців…"',
      type: 'text',
      rows: 2,
      group: 'roadmap',
    }),
    defineField({
      name: 'horizons',
      description: 'Exactly three: 0–3, 3–9 and 9–18 months',
      type: 'array',
      group: 'roadmap',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'horizon',
          fields: [
            {
              name: 'tab',
              type: 'string',
              description: 'e.g. "0–3 місяці"',
              validation: (rule) => rule.required(),
            },
            {
              name: 'label',
              type: 'string',
              description: 'e.g. "H1 · 0–3 міс."',
              validation: (rule) => rule.required(),
            },
            {name: 'title', type: 'string', validation: (rule) => rule.required()},
            {name: 'text', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'title', subtitle: 'label'}},
        }),
      ],
      initialValue: [
        {_key: 'h1', _type: 'horizon', tab: '0–3 місяці', label: 'H1 · 0–3 міс.'},
        {_key: 'h2', _type: 'horizon', tab: '3–9 місяців', label: 'H2 · 3–9 міс.'},
        {_key: 'h3', _type: 'horizon', tab: '9–18 місяців', label: 'H3 · 9–18 міс.'},
      ],
      validation: (rule) => rule.length(3),
    }),

    // ---------- What changed ----------
    defineField({
      name: 'changes',
      title: 'Metrics',
      description: 'Only figures the client has agreed to',
      type: 'array',
      group: 'changes',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'change',
          fields: [
            {name: 'metric', type: 'string', validation: (rule) => rule.required()},
            {name: 'before', type: 'string'},
            {name: 'after', type: 'string'},
            {name: 'period', type: 'string', description: 'e.g. "за 6 міс."'},
          ],
          preview: {select: {title: 'metric', subtitle: 'after'}},
        }),
      ],
    }),
    defineField({
      name: 'changesText',
      title: 'About the results',
      description:
        'What has been done; without results yet, what is done so far and when the re-diagnosis is',
      type: 'array',
      of: [{type: 'block'}],
      group: 'changes',
    }),

    // ---------- Testimonial (optional) ----------
    defineField({
      name: 'testimonial',
      description: 'Optional: without a quote the section is left out',
      type: 'object',
      group: 'testimonial',
      fields: [
        {
          name: 'quote',
          type: 'text',
          rows: 2,
          description: 'Up to 25 words',
          validation: (rule) => rule.required(),
        },
        {
          name: 'name',
          type: 'string',
          description: 'The dataset is public: leave empty unless the client agreed to be named',
          validation: (rule) =>
            rule
              .custom((value, context) =>
                !value || (context.parent as {showName?: boolean})?.showName === true
                  ? true
                  : 'Without “Show the name” the name is still readable through the public API: remove it or tick the box',
              )
              .warning(),
        },
        {name: 'role', type: 'string', description: 'e.g. "CEO"'},
        {
          name: 'showName',
          title: 'Show the name',
          description:
            'Only with the client’s written consent; otherwise "CEO, IT-сервісна компанія"',
          type: 'boolean',
          initialValue: false,
        },
        {name: 'transcript', type: 'array', of: [{type: 'block'}]},
      ],
    }),

    // ---------- Other cases ----------
    defineField({
      name: 'otherCases',
      title: 'Other cases',
      description: 'Picked by hand; empty: the latest cases',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'caseStudy'}]}],
      group: 'related',
      validation: (rule) => rule.unique(),
    }),

    // ---------- SEO ----------
    defineField({
      name: 'seo_title',
      title: 'SEO title',
      description: 'Empty: the title',
      type: 'string',
      group: 'seo',
      validation: (rule) =>
        rule.max(60).warning('Search engines cut titles longer than ~60 characters'),
    }),
    defineField({
      name: 'seo_description',
      title: 'SEO description',
      description: 'Empty: the lead',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) =>
        rule.max(160).warning('Search engines cut descriptions longer than ~160 characters'),
    }),
    defineField({
      name: 'seo_image',
      title: 'Social sharing image',
      description: '1200 × 630. Empty: the hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alternative text'}],
      group: 'seo',
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      description: 'Only when the case was first published elsewhere',
      type: 'url',
      group: 'seo',
    }),
    defineField({
      name: 'seo_keywords',
      title: 'SEO keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'seo',
    }),
    defineField({
      name: 'no_index',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
  ],

  preview: {
    select: {title: 'title', industry: 'industry', size: 'companySize', media: 'heroImage'},
    prepare: ({title, industry, size, media}) => ({
      title,
      subtitle: [industry, size].filter(Boolean).join(' · '),
      media,
    }),
  },
})
