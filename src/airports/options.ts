import type { Option } from "../types";

/** Options whose label is the same as their id, such as runways and fixes. */
export function plain(...ids: string[]): Option[] {
  return ids.map((id) => ({ id, label: id }));
}
