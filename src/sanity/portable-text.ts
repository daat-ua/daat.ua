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

export const headingId = (block: Block) => slugify(textOf(block));

const isBlock = (node: TypedObject): node is Block => node._type === "block";

/** The body's h2 headings, for the "on this page" list */
export const headingsOf = (body: TypedObject[] | null | undefined) =>
  (body ?? [])
    .filter(isBlock)
    .filter((b) => b.style === "h2")
    .map((b) => ({ id: headingId(b), label: toPlainText(b).trim() }));
