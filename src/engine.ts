import type { ChoiceField, Field, Values } from "./types";

/** A match value that accepts anything, including a key that isn't set. */
export const ANY = "*";

export type Context = Readonly<Record<string, string | undefined>>;
export type Match<K extends string> = Partial<Record<K, readonly string[]>>;

export interface Rule<R, K extends string = string> {
  readonly match: Match<K>;
  readonly result: R;
}

export function matches(match: Match<string>, context: Context): boolean {
  return Object.entries(match).every(([key, accepted]) => {
    if (!accepted) return true;
    if (accepted.includes(ANY)) return true;
    const value = context[key];
    return value !== undefined && accepted.includes(value);
  });
}

/** The first rule that matches wins. */
export function firstMatch<R>(rules: readonly Rule<R>[], context: Context, fallback: R): R {
  return rules.find((rule) => matches(rule.match, context))?.result ?? fallback;
}

/** The matching rule with the most keys wins; on a tie, the later rule wins. */
export function mostSpecificMatch<R>(rules: readonly Rule<R>[], context: Context): R | undefined {
  let selected: R | undefined;
  let bestScore = -1;
  for (const rule of rules) {
    const score = Object.keys(rule.match).length;
    if (score >= bestScore && matches(rule.match, context)) {
      selected = rule.result;
      bestScore = score;
    }
  }
  return selected;
}

/** Extracts a heading in degrees from text such as "RIGHT HDG 100" or "heading 185". */
export function headingFrom(instruction: string): number | null {
  const match = /(?:HDG|HEADING)\s*(\d{2,3})/i.exec(instruction);
  return match?.[1] ? Number(match[1]) % 360 : null;
}

/** "04L" → 40, "31" → 310. */
export function runwayHeading(runway: string): number {
  const digits = Number.parseInt(runway.slice(0, 2), 10);
  return Number.isNaN(digits) ? 0 : (digits * 10) % 360;
}

/** Returns the bare frequency when the text names exactly one, so it reads cleanly in a clearance. */
export function spokenFrequency(text: string): string {
  const found = text.match(/\b1[1-3]\d\.\d{1,3}\b/g);
  return found?.length === 1 ? found[0] : text;
}

export function optionLabel(field: ChoiceField, id: string | undefined): string {
  return field.options.find((option) => option.id === id)?.label ?? id ?? "";
}

/**
 * Keeps only the values for the given fields, replacing missing or stale
 * choices with the field default (or its first option).
 */
export function normalize(fields: readonly Field[], values: Values): Values {
  const result: Values = {};
  for (const field of fields) {
    const current = values[field.id];
    if (field.kind === "text") {
      result[field.id] = current ?? "";
    } else if (current !== undefined && field.options.some((option) => option.id === current)) {
      result[field.id] = current;
    } else {
      result[field.id] = field.default ?? field.options[0]?.id ?? "";
    }
  }
  return result;
}
