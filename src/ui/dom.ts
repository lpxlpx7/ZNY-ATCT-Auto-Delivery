type Child = Node | string | null | undefined | false;
type Attributes = Record<string, string | number | boolean | undefined>;

/** Creates an element with attributes and children. `false`/`undefined` attributes are skipped. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attributes: Attributes = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (name.startsWith("aria-") && typeof value === "boolean") {
      element.setAttribute(name, String(value));
      continue;
    }
    if (value === false || value === undefined) continue;
    element.setAttribute(name, value === true ? "" : String(value));
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    element.append(child);
  }
  return element;
}

/** Parses a trusted, static SVG string (icons only). */
export function svg(markup: string): SVGSVGElement {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild as SVGSVGElement;
}

export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id} in index.html`);
  return element as T;
}

export function setText(id: string, value: string | undefined): void {
  byId(id).textContent = value || "—";
}

export function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && !(target instanceof HTMLInputElement && target.type === "radio"));
}
