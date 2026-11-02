import { AIRPORTS, findAirport } from "./airports";
import type { Values } from "./types";

const STORAGE_KEY = "zny-departure-director:v2";

export interface AppState {
  airport: string;
  /** Last selections for every airport, so switching tabs doesn't lose them. */
  values: Record<string, Values>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValues(value: unknown): Values {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

function fromStorage(): AppState | undefined {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!isRecord(parsed) || typeof parsed.airport !== "string" || !isRecord(parsed.values)) return undefined;
    const values = Object.fromEntries(Object.entries(parsed.values).map(([id, entry]) => [id, stringValues(entry)]));
    return { airport: parsed.airport, values };
  } catch {
    return undefined;
  }
}

/** Reads "#kjfk?runway=04L&exit=SAX" style links. */
function fromHash(hash: string): { airport: string; values: Values } | undefined {
  const [path = "", query = ""] = hash.replace(/^#\/?/, "").split("?");
  const airport = findAirport(path);
  if (!airport) return undefined;
  return { airport: airport.id, values: Object.fromEntries(new URLSearchParams(query)) };
}

export function loadState(): AppState {
  const stored = fromStorage();
  const state: AppState = {
    airport: findAirport(stored?.airport)?.id ?? AIRPORTS[0]!.id,
    values: stored?.values ?? {},
  };
  const linked = fromHash(location.hash);
  if (linked) {
    state.airport = linked.airport;
    state.values[linked.airport] = { ...state.values[linked.airport], ...linked.values };
  }
  return state;
}

export function saveState(state: AppState, visible: Values): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the link below still carries the state.
  }
  const shareable = Object.fromEntries(Object.entries(visible).filter(([, value]) => value !== ""));
  const query = new URLSearchParams(shareable).toString();
  history.replaceState(null, "", `#${state.airport}${query ? `?${query}` : ""}`);
}

export function onHashChange(listener: (airport: string, values: Values) => void): void {
  window.addEventListener("hashchange", () => {
    const linked = fromHash(location.hash);
    if (linked) listener(linked.airport, linked.values);
  });
}
