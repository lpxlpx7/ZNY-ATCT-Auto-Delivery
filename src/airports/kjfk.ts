import { firstMatch, spokenFrequency, type Rule } from "../engine";
import type { Airport, Field, Option } from "../types";
import { plain } from "./options";

type Key =
  | "operation" | "runway" | "aircraft" | "configuration" | "navigation" | "route_group"
  | "flight_following" | "exit" | "exit_gate" | "sid" | "climb_id";

type JfkRule<R> = Rule<R, Key>;

type Gate = "north" | "east" | "southwest" | "water_bette_hapie" | "water_shipp_wavey";

const GATES: readonly { id: Gate; label: string; exits: readonly string[] }[] = [
  { id: "north", label: "North", exits: ["SAX", "COATE", "NEION", "HAAYS", "GAYEL", "DEEZZ"] },
  { id: "east", label: "East", exits: ["GREKI", "MERIT", "BAYYS", "BDR"] },
  { id: "southwest", label: "Southwest", exits: ["DIXIE", "WHITE", "RBV", "ARD"] },
  { id: "water_bette_hapie", label: "Water · BETTE / HAPIE", exits: ["BETTE", "HAPIE"] },
  { id: "water_shipp_wavey", label: "Water · SHIPP / WAVEY", exits: ["SHIPP", "WAVEY"] },
];

const EXIT_GATE = new Map<string, Gate>(GATES.flatMap((gate) => gate.exits.map((exit) => [exit, gate.id] as const)));

const DEFAULT_WARNING = {
  ifr: "Check the PRD, exit eligibility, runway configuration and any active coordination.",
  vfr: "Check airspace, squawk and which positions are online before you issue a VFR departure.",
};

// ---------- Fields ----------

const field = {
  operation: { kind: "choice", id: "operation", label: "Flight rules", columns: 2, options: [{ id: "ifr_departure", label: "IFR" }, { id: "vfr_departure", label: "VFR" }] },
  runway: { kind: "choice", id: "runway", label: "Departure runway", columns: 4, options: plain("04L", "04R", "13L", "13R", "22L", "22R", "31L", "31R") },
  aircraft: { kind: "choice", id: "aircraft", label: "Aircraft", columns: 2, options: [{ id: "jet", label: "Jet" }, { id: "prop", label: "Prop / turboprop" }] },
  configuration: {
    kind: "choice",
    id: "configuration",
    label: "Airport configuration",
    columns: 2,
    options: [
      { id: "normal", label: "Normal" },
      { id: "overnight", label: "2300–0700 local" },
      { id: "overflow_22l", label: "Overflow 22L" },
      { id: "overflow_4r", label: "Overflow 4R" },
      { id: "ils_13l", label: "ILS 13L in use" },
      { id: "lga_loc31", label: "LGA landing LOC 31" },
    ],
  },
  navigation: {
    kind: "choice",
    id: "navigation",
    label: "Navigation",
    options: [
      { id: "rnav", label: "RNAV" },
      { id: "non_rnav", label: "Non-RNAV, can fly a SID" },
      { id: "unable_sid", label: "Unable SID / no charts" },
    ],
  },
  route_group: {
    kind: "choice",
    id: "route_group",
    label: "Route",
    options: [
      { id: "standard", label: "Standard" },
      { id: "deezz_candr", label: "DEEZZ via J60/J64/Q480/Q42" },
      { id: "deezz_towin", label: "DEEZZ via J6 (TMU only)" },
    ],
  },
  flight_following: {
    kind: "choice",
    id: "flight_following",
    label: "Flight following",
    columns: 2,
    options: [{ id: "yes", label: "Requested" }, { id: "no", label: "Not requested (props only)" }],
  },
  exit: {
    kind: "choice",
    id: "exit",
    label: "Exit",
    groups: GATES.map(({ id, label }) => ({ id, label })),
    options: GATES.flatMap((gate) => gate.exits.map((exit): Option => ({ id: exit, label: exit, group: gate.id }))),
  },
  squawk: {
    kind: "text",
    id: "squawk",
    label: "Squawk",
    placeholder: "e.g. 0412",
    pattern: /^[0-7]{4}$/,
    maxLength: 4,
    inputMode: "numeric",
    hint: "Optional. Fills the code into the clearance.",
  },
} as const satisfies Record<string, Field>;

const IFR_FIELDS: readonly Field[] = [field.operation, field.runway, field.aircraft, field.configuration, field.navigation, field.route_group, field.exit];
const VFR_FIELDS: readonly Field[] = [field.operation, field.runway, field.aircraft, field.flight_following, field.configuration, field.exit, field.squawk];

// ---------- IFR rules ----------

interface Procedure { sid: string; sid_label: string; transition?: string; clearance_segment: string; warning?: string }
interface Climb { climb_id: string; instruction: string; clearance_segment: string; warning?: string }

const PROCEDURE: readonly JfkRule<Procedure>[] = [
  {
    match: { aircraft: ["jet"], navigation: ["rnav"], route_group: ["deezz_candr"] },
    result: { sid: "deezz", sid_label: "DEEZZ# Departure", transition: "CANDR", clearance_segment: "DEEZZ# Departure, CANDR transition" },
  },
  {
    match: { aircraft: ["jet"], navigation: ["rnav"], route_group: ["deezz_towin"] },
    result: { sid: "deezz", sid_label: "DEEZZ# Departure", transition: "TOWIN", clearance_segment: "DEEZZ# Departure, TOWIN transition", warning: "TOWIN/J6 is TMU only; verify the qualifying destination and TMU direction." },
  },
  {
    match: { navigation: ["rnav"], runway: ["31L", "31R"], exit_gate: ["southwest"] },
    result: { sid: "skorr", sid_label: "SKORR# Departure", transition: "RNGRR", clearance_segment: "SKORR# Departure, RNGRR transition" },
  },
  {
    match: { navigation: ["rnav"], runway: ["31L", "31R"], exit_gate: ["*"] },
    result: { sid: "skorr", sid_label: "SKORR# Departure", transition: "YNKEE", clearance_segment: "SKORR# Departure, YNKEE transition" },
  },
  {
    match: { navigation: ["unable_sid"], runway: ["*"] },
    result: { sid: "none", sid_label: "No SID", clearance_segment: "radar vectors", warning: "Verify pilot chart capability. If unable to accept a SID, Tower must issue applicable initial instructions with takeoff clearance." },
  },
  { match: { runway: ["*"] }, result: { sid: "jfk", sid_label: "JFK# Departure", clearance_segment: "Kennedy# Departure" } },
];

/** A plain "HDG nnn" climb. */
function hdg(heading: string): Climb {
  return { climb_id: `heading_${heading}`, instruction: `HDG ${heading}`, clearance_segment: `heading ${heading}` };
}

const R13 = ["13L", "13R"];
const R31 = ["31L", "31R"];
const NORTH_EAST = ["north", "east"];

const CLIMB: readonly JfkRule<Climb>[] = [
  { match: { sid: ["skorr"], runway: ["*"] }, result: { climb_id: "skorr", instruction: "No separately issued climb; use SKORR transition", clearance_segment: "" } },
  { match: { sid: ["deezz"], runway: ["22L", "22R"] }, result: { climb_id: "runway_heading", instruction: "FLY RUNWAY HEADING", clearance_segment: "fly runway heading" } },
  {
    match: { runway: ["04L", "04R"] },
    result: { climb_id: "heading_100", instruction: "RWY HDG to JFK 1.5 DME, then RIGHT HDG 100", clearance_segment: "except fly runway heading to the Kennedy 1.5 DME, then turn right heading 100" },
  },
  { match: { runway: R13, configuration: ["overnight"], exit_gate: ["*"] }, result: hdg("185") },

  { match: { runway: R13, configuration: ["ils_13l"], exit_gate: ["southwest"] }, result: hdg("185") },
  { match: { runway: R13, configuration: ["ils_13l"], exit_gate: ["water_shipp_wavey"] }, result: hdg("170") },
  { match: { runway: R13, configuration: ["ils_13l"], exit_gate: ["water_bette_hapie"] }, result: hdg("155") },
  { match: { runway: R13, configuration: ["ils_13l"], aircraft: ["jet"], exit_gate: NORTH_EAST }, result: hdg("155") },
  { match: { runway: R13, configuration: ["ils_13l"], aircraft: ["prop"], exit_gate: NORTH_EAST }, result: hdg("140") },

  { match: { runway: R13, configuration: ["overflow_22l"], exit_gate: ["southwest"] }, result: hdg("185") },
  { match: { runway: R13, configuration: ["overflow_22l"], exit_gate: ["water_shipp_wavey"] }, result: hdg("170") },
  { match: { runway: R13, configuration: ["overflow_22l"], exit_gate: ["water_bette_hapie"] }, result: hdg("155") },
  { match: { runway: R13, configuration: ["overflow_22l"], aircraft: ["jet"], exit_gate: NORTH_EAST }, result: hdg("155") },
  { match: { runway: R13, configuration: ["overflow_22l"], aircraft: ["prop"], exit_gate: NORTH_EAST }, result: hdg("140") },

  { match: { runway: R13, configuration: ["overflow_4r"], aircraft: ["prop"], exit_gate: NORTH_EAST }, result: hdg("070") },
  { match: { runway: R13, configuration: ["overflow_4r"], aircraft: ["jet"], exit_gate: NORTH_EAST }, result: hdg("090") },
  { match: { runway: R13, configuration: ["overflow_4r"], exit_gate: ["*"] }, result: hdg("110") },

  { match: { runway: R13, exit_gate: ["southwest"] }, result: hdg("185") },
  { match: { runway: R13, exit_gate: ["water_shipp_wavey"] }, result: hdg("170") },
  { match: { runway: R13, exit_gate: ["water_bette_hapie"] }, result: hdg("155") },
  { match: { runway: R13, aircraft: ["jet"], exit_gate: NORTH_EAST }, result: hdg("110") },
  { match: { runway: R13, aircraft: ["prop"], exit_gate: NORTH_EAST }, result: hdg("090") },

  { match: { sid: ["jfk"], runway: ["22L", "22R"], configuration: ["overnight"] }, result: { climb_id: "gateway", instruction: "GATEWAY CLIMB", clearance_segment: "Gateway Climb" } },
  { match: { sid: ["jfk"], runway: R31, exit_gate: ["southwest"] }, result: { climb_id: "breezy", instruction: "BREEZY POINT CLIMB", clearance_segment: "Breezy Point Climb" } },
  {
    match: { sid: ["jfk"], runway: R31, aircraft: ["prop"], configuration: ["lga_loc31"], exit_gate: ["*"] },
    result: { climb_id: "canarsie", instruction: "CANARSIE CLIMB", clearance_segment: "Canarsie Climb", warning: "Idlewild is prohibited while LGA is landing LOC 31; Canarsie is selected." },
  },
  { match: { sid: ["jfk"], runway: R31, aircraft: ["prop"], exit_gate: ["*"] }, result: { climb_id: "idlewild", instruction: "IDLEWILD CLIMB", clearance_segment: "Idlewild Climb" } },
  { match: { sid: ["jfk"], runway: R31, aircraft: ["jet"], exit_gate: ["*"] }, result: { climb_id: "canarsie", instruction: "CANARSIE CLIMB", clearance_segment: "Canarsie Climb" } },
  { match: { runway: ["*"] }, result: { climb_id: "none", instruction: "No separate climb assignment", clearance_segment: "" } },
];

const ALTITUDE: readonly JfkRule<string>[] = [
  { match: { sid: ["skorr"], climb_id: ["*"] }, result: "CLIMB VIA SID" },
  { match: { sid: ["deezz"], runway: R31, climb_id: ["*"] }, result: "CLIMB VIA SID" },
  { match: { sid: ["jfk"], climb_id: ["breezy", "canarsie"] }, result: "CLIMB VIA SID" },
  { match: { climb_id: ["idlewild"] }, result: "MAINTAIN 2000" },
  { match: { sid: ["*"], climb_id: ["*"] }, result: "MAINTAIN 5000" },
];

const IFR_FREQUENCY = "135.900 (guide only; coordinate coverage)";

// ---------- VFR rules ----------

interface Vfr { instruction: string; altitude: string; frequency: string; clearance: string }

/** Out of the Bravo, no flight following. */
function outOfBravo(instruction: string, via: string): Vfr {
  return {
    instruction,
    altitude: "VFR AT OR BELOW 1400",
    frequency: "125.250 (or controller covering CBA)",
    clearance: `Cleared out of the New York Bravo Airspace via ${via}, maintain VFR at or below 1400, departure frequency [FREQ], squawk [CODE].`,
  };
}

/** Through the Bravo with flight following. */
function throughBravo(instruction: string, via: string): Vfr {
  return {
    instruction,
    altitude: "MAINTAIN 2000",
    frequency: "135.900 (coordinate coverage)",
    clearance: `Cleared through the New York Bravo Airspace via ${via}, maintain 2000, departure frequency [FREQ], squawk [CODE].`,
  };
}

const NOT_AUTHORIZED = "NOT AUTHORIZED BY THIS PROFILE";

const VFR: readonly JfkRule<Vfr>[] = [
  {
    match: { flight_following: ["no"], aircraft: ["jet"], runway: ["*"] },
    result: { instruction: NOT_AUTHORIZED, altitude: "-", frequency: "-", clearance: "No-flight-following profile is props only. Coordinate another clearance." },
  },
  { match: { flight_following: ["no"], runway: ["04L", "04R"] }, result: outOfBravo("RIGHT HDG 180", "right heading 180") },
  { match: { flight_following: ["no"], runway: ["22L", "22R"] }, result: outOfBravo("FLY RUNWAY HEADING", "runway heading") },
  { match: { flight_following: ["no"], runway: R13 }, result: outOfBravo("RIGHT HDG 180", "right heading 180") },
  { match: { flight_following: ["no"], runway: R31 }, result: outOfBravo("LEFT HDG 170", "left heading 170") },
  { match: { flight_following: ["yes"], runway: ["04L", "04R"] }, result: throughBravo("RIGHT HDG 100", "right heading 100") },
  { match: { flight_following: ["yes"], runway: ["22L", "22R"] }, result: throughBravo("FLY RUNWAY HEADING", "runway heading") },
  { match: { flight_following: ["yes"], runway: R13, exit_gate: ["southwest"] }, result: throughBravo("RIGHT HDG 185", "right heading 185") },
  { match: { flight_following: ["yes"], runway: R13, aircraft: ["jet"] }, result: throughBravo("LEFT HDG 110", "left heading 110") },
  { match: { flight_following: ["yes"], runway: R13, aircraft: ["prop"] }, result: throughBravo("LEFT HDG 090", "left heading 090") },
  { match: { flight_following: ["yes"], runway: R31, exit_gate: ["southwest"] }, result: throughBravo("LEFT HDG 220", "left heading 220") },
  { match: { flight_following: ["yes"], runway: R31, configuration: ["lga_loc31"] }, result: throughBravo("LEFT HDG 170", "left heading 170") },
  { match: { flight_following: ["yes"], runway: R31, aircraft: ["jet"] }, result: throughBravo("LEFT HDG 170", "left heading 170") },
  { match: { flight_following: ["yes"], runway: R31, aircraft: ["prop"] }, result: throughBravo("RIGHT HDG 090", "right heading 090") },
];

const EMPTY_VFR: Vfr = { instruction: "", altitude: "", frequency: "", clearance: "" };

// ---------- Airport ----------

export const kjfk: Airport = {
  id: "kjfk",
  code: "KJFK",
  name: "Kennedy",
  subtitle: "IFR and VFR departures from JFK.",
  source: { document: "NYARTCC JFK SOP", revision: "Rev. 30", revised: "2026-07-08", url: "https://wiki.nyartcc.org/wiki/JFK_SOP" },

  fields: (values) => (values.operation === "vfr_departure" ? VFR_FIELDS : IFR_FIELDS),

  resolve(values) {
    const exit = values.exit ?? "";
    const gate = EXIT_GATE.get(exit) ?? "";
    const runway = values.runway ?? "";
    const context: Record<string, string | undefined> = { ...values, exit_gate: gate };

    if (values.operation === "vfr_departure") {
      const vfr = firstMatch(VFR, context, EMPTY_VFR);
      const refused = vfr.instruction === NOT_AUTHORIZED;
      const squawk = values.squawk ?? "";
      const clearance = vfr.clearance
        .replace("[FREQ]", vfr.frequency ? spokenFrequency(vfr.frequency) : "-")
        .replace("[CODE]", field.squawk.pattern.test(squawk) ? squawk : "[CODE]");
      return {
        instruction: vfr.instruction,
        procedure: `VFR DEPARTURE · ${exit} / ${gate.replace(/_/g, " ").toUpperCase()}`,
        altitude: vfr.altitude,
        frequency: vfr.frequency,
        runway,
        clearance,
        warning: refused ? vfr.clearance : DEFAULT_WARNING.vfr,
        severity: refused ? "stop" : "info",
      };
    }

    const procedure = firstMatch(PROCEDURE, context, PROCEDURE[PROCEDURE.length - 1]!.result);
    context.sid = procedure.sid;
    const climb = firstMatch(CLIMB, context, CLIMB[CLIMB.length - 1]!.result);
    context.climb_id = climb.climb_id;
    const altitude = firstMatch(ALTITUDE, context, "MAINTAIN 5000");
    const segments = [procedure.clearance_segment, climb.clearance_segment, altitude].filter(Boolean).join(", ");
    const warning = climb.warning ?? procedure.warning;

    return {
      instruction: climb.instruction,
      procedure: procedure.sid_label + (procedure.transition ? ` · ${procedure.transition} TRANSITION` : ""),
      altitude,
      frequency: IFR_FREQUENCY,
      runway,
      clearance: `KJFK RWY ${runway} · ${segments} · Departure ${spokenFrequency(IFR_FREQUENCY)}`,
      warning: warning ?? DEFAULT_WARNING.ifr,
      severity: warning ? "caution" : "info",
    };
  },
};

