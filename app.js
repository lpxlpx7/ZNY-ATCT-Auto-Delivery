(function () {
  "use strict";

  var airports = [
    { id: "kjfk", code: "KJFK", name: "Kennedy", path: "data/kjfk/atct-cab.json" },
    { id: "kewr", code: "KEWR", name: "Newark", path: "data/kewr/departure.json" },
    { id: "klga", code: "KLGA", name: "LaGuardia", path: "data/klga/departure.json" },
    { id: "kphl", code: "KPHL", name: "Philadelphia", path: "data/kphl/departure.json" }
  ];

  var messages = {
    defaultWarning: "Check the current configuration and SOP before you issue anything.",
    loadError: "Couldn't load the rule files. If you opened index.html directly, run start.bat instead.",
    revised: "Revised", primaryHeading: "Heading / climb", primaryInstruction: "Instruction",
    field: { operation: "Flight rules", runway: "Departure runway", aircraft: "Aircraft", configuration: "Airport configuration", navigation: "Navigation", route_group: "Route", flight_following: "Flight following", exit: "Exit", landing: "LGA landing runway", gate: "Departure gate", condition: "Condition" },
    option: { ifr_departure: "IFR", vfr_departure: "VFR", jet: "Jet", prop: "Prop / turboprop", normal: "Normal", overnight: "2300–0700 local", overflow_22l: "Overflow 22L", overflow_4r: "Overflow 4R", ils_13l: "ILS 13L in use", lga_loc31: "LGA landing LOC 31", rnav: "RNAV", non_rnav: "Non-RNAV, can fly a SID", unable_sid: "Unable SID / no charts", standard: "Standard", deezz_candr: "DEEZZ via J60/J64/Q480/Q42", deezz_towin: "DEEZZ via J6 (TMU only)", yes: "Requested", no: "Not requested (props only)", north: "North", east: "East", south: "South", west: "West", lga_ils13: "LGA landing ILS 13", portt_request: "Pilot requests RNAV PORTT", ood_ditch_ruuth: "OOD / DITCH / RUUTH", dqo_stoen: "DQO / STOEN", mxe_ptw_fjc_mazie_ard: "MXE / PTW / FJC / MAZIE / ARD" },
    subtitle: { kjfk: "IFR and VFR departures from JFK.", kewr: "SIDs and initial altitudes from the EWR SOP and the current MBI.", klga: "Departures by runway. Runway 13 also needs airspace coordination.", kphl: "Initial altitudes and tower-assigned departure headings." },
    vfrWarning: "Check airspace, squawk and which positions are online before you issue a VFR departure.",
    ifrWarning: "Check the PRD, exit eligibility, runway configuration and any active coordination."
  };

  var profiles = {};
  var currentAirport = "kjfk";
  var form = document.getElementById("configForm");
  var lastResult;

  function t(key) { return messages[key] || key; }
  function text(id, value) { document.getElementById(id).textContent = value || "—"; }
  function labelForOption(item) { return messages.option[item.id] || item.label; }
  function optionList(items) { return items.map(function (item) { return '<option value="' + item.id + '">' + labelForOption(item) + "</option>"; }).join(""); }
  function clock() { text("clock", new Date().toISOString().slice(11, 16) + "Z"); }
  clock(); setInterval(clock, 30000);

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#000000" : "#f5f5f7";
    document.querySelector(".theme-button .icon").className = "icon " + (theme === "dark" ? "icon-sun" : "icon-moon");
  }

  function buildTabs() {
    document.getElementById("airportTabs").innerHTML = airports.map(function (airport) {
      return '<button class="airport-tab' + (airport.id === currentAirport ? " active" : "") + '" data-airport="' + airport.id + '"><b>' + airport.code + "</b><small>" + airport.name + "</small></button>";
    }).join("");
  }

  function fieldHtml(input) {
    var label = messages.field[input.id] || input.label;
    return '<div class="field"><label for="field-' + input.id + '">' + label + '</label><div class="select-wrap"><select id="field-' + input.id + '" name="' + input.id + '">' + optionList(input.options) + "</select></div></div>";
  }

  function jfkInputs(profile) {
    var options = profile.options;
    var operation = form.elements.operation ? form.elements.operation.value : "ifr_departure";
    var list = [{ id: "operation", options: options.operation }, { id: "runway", options: options.runway }, { id: "aircraft", options: options.aircraft }];
    if (operation === "ifr_departure") {
      list.push({ id: "configuration", options: options.configuration }, { id: "navigation", options: options.navigation }, { id: "route_group", options: options.route_group });
    } else {
      list.push({ id: "flight_following", options: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }] }, { id: "configuration", options: options.configuration });
    }
    list.push({ id: "exit", options: options.exit });
    return list;
  }

  function renderForm(preserve) {
    var profile = profiles[currentAirport];
    if (!profile) return;
    var inputs = currentAirport === "kjfk" ? jfkInputs(profile) : profile.inputs;
    form.innerHTML = inputs.map(fieldHtml).join("");
    inputs.forEach(function (input) {
      var element = form.elements[input.id];
      if (preserve && preserve[input.id] && Array.prototype.some.call(element.options, function (option) { return option.value === preserve[input.id]; })) element.value = preserve[input.id];
      else if (input.default) element.value = input.default;
    });
    form.onchange = function (event) {
      if (currentAirport === "kjfk" && event.target.name === "operation") renderForm(valuesOfForm());
      calculate();
    };
    calculate();
  }

  function valuesOfForm() {
    var values = {};
    Array.prototype.forEach.call(form.elements, function (element) { if (element.name) values[element.name] = element.value; });
    return values;
  }

  function matches(match, context) { return Object.keys(match).every(function (key) { return match[key].indexOf("*") !== -1 || match[key].indexOf(context[key]) !== -1; }); }
  function firstResult(rules, context) { for (var i = 0; i < rules.length; i++) if (matches(rules[i].match, context)) return rules[i].result; return {}; }
  function mostSpecificResult(rules, context) {
    var selected = {}, bestScore = -1;
    rules.forEach(function (rule) { var score = Object.keys(rule.match).length; if (matches(rule.match, context) && score >= bestScore) { selected = rule.result; bestScore = score; } });
    return selected;
  }

  function genericResult(profile, values) {
    var result = Object.assign({}, profile.defaults, mostSpecificResult(profile.rules, values));
    var procedure = result.sid || result.procedure || "Published procedure";
    var instruction = result.heading || result.instruction || result.climb || "Coordinate instructions";
    return { instruction: instruction, procedure: procedure, altitude: result.altitude, frequency: result.departure, warning: result.warning || t("defaultWarning"), summary: [profile.profile.facility, "RWY " + values.runway, procedure, instruction, result.altitude, result.departure].filter(Boolean).join(" · ") };
  }

  function jfkResult(profile, values) {
    var gate = "";
    profile.exits.some(function (item) { if (item.id === values.exit) { gate = item.gate; return true; } return false; });
    values.exit_gate = gate;
    if (values.operation === "vfr_departure") {
      var vfr = firstResult(profile.rules.vfr_departure, values);
      return { instruction: vfr.instruction, procedure: "VFR DEPARTURE · " + values.exit + " / " + gate.replace(/_/g, " ").toUpperCase(), altitude: vfr.altitude, frequency: vfr.frequency, warning: vfr.instruction && vfr.instruction.indexOf("NOT AUTHORIZED") >= 0 ? vfr.clearance : t("vfrWarning"), summary: (vfr.clearance || "").replace("[FREQ]", vfr.frequency || "-") };
    }
    var procedure = firstResult(profile.rules.ifr_procedure, values);
    values.sid = procedure.sid;
    var climb = firstResult(profile.rules.ifr_climb, values);
    values.climb_id = climb.climb_id;
    var altitude = firstResult(profile.rules.ifr_altitude, values);
    var departure = firstResult(profile.rules.departure_frequency, values);
    var segments = [procedure.clearance_segment, climb.clearance_segment, altitude.phraseology].filter(Boolean).join(", ");
    return { instruction: climb.instruction, procedure: procedure.sid_label + (procedure.transition ? " · " + procedure.transition + " TRANSITION" : ""), altitude: altitude.phraseology, frequency: departure.frequency, warning: (climb.warning || procedure.warning) || t("ifrWarning"), summary: "KJFK RWY " + values.runway + " · " + segments + " · Departure " + departure.frequency };
  }

  function headingFrom(instruction, runway) {
    var match = String(instruction || "").match(/(?:HDG|HEADING)\s*(\d{2,3})/i);
    if (match) return Number(match[1]);
    return Number(String(runway || "0").slice(0, 2)) * 10;
  }

  function calculate() {
    var profile = profiles[currentAirport];
    if (!profile) return;
    var values = valuesOfForm();
    lastResult = currentAirport === "kjfk" ? jfkResult(profile, values) : genericResult(profile, values);
    text("primaryInstruction", lastResult.instruction); text("procedureText", lastResult.procedure); text("altitudeText", lastResult.altitude); text("frequencyText", lastResult.frequency); text("runwayText", values.runway); text("clearanceText", lastResult.summary); text("warningText", lastResult.warning);
    document.getElementById("headingLine").style.transform = "rotate(" + headingFrom(lastResult.instruction, values.runway) + "deg)";
    text("primaryLabel", /HDG|HEADING|CLIMB/i.test(lastResult.instruction || "") ? t("primaryHeading") : t("primaryInstruction"));
  }

  function updateProfileMeta() {
    var profile = profiles[currentAirport];
    text("facilityBadge", profile.profile.facility); text("profileSubtitle", messages.subtitle[currentAirport] || profile.profile.subtitle); text("sourceName", profile.source.document); text("sourceMeta", profile.source.revision + " · " + t("revised") + " " + profile.source.revised);
  }

  function selectAirport(id) { currentAirport = id; buildTabs(); updateProfileMeta(); renderForm(); }

  document.getElementById("airportTabs").addEventListener("click", function (event) { var button = event.target.closest("button[data-airport]"); if (button) selectAirport(button.dataset.airport); });
  document.querySelector(".theme-button").addEventListener("click", function () {
    var theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", theme); } catch (error) {}
    applyTheme(theme);
  });
  document.getElementById("copyButton").addEventListener("click", function () {
    navigator.clipboard.writeText(document.getElementById("clearanceText").textContent).then(function () { var toast = document.getElementById("toast"); toast.classList.add("show"); setTimeout(function () { toast.classList.remove("show"); }, 1600); });
  });

  applyTheme(document.documentElement.dataset.theme);
  buildTabs();
  Promise.all(airports.map(function (airport) { return fetch(airport.path).then(function (response) { if (!response.ok) throw new Error("Cannot load " + airport.path); return response.json(); }).then(function (data) { profiles[airport.id] = data; }); })).then(function () { selectAirport(currentAirport); }).catch(function (error) { text("profileSubtitle", t("loadError")); text("warningText", error.message); });
}());
