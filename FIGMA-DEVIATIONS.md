# Deviations from Figma

Changes made in code during the design-critique fixes, so the Figma file can be brought in line.
Sizes are given at the 1440px desktop width (Figma is drawn at 2×, so double them there).

## Typography (`/typeset`)

| Element | Figma | Code now | Why |
|---|---|---|---|
| Type scale | 63.28 / 50 / 30 / 21 / 20.865 / 20 / 19.815 / 19.26 | 64 / 48 / 30 / 24 / 20 / 17 | Fewer, clearly distinct steps |
| H1 (hero) | 63.28 / 66.33 line | 64 / 1.05 | Scale step |
| H2 (`Що стримує…`, `Чому Daat?`) | 50 / line-height 1 | 48 / 1.08 | Scale step; room for Cyrillic ascenders |
| Emphasis inside H1/H2 | H1 Medium (500), H2 DemiBold (600) | Medium (500) in both | One emphasis weight for display headings |
| Card and key-point titles | 30 / line-height 1 | 30 / 1.1 | Multi-line titles were cramped |
| Hero lead (orange) | 21 / normal | 24 / 1.42 | Lead should be larger than body, not only coloured |
| Body: cards, key points, intro, example | 20–20.865 / line-height 1–1.15 | 20 / 1.42 | Readability of 4–5 line light-on-colour text |
| Buttons | 19.815 and 19.26 | 20 (all buttons) | One size per component |
| Eyebrow, TOC links, clients label | 20.865–21 | 17 (+0.02em tracking on the eyebrow) | Small/UI step |

Responsive behaviour (code only): at 1024px and wider, text scales in proportion to the screen width like the rest of the layout, so the desktop page is an exact scaled copy of the 1440 design. Below 1024px the mobile layout uses its own sizes (body 17, H1 34–46).

Compound terms (`IT-компаній`, `~50–500`, `4–5 тижнів`) no longer break across lines.

## Colour and contrast (`/colorize`)

On the brand blue `#0066de`, the orange `#feb161` (2.95:1) and cream `#ede9de` (4.38:1) fail WCAG AA for normal-size text. The blue itself is unchanged.

| Element | Figma | Code now | Contrast |
|---|---|---|---|
| Eyebrow "Чому зараз?" | Orange text | Off-white `#faf8f3` text, led by a short 2px orange rule | 5.0:1 |
| TOC links | Cream `#ede9de` | `#f4f1ea` | 4.7:1 |
| TOC active item | Orange, DemiBold | `#faf8f3`, SemiBold, with a short off-white marker before it | 5.0:1 |
| TOC hover | (none) | Underline | — |

Orange remains in use on blue only as graphics (dividers, the eyebrow rule). Section titles stay cream: at 36px+ they are large text, where 4.38:1 passes.

## Grid and spacing (`/layout`)

**One column module for the whole page:** 314px columns with 37.5px gutters, starting at the 121px page margin. Columns start at x = 121 / 472.5 / 824; two columns (665.5) is the reading width, three columns (1017) the full content width.

| Element | Figma | Code now |
|---|---|---|
| Left edge of body copy, divider, key points, buttons | 123.5 (2.5px optical indent) | 121, same as the headings |
| Hero key points | 269.5 columns | 314 columns (same module as the blue section) |
| Hero lead / divider / key points width | 630.5 / 577 / 576 | All 665.5 (one shared right edge) |
| Blue-section dividers | 1046 (overshot the cards) | 1017 (ends with the third column) |
| Founders photo | 301.2 wide in a 314 column | Fills the 314 column (crop unchanged) |
| Table of contents | x = 1193.5 | x = 1190.5 (one gutter past the content, plus 15) |
| Hero founders photo | Fixed top offset (y = 326.6 in the dark area) | Anchored to the bottom of the dark area, overflowing it by 59.5, so the crop matches Figma even though the hero is taller |
| "Знахідки аудитів" button | Top-aligned, x = 826.5 | Vertically centred on the text, one gutter after it |
| Outline button | 24.79 padding, 1.944 border | 24 padding, 2 border |

**Spacing scale:** 8 / 16 / 24 / 32 / 48 / 64 / 96 replaces the measured values (41.1, 46.4, 47.75, 55.65, 57.25, 59.9, 60.5, 74.25, 93.75…).

| Relationship | Figma | Code now |
|---|---|---|
| Header bottom → H1 | 136 | 128 (96 + 32) |
| Hero blocks (lead, divider, clients, buttons) | 62–66.5 | 64 |
| Divider → key points | 64.1 | 48 (a divider opens the block after it) |
| Key points → second divider ("Line 2") → clients label | 66 / 86.5 | 64 / 48 (same divider rule) |
| Key-point rows | 67 | 48 |
| Card title → text | 15 / 21.5 / 31.4 (three variants) | 16 everywhere |
| Card rows (problems, reasons) | 45 | 48 |
| Eyebrow → H2 | 41.1 | 24 (the label belongs to its heading) |
| H2 → intro, divider → next block | 46–60 | 48 |
| Before each divider | 47.75–60.5 | 64 |
| "Чому Daat?" → photo and cards | 93.75 | 64 |
| Blue section top / bottom | 74.25 / 217 | 96 / 160 |
| Client logos gap | 28.5 | 32 |
| Clients label → logos | 26.25 | 24 |

Typographic details: spaced dashes are bound to the preceding word (a line never starts with "—"), and number ranges (`0–3`, `9–18`, `~50–500`) never break.

## Responsive layouts (`/adapt`)

There is one breakpoint: at 1024px and up, the 1440 design scales proportionally (text included); below 1024px the single-column mobile layout applies. Figma has only the desktop frame, so the mobile details are new and worth adding as a frame:

- Client logos in a 3 + 2 grid.
- Founders photo capped at 320px.
- The table of contents becomes a compact horizontal bar that sticks to the top of the blue section (scrolls sideways, 44px touch targets, active item underlined) instead of being hidden.

## Structure and robustness (`/harden`), code only, no visual change

- Hero key points are a definition list (term + description), so the heading outline is H1 → H2 → H3 with no skipped level.
- "Перейти до змісту" skip link, visible on keyboard focus. Global focus outline, and transitions respect reduced-motion settings.
- The table-of-contents highlight follows the section in view.
- In-page links whose target doesn't exist yet are announced as unavailable and don't jump. They activate automatically once the section with that id exists.

## TODO: content and sections still missing

| Item | Where | Needed |
|---|---|---|
| `#contact` | Both "Записатися на діагностичний дзвінок" buttons | Contact or booking section, or an external booking URL |
| `#results` | "Які результати ви отримаєте?" | Results section |
| `#audit-findings` | "Знахідки аудитів" | Audit findings section |
| `#testimonials` | Table of contents | The remaining section (`#for-whom`, `#deliverables`, `#report` and `#roadmap` now exist) |
| Menu button | Header | Menu design and content |
| Reason card 4 | "Шось четверте" | Real title (also a typo for "Щось") and its own description; it currently repeats card 3 |
| Problem card 6 | "Команда постійно гасить пожежі…" | A description; it currently repeats the title |
| Client logos | Hero | Confirm Adobe / Stripe / HubSpot / GitHub / Asana are real clients, or replace them |

## Performance (`/optimize`), code only, no visual change

| Asset | Before | After |
|---|---|---|
| 7 font files | 1.0 MB TTF | 236 KB woff2, subset to Latin + Cyrillic + punctuation (all OpenType features kept; every character on the page verified present) |
| Logo | 347 KB PNG | 24 KB WebP, same 706×795 pixels |
| Page total excluding scroll-animation frames | ~1.9 MB | ~490 KB |

- The H1 fonts (Turns Light + Medium), body Regular and the hero photo are preloaded.
- Metric-matched Arial fallbacks (`size-adjust` / ascent / descent overrides) mean text rendered before the web fonts arrive takes the same space, so the font swap doesn't shift layout.
- Original TTFs and PNG are in `_source/` (not published).

**Licence (decision needed):** the display face files are **TT Turns Trial**. Trial fonts from TypeType are not licensed for production websites. Buy a web licence (and swap in the licensed files under the same names) before launch. TT Commons also needs a web licence if one isn't already held.

## Final polish (`/polish`)

| Element | Figma | Code now | Why |
|---|---|---|---|
| Card text alignment (problems, reasons) | Fixed title slot (4 lines / 2 lines) | Descriptions in a row start below that row's tallest title (CSS subgrid) | No empty gap when every title in a row is short; rows still line up |
| Blue-section titles | Cream `#ede9de` (4.38:1) | `#f4f1ea` (4.7:1) | Visually identical; clears AA for any size |
| Buttons, pressed state | (none) | 1px press-down | Tactile feedback |

Verified at 500 / 800 / 1024 / 1280 / 1440 / 1920:
- no horizontal overflow;
- no console errors.

On mobile, no touch target is under 44px and no text is under 16px. Desktop text scales with width by design, so it is smaller than 1440 sizes below 1440 (body 14.2px at 1024).

The automated scan went from 25 findings to 5, and the 5 remaining are false positives:
- 3 are the hero's orange and cream text measured against white; the real background is navy, giving 8.5:1 and 12.6:1.
- 1 says the blue section's content is flush to its edges; it is inset 121px.
- 1 counts em-dashes, which is standard Ukrainian punctuation.

## Summary for the designer: what to update in Figma
1. Apply the type scale 64 / 48 / 30 / 24 / 20 / 17 and the new line-heights (Typography table).
2. Use Medium (500) as the emphasis weight in both the H1 and H2s.
3. Replace orange and cream text on blue with the off-white tints (Colour table).
4. Re-grid the hero key points to the 314 / 37.5 module, align right edges at 665.5, and shorten the dividers to 1017.
5. Replace measured spacing with the 8–96 scale (Grid and spacing table).
6. Add a mobile frame (Responsive layouts section).
7. Resolve the TODO list: missing sections, the menu, placeholder copy, client logos, and the font licence.

## Requested changes after the critique

- **Section order:** hero → "why now" (blue) → animated clip. The hero buttons now hang over the top edge of the blue section.
- **Hero buttons** ("Записатися на діагностичний дзвінок", "Які результати ви отримаєте?"): 2px white border. This also keeps the blue button visible where it overlaps the blue section.

## "Для кого" section (node 31:42), built on the page system

Placed after the animated clip. Uses the same tokens as the rest of the page rather than the frame's raw values:

| Element | Figma | Code |
|---|---|---|
| Background | `#0e151b` | Same (token `--c-night`) |
| Eyebrow "Для кого?" | Orange text | Cream text with the orange rule (same component as "Чому зараз?") |
| H2 | DemiBold "Для кого ATLAS:" + Regular rest, 50 | Medium + Light, 48 (the page's heading pattern; no extra font weight to load) |
| Intro, accordion text, list | 20.865 / 19 | Body 20 / 1.42 |
| Accordion titles | 26 DemiBold | Lead 24, SemiBold |
| Venn caption | 16 | Small 17 |
| Tabs | Overlapping pills with two-line labels | Underline-style text tabs: one-line labels at the 24px lead size on a thin cream baseline (see below) |
| Inactive Venn labels | `#2c3b4e` on `#0e151b` (≈1.6:1, unreadable) | Cream at 50% (≈4.5:1) |
| Layout | Venn 446 + accordion 483 at x = 658.5 | Venn and accordion across the 1017 content width (accordion 480, gap 96), right edge on the grid |
| Spacing | 41–125 measured | 24 / 48 / 96 scale; accordion rows 32 above and below |
| Typo | "моніторінг" | "моніторинг" |

Behaviour (code only):
- The three audience buttons are real tabs (click, or ← → Home End on the keyboard). The selected audience's circle turns blue and its label brightens.
- The situations are a native accordion with one open at a time. Rows without details don't toggle.

TODO content for this section:
- ~~Situations for the investor and contractor tabs~~: done (see below).
- ~~Details for the manager situations~~: done. The content comes from the "Self-commissioned" scenarios S-1 to S-8, translated (see below).

## Clip → "Для кого" fade (node 31:144, "Rectangle 7")

Gradient from transparent to `#0e151b`, 131.5 tall at 1440 (263 at 2×). It sits over the bottom of the animated clip and ends where "Для кого" starts. It's attached to the top of that section, so it scales and moves with it. On mobile it's 64px, because the clip is only about 250px tall there.

## Floating table of contents: extended through "Для кого"

- The table of contents now stays pinned from "Чому зараз?" through the end of "Для кого", and highlights "Для кого Atlas?" there.
- It floats under the animated clip: the clip (and its fade into "Для кого") slides over it while passing.
- On mobile the compact TOC bar sticks across the same range; it keeps its blue background over the dark section.

## "Для кого" situations: animated accordion

- Every situation row toggles, with one open at a time. The panel height animates open and closed (0.4s ease-out-quart) and its content fades in.
- The icon is one inline SVG of two chevron strokes, drawn to match Figma's chevron and "unfold less" icons. Closed, they overlap as a single down chevron. Opening, one rises and the other flips up into the "unfold less" shape, and closing reverses it. The line weight stays constant throughout.
- Built as accessible accordion buttons (`aria-expanded`, labelled regions); collapsed content is hidden from keyboard and screen readers. Motion is disabled for reduced-motion users.
- Every row now has content (see the next section).
- The static `icon-chevron-down.svg` / `icon-unfold-less.svg` files were removed (replaced by the inline animated icon).

## "Я керую компанією" situations: content from the scenario map

Source: the "Self-commissioned" branch (S-1 to S-8) of the Atlas audit map, translated to Ukrainian. Order on the page:

1. S-5 Масштабування без зламів (open by default)
2. S-4 Діагностика плато
3. S-6 Готовність до зростання
4. S-7 Вихід на enterprise-клієнтів
5. S-2 Перші 90 днів нового керівника
6. S-3 Вихід із кризи (new row)
7. S-1 Підвищення мультиплікатора (new row)
8. S-8 Регулярна перевірка стану (new row)

The first five are Figma's rows; the last three are added. Left out because they are internal rather than client-facing:
- S-8 point 4 ("natural commercial spine of the self-commissioned arm");
- the Ω score symbol;
- the repeated "How Atlas helps in this case:" label.

Figma needs three more rows, and the translations should be proofread by a native copywriter.

## "Я інвестую або купую" and "Я обираю підрядника": content from the scenario map

Source: the "Investor / acquirer" (I-1 to I-3) and "Client / procurement" (C-1, C-2) branches, translated.

| Tab | Row | Source |
|---|---|---|
| Investor | Due diligence перед купівлею · Зниження ризиків угоди | I-1 |
| Investor | Базова оцінка після злиття · Спершу оцінка, потім порядок інтеграції | The points listed under I-3, which describe the post-merger case. The map's I-2 points are a "?"-marked copy of I-1; the point repeating I-1 is left out. |
| Investor | Моніторинг портфеля · Регулярна переоцінка компаній портфеля | **No content in the map.** Adapted from S-8 "Recurring health check" plus ATLAS's "one maturity scale". Needs review. |
| Contractor | Вибір підрядника · Порівняння кандидатів перед підписанням | C-1 |
| Contractor | Контроль стратегічного постачальника · Перевірка критичного партнера | C-2 |

The intro line for each tab is new copy, written from the map's node labels ("Audits a target", "Audits its vendor"). Each tab opens with its first row expanded, and one row is open at a time within each tab. The translations should be proofread by a native copywriter, and Figma needs these rows added.

## Situations accordion: row lines

Every row has its gradient line after it, including the last one (Figma has no line after the last row). Lines are at 25% opacity, and the line under the open row fades to 100%, using the same 0.4s ease-out as the panel.

## Venn diagram: sticky

On desktop the Venn diagram and its caption stay pinned (96px from the top, the same as the table of contents) while the situations list scrolls beside them. They release at the end of the list. On mobile they scroll normally.

## Venn diagram: clickable circles and overlap labels

- Clicking a circle selects that audience (same as its tab). In overlaps the circle with the nearest centre wins. Hovering shows a pointer and a faint preview of the blue highlight. Keyboard users use the tabs.
- Overlap labels are pale (50%) unless the overlap belongs to the selected circle. The centre ("Одна шкала зрілості") belongs to all three, so it is always bright. (In Figma all overlap labels are always white.)

## Situation lists: dots instead of numbers

The points in every situation are an unordered list with medium peach dots (`#f7d8bc`, about 7px at 1440, scaled with the text), optically centred on the first line, with 8px between points. Figma uses a numbered list.

## Hero H1: arrow icon (not in Figma)

An orange "arrow up right" icon (`assets/icon-arrow-up-right.svg`, hugeicons stroke-rounded, recoloured to `#FEB161`) follows "Ваша компанія здатна на більше" (the full stop after "більше" is removed). It uses the same size, spacing and alignment as the plant icon and is kept on the same line as "більше".

## Header: 20% smaller

| Element | Figma (1440) | Code (1440) | Mobile |
|---|---|---|---|
| Gray header bar height | 165 | 132 | 96 → 76.8 |
| Orange menu square (sized from the header height) | 165 | 132 | 96 → 76.8 |
| Menu icon | 45.6 | 36.5 | 32 → 25.6 |
| Logo width | 176.5 | 141.2 | 106 → 84.8 |
| Logo offset from top | 45 | 36 | 20 → 16 |

The hero content starts 33px higher at 1440, because the space below the header is unchanged.

## Headings: 15% smaller

All heading sizes are reduced by 15% (one `--heading-scale: 0.85` factor):

| Level | Used for | Before (1440) | Now (1440) |
|---|---|---|---|
| H1 | Hero heading | 64 | 54.4 |
| H2 | Section titles | 48 | 40.8 |
| H3 | Card titles and hero key points | 30 | 25.5 |

Mobile headings are reduced by the same factor. The "Для кого" accordion titles (H3 elements set in the 24px lead size) are unchanged: reduced, they would match their 20px subtitles.

## Hero key points trimmed

- Removed "20 годин" and "3 горизонти планування"; two key points remain in one row: "4 тижні" and "Стратегія впровадження" (renamed from "Діагноз впровадження", same description).
- Removed the second hero divider (Figma "Line 2"). The clients block now follows the key points with the regular 64px gap (48 on mobile).

## Animated clip: later start

The clip's scroll range runs from its top edge entering at the bottom of the screen to that edge reaching the top. The first frame is held for the first 40% of that range, and the whole clip plays over the remaining 60% (`START_AT = 0.4` in the script).

## Animated clip: the three pillars (node 6:304)

Circles at Figma's positions over the clip (the video's final frame has the same framing as the original still), with Ukrainian labels:

| Figma | Code |
|---|---|
| Technical excellence | Технологічна досконалість |
| Business strategy | Стратегія IT-компанії |
| Delivery | Делівері |

- **Look:** peach `#f7d8bc` circles, 121.5px at 1440, with slate `#2c3b4e` SemiBold text, centred horizontally and vertically (Figma has it left-aligned). Text uses the 17px small size (Figma 19).
- **Fade:** opacity follows the clip's progress, from 0 when it starts playing to 1 at its last frame. Scrolling back fades them out the same way.
- **Mobile:** circles are 68–121.5px (17vw) with 10–17px text (2.3vw).

## "Що ви отримаєте" section (new, from the wireframe; not in Figma yet)

Placed after "Для кого", using the "Чому зараз?" section pattern (blue background, eyebrow, H2, intro, divider, 3-column cards). It sits inside the floating table-of-contents area with `id="deliverables"`, so the "Що ви отримаєте" link works and highlights there.

Distilled from the wireframe:

| Wireframe | Page |
|---|---|
| Eyebrow "04 · Що ви отримаєте — для власників і керівників" | "Що ви отримаєте" |
| H2 "Що ATLAS дає власникам і тим, хто ухвалює рішення" | Same, with "Що ATLAS дає" emphasised (the page's two-weight heading pattern) |
| Intro line | Same |
| Six cards: number, title, description, "Дає змогу", "Приклад" | Title, description and "Дає змогу". Numbers dropped (no other card section has them); examples dropped |
| "DA'AT" | "Daat" |

Card titles line up across each row; each card's description and benefit line flow together beneath its title.

The benefit line has no "Дає змогу:" label. The idea is phrased into the sentence instead:
1. "Ви одразу бачите…"
2. "Стає зрозуміло…"
3. "Ви робите наступний крок…"
4. "Команда знає, з чого почати…"
5. "Ви отримуєте результат…"
6. "Ви можете довести прогрес…"

Each benefit line is led by an orange "idea" icon (`assets/icon-idea.svg`, hugeicons stroke-rounded, drawn as a CSS mask) on its first line, with one line of space above it.

The "Приклад" examples are concrete evidence ("загальний індекс зрілості — 2,5 з 5…") and could come back later. The wireframe styles them as left-stripe callouts, which the critique flagged as a generic pattern, so they would need a different treatment.

## "Для кого" tabs: underline style

The pill buttons are replaced with text tabs (following the reference the client provided):

- **Labels:** title ("Я керую компанією", "Я інвестую або купую", "Я обираю підрядника") at the 24px lead size, all the same weight, on a thin cream baseline (20% opacity) spanning the content width.
- **States:**
  - Unselected tabs are dimmed cream (60%, about 7:1 contrast).
  - The selected tab's title and its 2px underline use the Venn diagram's blue (`#0066de`, 3.5:1, fine for 24px text). The underline grows in from the left when selected.
  - Hovering shows a short underline hint.
- **Sub-labels:** removed ("власник, CEO, керівник delivery" etc.); each panel's intro already says the same.
- **Mobile:** the tab row scrolls sideways; each tab has a 44px+ touch target.

## Section eyebrows removed

The labels above the section titles ("Чому зараз?", "Для кого?", "Що ви отримаєте") are removed, because they partly repeated the titles. Each section now opens with its H2, 96px below the section top and level with the floating table of contents. The table of contents still uses those names as its links.

## "Що всередині звіту ATLAS" section (new, from the mockup; not in Figma yet)

Placed after "Що ви отримаєте", on a light `#f5f4ed` background, inside the floating table-of-contents area, with its own TOC item "Що всередині звіту" (`#report`). Over light sections (marked `data-toc-theme="light"`) the TOC switches to dark text; on mobile its sticky bar turns cream.

- **Layout:** like "Для кого". The H2 and intro come first, then two columns with the same widths as that section: the three example charts (`assets/charts/maturity-scorecard.svg`, `priority-quadrant.svg`, `radar-it.svg`) in the Venn diagram's column (441 at 1440), pinned while the text scrolls; the numbered list, file chips and CTA in the situations column (480, gap 96). On mobile the charts follow the text.
- **Charts:** transparent background (the white background rectangle was removed from each SVG copy), no border, and no SDA mentions (the "SDA Delivery Audit · " prefix was removed from two subtitles). Clicking a chart opens it full size in an overlay that closes with Esc, a click or the × button.
- **Content:**
  - H2 "**Що всередині звіту ATLAS** — розділ за розділом" and the intro line.
  - The six report sections as a numbered list (the numbers are kept here because they are page order), separated by 2px dashed lines, with no line above the first or below the last.
  - The "А також робочі файли…" chips.
  - The standard CTA "Записатися на діагностичний дзвінок" (replaces the mockup's PDF-sample button and its "або записатися на дзвінок" link).
- **Dropped:** the "05 · …" label and the "СТА-3 ·" prefix (wireframe annotations), and the highlighted background on row 06.
- **Chart text:** the charts are images, so their labels use the charts' own font fallback (Helvetica/Arial) rather than the page's TT Commons. Their titles are in English.

TODO:
- Link "Приклади — у знахідках аудитів" (row 04) once `#audit-findings` exists.
- Link "Дивіться нижче ↓" (row 06) once `#roadmap` exists.
- Ukrainian versions of the charts if wanted.

## Hero bottom margin +20

The hero has a 20px bottom margin (scaled on desktop, 20px on mobile). Its dark background extends into it, so it still meets the blue section edge to edge. "Чому зараз?" is back to its regular 96px top padding (64 on mobile), level with the floating TOC. The hero buttons now overlap the blue section by about 13px instead of 33px.

## "Дорожня карта" section (new, from the mockup; not in Figma yet)

Placed after "Що всередині звіту ATLAS", in the "Для кого" style (dark `#0e151b` background), inside the floating TOC area with `id="roadmap"`, so the "Дорожня карта" TOC link works and highlights.

- **H2:** "**Ваша дорожня карта зростання:** горизонти 0–3, 3–9 і 9–18 місяців".
- **Intro:** the mockup's explainer, with "DA'AT" written as "Daat".
- **Tabs:** "0–3 місяці", "3–9 місяців", "9–18 місяців" (the mockup doesn't name the tabs; these are the three horizons from the heading). They switch like the "Для кого" tabs (click, ← → Home End), using the same underline style.

**Section order:** heading → explainer → horizon animation → tabs → horizon columns → revenue table.

**Horizon animation (full width, between the explainer and the tabs):**
- **Source:** a 121-frame clip with three stops: point A (frame 0, beam at the start), point B (frame 60, beam reaches the centre node) and point C (frame 120, beam reaches the right-hand component).
- **Behaviour:** selecting a tab plays from the current frame to that tab's stop, forwards or backwards, at 67.5fps (2.25× the clip's speed; A → C in about 1.8s). A click mid-animation re-targets from wherever it is, so any order works. With reduced motion it jumps straight to the stop.
- **Implementation:** a canvas image sequence like the scroll clip. Frames are in `assets/roadmap/{800,1440,2042}/`, and only the set the screen needs is downloaded (1.2–3.2 MB). The stop frames load first, and loading starts when the section is near.
- **Display:** edge to edge. Fader bands in the section colour blend it into the background: 340px at the top, 360px at the bottom (64px each on mobile). Each is solid where text overlaps the clip and fades over the visible part, stopping at the beam. Each band is solid `#0e151b` for its outer 60%, then eases to transparent, stopping short of the beam, which runs through the middle. They reach past the 200px overlaps into the circuit detail, because the clip's outer 200px is empty dark board.
- **Overlaps:** it has a −200px top margin (scaled; −64px on mobile), so it rises under the end of the explainer, which stays on top; the tabs and columns rise 200px over its faded bottom. The floating TOC stays visible over it.

**Horizon columns (under the animation, from the mockup):**
- **Columns:** one per tab ("H1 · 0–3 місяці", "H2 · 3–9 місяців", "H3 · 9–18 місяців"). Each has a title, a lead sentence and three actions with "Відповідальні: … · Готово, коли: …".
- **Position:** −200px top margin (scaled; −64px on mobile), so the columns rise over the bottom of the animation, layered above it.
- **Linked to the tabs:** they are the tabs' panels. All three stay visible: the selected horizon's column is at full strength and the others fade to 50%. Clicking a column selects its tab, which also plays the animation to that horizon's point; inactive columns show a pointer and brighten slightly on hover.
- **Separators:** no boxes and no horizontal lines; only pale vertical lines between columns (none on mobile, where the columns stack).
- **Copy:** "DA'AT" written as "Daat".

**Revenue impact table (under the horizon columns, from the mockup):**
- **Heading:** "Вплив на виручку: ілюстративний сценарій" with the mockup's caption.
- **Table:** columns Показник / Зараз / H1 / H2 / H3. Six rows: revenue run-rate, growth, additional revenue, gross margin, largest-client share and what drives the effect. Each revenue value has a bar under it on an equal-length track (one scale, $0 → $4,0 млн); a 2px gap at $3,0 млн marks today's level on every track, so the growth beyond it is visible. Value columns are equal width so the tracks line up.
- **Linked to the tabs:** the column for the selected horizon is bold and full white, with its revenue bar in the active blue (`#0066de`), and the others are muted. The mockup shows H3 bold as its static version.
- **Clickable:** clicking any cell in the H1–H3 columns (header included) selects that horizon, the same as its tab. Inactive columns show a pointer and brighten on hover; "Зараз" isn't clickable.
- **Separators:** thin pale lines between rows, no outer box.
- **Enabler forecast (second mockup, appended to the same table):** "Прогноз за енейблерами (індекс зрілості, цільові значення)" is a merged sub-header row across all columns. It is followed by seven enabler rows (Зараз / end of H1 / H2 / H3) and a bold "Загальний індекс зрілості" total row with a stronger line above it. The mockup's own column header (Енейблер / Зараз / Кінець H1…) isn't repeated, because the table's columns already match. These rows follow the horizon highlight and are clickable like the rest.
- **Compact layout:**
  - Rows have 8px vertical padding (was 16), and the label column is 32% wide so labels stay on one line.
  - The enabler forecast is folded by default. Its merged sub-header row is a toggle with the same animated chevron as the "Для кого" accordions, and the revealed rows fade in.
  - The "Загальний індекс зрілості" total row is always visible.
  - Height at 1440: about 830px before, 435px folded, 709px open.
- **Summary line removed:** the mockup's "+$725 тис. … → $1,16 млн на рік" strip below the table isn't used.
- **Mobile:** the table scrolls sideways (min width 720px).

TODO:
- Report row 06 can now link "Дивіться нижче ↓" to `#roadmap`.
