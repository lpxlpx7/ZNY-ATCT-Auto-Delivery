import type { Airport } from "../types";
import { kewr } from "./kewr";
import { kjfk } from "./kjfk";
import { klga } from "./klga";
import { kphl } from "./kphl";

export const AIRPORTS: readonly Airport[] = [kjfk, kewr, klga, kphl];

export function findAirport(id: string | null | undefined): Airport | undefined {
  return AIRPORTS.find((airport) => airport.id === id?.toLowerCase());
}
