import { tableAirport } from "./table";

type Key = "runway" | "aircraft" | "exit";

export const kphl = tableAirport<Key>({
  id: "kphl",
  code: "KPHL",
  name: "Philadelphia",
  subtitle: "Initial altitudes and tower-assigned departure headings.",
  source: { document: "NYARTCC PHL SOP", revision: "Rev. 19", revised: "2026-03-29", url: "https://wiki.nyartcc.org/wiki/PHL_SOP" },
  fields: [
    {
      kind: "choice",
      id: "runway",
      label: "Departure runway",
      default: "27",
      columns: 4,
      options: [
        { id: "27", label: "27L/R" },
        { id: "09", label: "09L/R · 08" },
        { id: "17", label: "17" },
        { id: "35", label: "35" },
      ],
    },
    {
      kind: "choice",
      id: "aircraft",
      label: "Aircraft",
      default: "jet",
      columns: 2,
      options: [
        { id: "jet", label: "Jet" },
        { id: "prop", label: "Prop / turboprop" },
      ],
    },
    {
      kind: "choice",
      id: "exit",
      label: "Exit",
      default: "north",
      options: [
        { id: "north", label: "North" },
        { id: "south", label: "South" },
        { id: "ood_ditch_ruuth", label: "OOD / DITCH / RUUTH" },
        { id: "dqo_stoen", label: "DQO / STOEN" },
        { id: "mxe_ptw_fjc_mazie_ard", label: "MXE / PTW / FJC / MAZIE / ARD" },
      ],
    },
  ],
  defaults: {
    sid: "PHL# Departure",
    heading: "Coordinate runway/type/exit heading",
    altitude: "JET 5000 / PROP 3000 or lower assigned",
    departure: "North 124.350 / South 119.750",
    warning: "Check PRD, SAPR, arrival runway restrictions, and nonstandard runway release.",
  },
  rules: [
    { match: { runway: ["27"], aircraft: ["prop"], exit: ["north"] }, result: { heading: "HDG 300" } },
    { match: { runway: ["27"], aircraft: ["prop"], exit: ["south"] }, result: { heading: "HDG 210" } },
    { match: { runway: ["27"], exit: ["ood_ditch_ruuth"] }, result: { heading: "HDG 230" } },
    { match: { runway: ["27"], exit: ["dqo_stoen"] }, result: { heading: "HDG 245" } },
    { match: { runway: ["27"], exit: ["mxe_ptw_fjc_mazie_ard", "north"] }, result: { heading: "HDG 265" } },
    { match: { runway: ["09"], aircraft: ["prop"], exit: ["north"] }, result: { heading: "HDG 065" } },
    { match: { runway: ["09"], aircraft: ["prop"], exit: ["south"] }, result: { heading: "HDG 125" } },
    { match: { runway: ["17"] }, result: { heading: "HDG 130" } },
    { match: { runway: ["35"] }, result: { heading: "HDG 300 if cruise >= 5000; otherwise runway heading" } },
  ],
});
