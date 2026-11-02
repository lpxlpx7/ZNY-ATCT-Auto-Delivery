import "./styles.css";
import { AIRPORTS, findAirport } from "./airports";
import { headingFrom, normalize, runwayHeading } from "./engine";
import { loadState, onHashChange, saveState } from "./state";
import type { Airport, Departure } from "./types";
import { createCompass } from "./ui/compass";
import { byId, h, isTyping, setText, svg } from "./ui/dom";
import { fieldSignature, readForm, renderForm } from "./ui/form";
import { icons, type IconName } from "./ui/icons";

const state = loadState();
const form = byId<HTMLFormElement>("configForm");
const compass = createCompass();
let renderedSignature = "";
let current: Departure | undefined;

function airport(): Airport {
  return findAirport(state.airport) ?? AIRPORTS[0]!;
}

function iconLabel(name: IconName, label: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  fragment.append(svg(icons[name]), h("span", {}, label));
  return fragment;
}

// ---------- Clock & theme ----------

function tick(): void {
  byId("clock").textContent = `${new Date().toISOString().slice(11, 19)}Z`;
}

type Theme = "light" | "dark";

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = theme === "dark" ? "#0b0f17" : "#f3f5f8";
  const button = byId("themeButton");
  button.replaceChildren(svg(theme === "dark" ? icons.sun : icons.moon));
  button.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}

function toggleTheme(): void {
  const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Not remembered, but still applied for this visit.
  }
  applyTheme(next);
}

// ---------- Toast & clipboard ----------

let toastTimer = 0;

function toast(message: string): void {
  const element = byId("toast");
  element.textContent = message;
  element.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => element.classList.remove("show"), 1800);
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API needs a secure context; fall back to a hidden textarea.
    const area = h("textarea", { readonly: true, style: "position:fixed;opacity:0" });
    area.value = text;
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

async function copyClearance(): Promise<void> {
  if (!current) return;
  const button = byId("copyButton");
  if (await copy(current.clearance)) {
    toast("Clearance copied");
    button.replaceChildren(iconLabel("check", "Copied"));
    button.classList.add("done");
    window.setTimeout(() => {
      button.replaceChildren(iconLabel("copy", "Copy"));
      button.classList.remove("done");
    }, 1600);
  } else {
    toast("Couldn't copy. Select the text instead.");
  }
}

// ---------- Rendering ----------

function renderTabs(): void {
  const tabs = byId("airportTabs");
  tabs.replaceChildren(
    ...AIRPORTS.map((item, index) =>
      h(
        "button",
        { type: "button", class: "airport-tab", "data-airport": item.id, "aria-pressed": item.id === state.airport, title: `${item.name} (${index + 1})` },
        h("b", {}, item.code),
        h("small", {}, item.name),
      ),
    ),
  );
}

function renderMeta(): void {
  const { code, subtitle, source } = airport();
  setText("facilityBadge", code);
  setText("profileSubtitle", subtitle);
  setText("sourceName", source.document);
  setText("sourceMeta", `${source.revision} · Revised ${source.revised}`);
  byId<HTMLAnchorElement>("sourceLink").href = source.url;
  document.title = `${code} · ZNY Departure Director`;
}

function renderResult(departure: Departure): void {
  current = departure;
  const heading = headingFrom(departure.instruction);
  compass.update(runwayHeading(departure.runway), heading);

  setText("primaryLabel", /HDG|HEADING|CLIMB/i.test(departure.instruction) ? "Heading / climb" : "Instruction");
  setText("primaryInstruction", departure.instruction);
  setText("procedureText", departure.procedure);
  setText("altitudeText", departure.altitude);
  // "135.900 (guide only; coordinate coverage)" → the number, with the note on its own line.
  const [frequency = "", note] = departure.frequency.split(/ \((.*)\)$/);
  byId("frequencyText").replaceChildren(frequency || "—", note ? h("small", {}, note) : "");
  setText("runwayText", departure.runway);
  setText("clearanceText", departure.clearance);
  setText("warningText", departure.warning);

  const notice = byId("notice");
  notice.dataset.severity = departure.severity;
  byId("noticeIcon").replaceChildren(svg(icons[departure.severity]));
  byId("result").dataset.severity = departure.severity;

  setText("dockInstruction", departure.instruction);
  setText("dockMeta", [departure.altitude, frequency].filter(Boolean).join(" · "));
}

/** Re-resolves from the current selections. Rebuilds the form only when its fields change. */
function update(): void {
  const selected = airport();
  const stored = state.values[selected.id] ?? {};
  let fields = selected.fields(stored);
  let values = normalize(fields, stored);
  // Field sets can depend on values (JFK IFR/VFR), so settle once more after normalizing.
  fields = selected.fields(values);
  values = normalize(fields, { ...stored, ...values });

  const signature = `${selected.id}:${fieldSignature(fields)}`;
  if (signature !== renderedSignature) {
    renderForm(form, fields, values);
    renderedSignature = signature;
  }

  state.values[selected.id] = { ...stored, ...values };
  renderResult(selected.resolve(values));
  saveState(state, values);
}

function selectAirport(id: string): void {
  if (!findAirport(id) || id === state.airport) return;
  state.airport = id;
  renderTabs();
  renderMeta();
  update();
}

function onFormChange(): void {
  const selected = airport();
  state.values[selected.id] = { ...state.values[selected.id], ...readForm(form) };
  update();
}

function reset(): void {
  const selected = airport();
  state.values[selected.id] = {};
  renderedSignature = "";
  update();
  toast(`${selected.code} reset to defaults`);
}

// ---------- Mobile dock ----------

/** On small screens the result sits below the form; a dock keeps the answer in view while choosing. */
function watchDock(): void {
  const dock = byId<HTMLButtonElement>("dock");
  const result = byId("result");
  const narrow = matchMedia("(max-width: 900px)");
  let resultVisible = true;
  const sync = (): void => {
    dock.hidden = !narrow.matches || resultVisible;
  };
  new IntersectionObserver(([entry]) => {
    resultVisible = entry?.isIntersecting ?? true;
    sync();
  }, { threshold: 0.15 }).observe(result);
  narrow.addEventListener("change", sync);
  dock.addEventListener("click", () => result.scrollIntoView({ behavior: "smooth", block: "start" }));
}

// ---------- Wiring ----------

function init(): void {
  byId("brandMark").replaceChildren(svg(icons.logo));
  byId("compassSlot").replaceChildren(compass.element);
  byId("resetButton").replaceChildren(iconLabel("reset", "Reset"));
  byId("copyButton").replaceChildren(iconLabel("copy", "Copy"));
  byId("shareButton").replaceChildren(iconLabel("link", "Link"));

  applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {
      // Treat as no saved preference.
    }
    if (!saved) applyTheme(event.matches ? "dark" : "light");
  });

  tick();
  window.setInterval(tick, 1000);

  byId("airportTabs").addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-airport]");
    if (button?.dataset.airport) selectAirport(button.dataset.airport);
  });
  form.addEventListener("change", onFormChange);
  form.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "text") {
      target.value = target.value.replace(/\D/g, "");
      onFormChange();
    }
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  byId("themeButton").addEventListener("click", toggleTheme);
  byId("resetButton").addEventListener("click", reset);
  byId("copyButton").addEventListener("click", () => void copyClearance());
  byId("shareButton").addEventListener("click", async () => {
    toast((await copy(location.href)) ? "Link copied" : "Couldn't copy the link");
  });

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
    const index = Number(event.key) - 1;
    const target = AIRPORTS[index];
    if (target) {
      selectAirport(target.id);
    } else if (event.key === "c" || event.key === "C") {
      void copyClearance();
    } else if (event.key === "t" || event.key === "T") {
      toggleTheme();
    } else {
      return;
    }
    event.preventDefault();
  });

  onHashChange((id, values) => {
    state.values[id] = { ...state.values[id], ...values };
    renderedSignature = "";
    if (id !== state.airport) {
      state.airport = id;
      renderTabs();
      renderMeta();
    }
    update();
  });

  renderTabs();
  renderMeta();
  update();
  watchDock();
}

init();
