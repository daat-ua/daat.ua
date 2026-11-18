import { toPlainText } from "astro-portabletext";
import type { Block, TypedObject } from "astro-portabletext/types";

// Heading ids for the "on this page" list: the heading text, transliterated from Ukrainian (as on beta.daat.ua)
const UA: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ie",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "iu",
  я: "ia",
};

export function slugify(text: string) {
  return [...text.trim().toLowerCase()]
    .map((c) => UA[c] ?? c)
    .join("")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// The text of a block, read from every `text` underneath it: inside a block component the children are
// astro-portabletext's own nodes (not spans), which toPlainText() doesn't read.
const textOf = (node: unknown): string => {
  if (!node || typeof node !== "object") return "";
  const { text, children } = node as { text?: unknown; children?: unknown };
  if (typeof text === "string") return text;
  return Array.isArray(children) ? children.map(textOf).join("") : "";
};

/** A heading's id: the one withHeadingIds() gave it, else its text's */
export const headingId = (block: Block & { headingId?: string }) => block.headingId ?? slugify(textOf(block));

const isBlock = (node: TypedObject): node is Block => node._type === "block";
const isHeading = (node: TypedObject): node is Block => isBlock(node) && (node.style === "h2" || node.style === "h3");

/** The body with an id on every h2/h3 for Heading to render: the heading's text, and a repeated one numbered
 * ("pryklad", "pryklad-2"), so each "on this page" link reaches its own heading. A number is skipped when another
 * heading already has that id ("План", "План", "План-2" → plan, plan-2, plan-2-2) */
export function withHeadingIds<T extends TypedObject>(body: T[] | null | undefined): T[] {
  const taken = new Set<string>();
  return (body ?? []).map((node) => {
    if (!isHeading(node)) return node;
    const base = slugify(textOf(node));
    let id = base;
    for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
    taken.add(id);
    return { ...node, headingId: id };
  });
}

/** The headings of one level (h2 on findings, h3 on delivery management episodes) of a body from
 * withHeadingIds(), for the "on this page" list */
export const headingsOf = (body: TypedObject[], level: "h2" | "h3" = "h2") =>
  body
    .filter(isBlock)
    .filter((b) => b.style === level)
    .map((b) => ({ id: headingId(b), label: toPlainText(b).trim() }));
