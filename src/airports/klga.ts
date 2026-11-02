import { plain } from "./options";
import { tableAirport } from "./table";

type Key = "runway" | "landing" | "gate";

export const klga = tableAirport<Key>({
  id: "klga",
  code: "KLGA",
  name: "LaGuardia",
  subtitle: "Departures by runway. Runway 13 also needs airspace coordination.",
  source: { document: "NYARTCC LGA SOP", revision: "Rev. 5", revised: "2026-03-30", url: "https://wiki.nyartcc.org/wiki/LGA_SOP" },
  fields: [
    { kind: "choice", id: "runway", label: "Departure runway", default: "04", columns: 4, options: plain("04", "13", "22", "31") },
    { kind: "choice", id: "landing", label: "LGA landing runway", default: "31", columns: 4, options: plain("04", "13", "22", "31") },
    {
      kind: "choice",
      id: "gate",
      label: "Departure gate",
      default: "north",
      columns: 4,
      options: [
        { id: "north", label: "North" },
        { id: "east", label: "East" },
        { id: "south", label: "South" },
        { id: "west", label: "West" },
      ],
    },
  ],
  defaults: {
    procedure: "LGA# Departure",
    instruction: "Coordinate climb/heading from current airspace ownership",
    altitude: "MAINTAIN 5000 unless CLIMB VIA SID applies",
    departure: "120.400 or coordinated coverage",
    warning: "Runway 13 requires Belmont/Coney ownership and JFK configuration; do not infer it from runway alone.",
  },
  rules: [
    { match: { runway: ["04"], landing: ["13"] }, result: { procedure: "LGA# Departure", instruction: "EXCEPT FLY HDG 070", altitude: "MAINTAIN 5000" } },
    { match: { runway: ["04"], gate: ["west"] }, result: { procedure: "LGA# Departure", instruction: "BRONX CLIMB", altitude: "MAINTAIN 5000" } },
    { match: { runway: ["04"] }, result: { procedure: "LGA# Departure", instruction: "PELHAM CLIMB", altitude: "MAINTAIN 5000" } },
    { match: { runway: ["22"], gate: ["south"] }, result: { procedure: "HOPEA# when LGA owns Coney; otherwise JUTES#", instruction: "Verify Coney ownership", altitude: "CLIMB VIA SID" } },
    { match: { runway: ["22"] }, result: { procedure: "JUTES# Departure", instruction: "Published procedure", altitude: "CLIMB VIA SID" } },
    { match: { runway: ["31"], landing: ["04"] }, result: { procedure: "LGA# Departure", instruction: "EXCEPT FLY HDG 360", altitude: "MAINTAIN 5000" } },
    { match: { runway: ["31"], landing: ["22"] }, result: { procedure: "LGA# Departure", instruction: "EXCEPT FLY HDG 355", altitude: "MAINTAIN 5000" } },
    { match: { runway: ["31"], gate: ["west"] }, result: { procedure: "LGA# Departure", instruction: "EXCEPT FLY HDG 360", altitude: "MAINTAIN 5000" } },
    { match: { runway: ["31"] }, result: { procedure: "LGA# Departure", instruction: "EXCEPT FLY HDG 020", altitude: "MAINTAIN 5000" } },
  ],
});
