import type { ChoiceField, Field, Option, TextField, Values } from "../types";
import { h } from "./dom";

function choices(field: ChoiceField, options: readonly Option[], value: string | undefined): HTMLDivElement {
  const list = h("div", { class: "choices", "data-columns": field.columns });
  for (const option of options) {
    list.append(
      h(
        "label",
        { class: "choice" },
        h("input", { type: "radio", name: field.id, value: option.id, checked: option.id === value }),
        h("span", {}, option.label),
      ),
    );
  }
  return list;
}

function choiceField(field: ChoiceField, value: string | undefined): HTMLFieldSetElement {
  const body: Node[] = field.groups
    ? field.groups.map((group) =>
        h("div", { class: "choice-group" }, h("span", { class: "choice-group-label" }, group.label), choices(field, field.options.filter((option) => option.group === group.id), value)),
      )
    : [choices(field, field.options, value)];
  return h("fieldset", { class: "field", "data-field": field.id }, h("legend", { class: "field-label" }, field.label), ...body);
}

function textField(field: TextField, value: string | undefined): HTMLDivElement {
  const id = `field-${field.id}`;
  return h(
    "div",
    { class: "field", "data-field": field.id },
    h("label", { class: "field-label", for: id }, field.label),
    h("input", {
      class: "text-input",
      id,
      name: field.id,
      value: value ?? "",
      placeholder: field.placeholder,
      maxlength: field.maxLength,
      inputmode: field.inputMode,
      pattern: field.pattern.source.replace(/^\^|\$$/g, ""),
      autocomplete: "off",
      spellcheck: false,
      "aria-describedby": field.hint ? `${id}-hint` : undefined,
    }),
    field.hint ? h("small", { class: "field-hint", id: `${id}-hint` }, field.hint) : null,
  );
}

export function renderForm(form: HTMLFormElement, fields: readonly Field[], values: Values): void {
  form.replaceChildren(...fields.map((field) => (field.kind === "choice" ? choiceField(field, values[field.id]) : textField(field, values[field.id]))));
}

export function readForm(form: HTMLFormElement): Values {
  const values: Values = {};
  for (const [name, value] of new FormData(form)) {
    if (typeof value === "string") values[name] = value;
  }
  return values;
}

/** A key that changes only when the set of fields changes, so the form is rebuilt only then. */
export function fieldSignature(fields: readonly Field[]): string {
  return fields.map((field) => field.id).join("|");
}
