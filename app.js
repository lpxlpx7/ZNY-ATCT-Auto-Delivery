(function () {
  "use strict";

  var airports = [
    { id: "kjfk", code: "KJFK", name: "Kennedy", path: "data/kjfk/atct-cab.json" },
    { id: "kewr", code: "KEWR", name: "Newark", path: "data/kewr/departure.json" },
    { id: "klga", code: "KLGA", name: "LaGuardia", path: "data/klga/departure.json" },
    { id: "kphl", code: "KPHL", name: "Philadelphia", path: "data/kphl/departure.json" }
  ];
  var profiles = {};
  var currentAirport = "kjfk";
  var form = document.getElementById("configForm");

  function text(id, value) { document.getElementById(id).textContent = value || "—"; }
  function optionList(items) { return items.map(function (item) { return '<option value="' + item.id + '">' + item.label + "</option>"; }).join(""); }
  function clock() { text("clock", new Date().toISOString().slice(11, 19) + "Z"); }
  clock(); setInterval(clock, 1000);

  function buildTabs() {
    document.getElementById("airportTabs").innerHTML = airports.map(function (airport) {
      return '<button class="airport-tab' + (airport.id === currentAirport ? " active" : "") + '" data-airport="' + airport.id + '"><b>' + airport.code + "</b><small>" + airport.name + "</small></button>";
    }).join("");
  }

  function fieldHtml(input, index) {
    return '<div class="field"><label for="field-' + input.id + '">' + input.label + "<span>0" + (index + 1) + '</span></label><div class="select-wrap"><select id="field-' + input.id + '" name="' + input.id + '">' + optionList(input.options) + "</select></div></div>";
  }

  function jfkInputs(profile) {
    var options = profile.options;
    var operation = form.elements.operation ? form.elements.operation.value : "ifr_departure";
    var list = [
      { id: "operation", label: "飞行规则", options: options.operation },
      { id: "runway", label: "起飞跑道", options: options.runway },
      { id: "aircraft", label: "机型类别", options: options.aircraft }
    ];
    if (operation === "ifr_departure") {
      list.push({ id: "configuration", label: "机场运行构型", options: options.configuration });
      list.push({ id: "navigation", label: "导航能力", options: options.navigation });
      list.push({ id: "route_group", label: "航路类别", options: options.route_group });
    } else {
      list.push({ id: "flight_following", label: "飞行跟踪", options: [{ id: "yes", label: "需要 Flight Following" }, { id: "no", label: "不需要（仅螺旋桨飞机）" }] });
      list.push({ id: "configuration", label: "机场运行构型", options: options.configuration });
    }
    list.push({ id: "exit", label: "离场出口", options: options.exit });
    return list;
  }

  function renderForm(preserve) {
    var profile = profiles[currentAirport];
    if (!profile) return;
    var inputs = currentAirport === "kjfk" ? jfkInputs(profile) : profile.inputs;
    form.innerHTML = inputs.map(fieldHtml).join("");
    inputs.forEach(function (input) {
      var element = form.elements[input.id];
      if (preserve && preserve[input.id] && Array.prototype.some.call(element.options, function (o) { return o.value === preserve[input.id]; })) element.value = preserve[input.id];
      else if (input.default) element.value = input.default;
    });
    form.onchange = function (event) {
      if (currentAirport === "kjfk" && event.target.name === "operation") {
        var values = valuesOfForm();
        renderForm(values);
      }
      calculate();
    };
    calculate();
  }

  function valuesOfForm() {
    var values = {};
    Array.prototype.forEach.call(form.elements, function (element) { if (element.name) values[element.name] = element.value; });
    return values;
  }

  function matches(match, context) {
    return Object.keys(match).every(function (key) {
      var allowed = match[key];
      return allowed.indexOf("*") !== -1 || allowed.indexOf(context[key]) !== -1;
    });
  }

  function firstResult(rules, context) {
    for (var i = 0; i < rules.length; i++) if (matches(rules[i].match, context)) return rules[i].result;
    return {};
  }

  function mostSpecificResult(rules, context) {
    var selected = {};
    var bestScore = -1;
    rules.forEach(function (rule) {
      if (!matches(rule.match, context)) return;
      var score = Object.keys(rule.match).length;
      if (score >= bestScore) {
        selected = rule.result;
        bestScore = score;
      }
    });
    return selected;
  }

  function genericResult(profile, values) {
    var result = Object.assign({}, profile.defaults);
    var matched = mostSpecificResult(profile.rules, values);
    Object.assign(result, matched);
    var fieldIds = profile.output_fields.map(function (field) { return field.id; });
    var procedure = result.sid || result.procedure || "Published procedure";
    var instruction = result.heading || result.instruction || result.climb || "Coordinate instructions";
    var summary = [profile.profile.facility, "RWY " + values.runway, procedure, instruction, result.altitude, result.departure].filter(Boolean).join(" · ");
    return { instruction: instruction, procedure: procedure, altitude: result.altitude, frequency: result.departure, warning: result.warning, summary: summary, fieldIds: fieldIds };
  }

  function jfkResult(profile, values) {
    var gate = "";
    profile.exits.some(function (item) { if (item.id === values.exit) { gate = item.gate; return true; } return false; });
    values.exit_gate = gate;
    if (values.operation === "vfr_departure") {
      var vfr = firstResult(profile.rules.vfr_departure, values);
      return {
        instruction: vfr.instruction,
        procedure: "VFR DEPARTURE · " + values.exit + " / " + gate.replace(/_/g, " ").toUpperCase(),
        altitude: vfr.altitude,
        frequency: vfr.frequency,
        warning: vfr.instruction && vfr.instruction.indexOf("NOT AUTHORIZED") >= 0 ? vfr.clearance : "VFR 指令为决策辅助；发布前核对空域、代码和管制席位。",
        summary: (vfr.clearance || "").replace("[FREQ]", vfr.frequency || "-")
      };
    }
    var procedure = firstResult(profile.rules.ifr_procedure, values);
    values.sid = procedure.sid;
    var climb = firstResult(profile.rules.ifr_climb, values);
    values.climb_id = climb.climb_id;
    var altitude = firstResult(profile.rules.ifr_altitude, values);
    var departure = firstResult(profile.rules.departure_frequency, values);
    var segments = [procedure.clearance_segment, climb.clearance_segment, altitude.phraseology].filter(Boolean).join(", ");
    return {
      instruction: climb.instruction,
      procedure: procedure.sid_label + (procedure.transition ? " · " + procedure.transition + " TRANSITION" : ""),
      altitude: altitude.phraseology,
      frequency: departure.frequency,
      warning: climb.warning || procedure.warning || "Check PRD, exit eligibility, runway configuration, and active coordination requirements.",
      summary: "KJFK RWY " + values.runway + " · " + segments + " · Departure " + departure.frequency
    };
  }

  function headingFrom(instruction, runway) {
    var match = String(instruction || "").match(/(?:HDG|HEADING)\s*(\d{2,3})/i);
    if (match) return Number(match[1]);
    if (/RUNWAY HEADING/i.test(instruction || "")) return Number(String(runway).slice(0, 2)) * 10;
    return Number(String(runway || "0").slice(0, 2)) * 10;
  }

  function calculate() {
    var profile = profiles[currentAirport];
    if (!profile) return;
    var values = valuesOfForm();
    var result = currentAirport === "kjfk" ? jfkResult(profile, values) : genericResult(profile, values);
    text("primaryInstruction", result.instruction);
    text("procedureText", result.procedure);
    text("altitudeText", result.altitude);
    text("frequencyText", result.frequency);
    text("runwayText", values.runway);
    text("clearanceText", result.summary);
    text("warningText", result.warning);
    var heading = headingFrom(result.instruction, values.runway);
    document.getElementById("headingLine").style.transform = "rotate(" + heading + "deg)";
    text("primaryLabel", /HDG|HEADING|CLIMB/i.test(result.instruction || "") ? "TAKEOFF HEADING / CLIMB" : "TAKEOFF INSTRUCTION");
  }

  function selectAirport(id) {
    currentAirport = id;
    buildTabs();
    var profile = profiles[id];
    text("facilityBadge", profile.profile.facility);
    text("profileSubtitle", profile.profile.subtitle);
    text("sourceName", profile.source.document);
    text("sourceMeta", profile.source.revision + " · REVISED " + profile.source.revised);
    renderForm();
  }

  document.getElementById("airportTabs").addEventListener("click", function (event) {
    var button = event.target.closest("button[data-airport]");
    if (button) selectAirport(button.dataset.airport);
  });

  document.getElementById("copyButton").addEventListener("click", function () {
    var value = document.getElementById("clearanceText").textContent;
    navigator.clipboard.writeText(value).then(function () {
      var toast = document.getElementById("toast"); toast.classList.add("show"); setTimeout(function () { toast.classList.remove("show"); }, 1600);
    });
  });

  Promise.all(airports.map(function (airport) {
    return fetch(airport.path).then(function (response) {
      if (!response.ok) throw new Error("Cannot load " + airport.path);
      return response.json();
    }).then(function (data) { profiles[airport.id] = data; });
  })).then(function () {
    buildTabs(); selectAirport(currentAirport);
  }).catch(function (error) {
    text("profileSubtitle", "规则数据读取失败，请通过 start.bat 启动页面。");
    text("warningText", error.message);
    document.querySelector(".status").style.color = "#f3bf62";
  });
}());
