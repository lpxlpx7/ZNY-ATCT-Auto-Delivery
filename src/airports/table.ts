import { mostSpecificMatch, optionLabel, type Rule } from "../engine";
import type { Airport, ChoiceField, Source } from "../types";

/** One row of a lookup table. Which keys an airport uses depends on how its SOP is written. */
export interface TableResult {
  readonly sid?: string;
  readonly procedure?: string;
  readonly heading?: string;
  readonly instruction?: string;
  readonly climb?: string;
  readonly altitude?: string;
  readonly departure?: string;
  readonly warning?: string;
}

export interface TableAirportSpec<K extends string> {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly subtitle: string;
  readonly source: Source;
  readonly fields: readonly (ChoiceField & { readonly id: K })[];
  readonly defaults: TableResult & { readonly warning: string };
  readonly rules: readonly Rule<TableResult, K>[];
}

/** An airport whose departure comes from a single most-specific-match table. */
export function tableAirport<K extends string>(spec: TableAirportSpec<K>): Airport {
  const runwayField = spec.fields.find((field) => field.id === "runway");

  return {
    id: spec.id,
    code: spec.code,
    name: spec.name,
    subtitle: spec.subtitle,
    source: spec.source,
    fields: () => spec.fields,
    resolve(values) {
      const matched = mostSpecificMatch(spec.rules, values);
      const result: TableResult = { ...spec.defaults, ...matched };
      const procedure = result.sid || result.procedure || "Published procedure";
      const instruction = result.heading || result.instruction || result.climb || "Coordinate instructions";
      const altitude = result.altitude ?? "";
      const frequency = result.departure ?? "";
      const runway = values.runway ?? "";

      return {
        instruction,
        procedure,
        altitude,
        frequency,
        runway: runwayField ? optionLabel(runwayField, runway) : runway,
        clearance: [spec.code, `RWY ${runway}`, procedure, instruction, altitude, frequency].filter(Boolean).join(" · "),
        warning: result.warning ?? spec.defaults.warning,
        severity: matched?.warning ? "caution" : "info",
      };
    },
  };
}
