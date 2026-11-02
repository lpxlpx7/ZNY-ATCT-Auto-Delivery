import { plain } from "./options";
import { tableAirport } from "./table";

type Key = "runway" | "condition";

export const kewr = tableAirport<Key>({
  id: "kewr",
  code: "KEWR",
  name: "Newark",
  subtitle: "SIDs and initial altitudes from the EWR SOP and the current MBI.",
  source: { document: "NYARTCC EWR SOP", revision: "Rev. 5", revised: "2026-07-27", url: "https://wiki.nyartcc.org/wiki/EWR_SOP" },
  fields: [
    { kind: "choice", id: "runway", label: "Departure runway", default: "04L", columns: 6, options: plain("04L", "04R", "11", "22L", "22R", "29") },
    {
      kind: "choice",
      id: "condition",
      label: "Condition",
      default: "normal",
      options: [
        { id: "normal", label: "Normal" },
        { id: "lga_ils13", label: "LGA landing ILS 13" },
        { id: "portt_request", label: "Pilot requests RNAV PORTT" },
        { id: "unable_sid", label: "Unable SID / no charts" },
      ],
    },
  ],
  defaults: {
    sid: "EWR# Departure",
    climb: "Published procedure",
    altitude: "CLIMB VIA SID",
    departure: "119.200 or coordinated coverage",
    warning: "Check PRD, exit eligibility, runway configuration, and active MBI.",
  },
  rules: [
    { match: { runway: ["22L", "22R"] }, result: { sid: "LIB# Departure", climb: "TURNPIKE CLIMB", altitude: "MAINTAIN 2500" } },
    { match: { runway: ["29"] }, result: { sid: "EWR# Departure", climb: "Published procedure", altitude: "MAINTAIN 3000" } },
    { match: { condition: ["lga_ils13"], runway: ["04L", "04R", "11"] }, result: { sid: "DEVIL# Departure", climb: "Published DEVIL procedure", altitude: "MAINTAIN 2000" } },
    {
      match: { condition: ["portt_request"], runway: ["22L", "22R"] },
      result: { sid: "PORTT# Departure", climb: "Transition if ELIOT/LANNA/PARKE/BIGGY; otherwise radar vectors", altitude: "MAINTAIN 2500", warning: "PORTT requires RNAV and a verbal pilot request." },
    },
    {
      match: { condition: ["unable_sid"] },
      result: { sid: "NO SID - RADAR VECTORS", climb: "Tower issues runway-specific initial heading", warning: "Apply EWR no-DP heading table and coordinate departure frequency." },
    },
  ],
});
