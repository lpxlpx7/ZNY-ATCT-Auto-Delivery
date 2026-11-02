/** Current form selections, keyed by field id. */
export type Values = Record<string, string>;

export interface Option {
  readonly id: string;
  readonly label: string;
  /** Groups options under a sub-heading (see ChoiceField.groups). */
  readonly group?: string;
}

export interface ChoiceField {
  readonly kind: "choice";
  readonly id: string;
  readonly label: string;
  readonly options: readonly Option[];
  readonly default?: string;
  readonly groups?: readonly { readonly id: string; readonly label: string }[];
  /** Lay options out on an even grid instead of letting them wrap freely. */
  readonly columns?: number;
}

export interface TextField {
  readonly kind: "text";
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly pattern: RegExp;
  readonly maxLength: number;
  readonly inputMode: "numeric" | "text";
  readonly hint?: string;
}

export type Field = ChoiceField | TextField;

export interface Source {
  readonly document: string;
  readonly revision: string;
  readonly revised: string;
  readonly url: string;
}

export type Severity = "info" | "caution" | "stop";

/** Everything the result panel shows for one set of selections. */
export interface Departure {
  readonly instruction: string;
  readonly procedure: string;
  readonly altitude: string;
  readonly frequency: string;
  readonly runway: string;
  readonly clearance: string;
  readonly warning: string;
  readonly severity: Severity;
}

export interface Airport {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly subtitle: string;
  readonly source: Source;
  /** Fields can depend on the current selections (JFK switches between IFR and VFR). */
  fields(values: Values): readonly Field[];
  resolve(values: Values): Departure;
}
