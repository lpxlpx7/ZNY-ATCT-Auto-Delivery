(function () {
  "use strict";

  var airports = [
    { id: "kjfk", code: "KJFK", names: { zh: "肯尼迪", en: "Kennedy", ja: "ケネディ" }, path: "data/kjfk/atct-cab.json" },
    { id: "kewr", code: "KEWR", names: { zh: "纽瓦克", en: "Newark", ja: "ニューアーク" }, path: "data/kewr/departure.json" },
    { id: "klga", code: "KLGA", names: { zh: "拉瓜迪亚", en: "LaGuardia", ja: "ラガーディア" }, path: "data/klga/departure.json" },
    { id: "kphl", code: "KPHL", names: { zh: "费城", en: "Philadelphia", ja: "フィラデルフィア" }, path: "data/kphl/departure.json" }
  ];

  var messages = {
    zh: {
      online: "规则已载入", overline: "纽约区域管制中心 · 塔台决策辅助", heroTitle: "更清晰地决定<br><strong>下一步怎么飞。</strong>", heroLead: "选择机场和运行配置，即时查看适用的离场程序、起飞航向、初始高度与管制频率。",
      configuration: "运行配置", loading: "正在加载规则数据…", source: "数据来源", result: "起飞方案", live: "实时", altitude: "初始高度", departure: "离场频率", runway: "跑道", summary: "指令摘要", copy: "复制", summaryPlaceholder: "选择配置后将在此生成摘要。", defaultWarning: "请始终核对实时构型、协调要求和有效 SOP。", simulation: "仅供模拟决策辅助", copyright: "© 2026 Jurina。保留所有权利。", sourceReference: "资料来源", copied: "已复制到剪贴板", loadError: "规则数据读取失败，请通过 start.bat 启动页面。", revised: "修订于", primaryHeading: "起飞航向 / 爬升", primaryInstruction: "起飞指令",
      field: { operation: "飞行规则", runway: "起飞跑道", aircraft: "机型类别", configuration: "机场运行构型", navigation: "导航能力", route_group: "航路类别", flight_following: "飞行跟踪", exit: "离场出口", landing: "本场落地跑道", gate: "离场方向", condition: "程序条件" },
      option: { ifr_departure: "IFR 离场", vfr_departure: "VFR 离场", jet: "喷气机 / 涡喷", prop: "螺旋桨 / 涡桨", normal: "正常运行", overnight: "本地时间 23:00–07:00", overflow_22l: "22L 溢出构型", overflow_4r: "4R 溢出构型", ils_13l: "使用 ILS 13L", lga_loc31: "LGA 使用 LOC 31 落地", rnav: "具备 RNAV 能力", non_rnav: "无 RNAV，可执行 SID", unable_sid: "无法执行 SID / 无航图", standard: "标准 / 其他航路", deezz_candr: "DEEZZ：J60/J64/Q480/Q42", deezz_towin: "DEEZZ：J6（仅限 TMU）", yes: "需要 Flight Following", no: "不需要（仅螺旋桨飞机）", north: "北向", east: "东向", south: "南向", west: "西向", lga_ils13: "LGA 使用 ILS 13 落地", portt_request: "飞行员申请 RNAV PORTT", ood_ditch_ruuth: "OOD / DITCH / RUUTH", dqo_stoen: "DQO / STOEN", mxe_ptw_fjc_mazie_ard: "MXE / PTW / FJC / MAZIE / ARD" },
      subtitle: { kjfk: "紧凑的 IFR 与 VFR 离场决策辅助", kewr: "依据 EWR SOP 与现行 MBI 选择核心 SID 和初始高度", klga: "跑道级离场核心；13 跑道的条件空域仍需明确协调", kphl: "PHL 初始高度与塔台强制离场航向" },
      warning: {
        "Check PRD, SAPR, arrival runway restrictions, and nonstandard runway release.": "请核对 PRD、SAPR、到达跑道限制和非标准跑道放行。",
        "Check PRD, exit eligibility, runway configuration, and active MBI.": "请核对 PRD、出口适用性、跑道构型和现行 MBI。",
        "PORTT requires RNAV and a verbal pilot request.": "PORTT 要求航空器具备 RNAV 能力，且飞行员必须口头提出申请。",
        "Apply EWR no-DP heading table and coordinate departure frequency.": "请使用 EWR 无 DP 航向表，并协调离场频率。",
        "Runway 13 requires Belmont/Coney ownership and JFK configuration; do not infer it from runway alone.": "13 跑道需要确认 Belmont/Coney 空域所有权及 JFK 构型，不可仅根据跑道推断。",
        "TOWIN/J6 is TMU only; verify the qualifying destination and TMU direction.": "TOWIN/J6 仅限 TMU 使用，请核对目的地资格和 TMU 指示。",
        "Verify pilot chart capability. If unable to accept a SID, Tower must issue applicable initial instructions with takeoff clearance.": "请确认飞行员的航图能力；如无法接受 SID，塔台必须随起飞许可发布适用的初始指令。",
        "Idlewild is prohibited while LGA is landing LOC 31; Canarsie is selected.": "LGA 使用 LOC 31 落地时禁止 Idlewild，已选择 Canarsie。"
      },
      vfrWarning: "VFR 指令仅供决策辅助；发布前请核对空域、应答机代码和管制席位。", ifrWarning: "请核对 PRD、出口适用性、跑道构型及当前协调要求。"
    },
    en: {
      online: "Rules loaded", overline: "New York ARTCC · Tower decision support", heroTitle: "A clearer way to decide<br><strong>what comes next.</strong>", heroLead: "Choose an airport and operating configuration to see the applicable departure procedure, takeoff heading, initial altitude and frequency.",
      configuration: "Configuration", loading: "Loading rule data…", source: "Data source", result: "Departure plan", live: "Live", altitude: "Initial altitude", departure: "Departure", runway: "Runway", summary: "Clearance summary", copy: "Copy", summaryPlaceholder: "Your summary will appear after selecting a configuration.", defaultWarning: "Always verify the live configuration, coordination requirements and current SOP.", simulation: "For simulation decision support only", copyright: "© 2026 Jurina. All rights reserved.", sourceReference: "Source reference", copied: "Copied to clipboard", loadError: "Rule data could not be loaded. Start the site with start.bat.", revised: "Revised", primaryHeading: "Takeoff heading / climb", primaryInstruction: "Takeoff instruction",
      field: { operation: "Flight rules", runway: "Departure runway", aircraft: "Aircraft", configuration: "Operating configuration", navigation: "Navigation capability", route_group: "Route group", flight_following: "Flight following", exit: "Departure exit", landing: "LGA landing runway", gate: "Departure gate", condition: "Procedure condition" },
      option: { ifr_departure: "IFR departure", vfr_departure: "VFR departure", jet: "Jet / turbojet", prop: "Prop / turboprop", normal: "Normal operations", overnight: "2300–0700 local", overflow_22l: "Overflow 22L", overflow_4r: "Overflow 4R", ils_13l: "ILS 13L in use", lga_loc31: "LGA landing LOC 31", rnav: "RNAV capable", non_rnav: "Non-RNAV; SID capable", unable_sid: "Unable SID / no charts", standard: "Standard / other route", deezz_candr: "DEEZZ: J60/J64/Q480/Q42", deezz_towin: "DEEZZ: J6 (TMU only)", yes: "Flight following required", no: "No flight following (props only)", north: "North", east: "East", south: "South", west: "West", lga_ils13: "LGA landing ILS 13", portt_request: "RNAV PORTT pilot request", ood_ditch_ruuth: "OOD / DITCH / RUUTH", dqo_stoen: "DQO / STOEN", mxe_ptw_fjc_mazie_ard: "MXE / PTW / FJC / MAZIE / ARD" },
      subtitle: { kjfk: "Compact IFR and VFR departure decision support", kewr: "Core SID and initial-altitude selection from the EWR SOP and active MBI", klga: "Runway-level departure core; runway 13 conditional airspace requires explicit coordination", kphl: "PHL initial altitude and mandatory tower departure heading" },
      warning: {},
      vfrWarning: "VFR instructions are decision support only. Verify airspace, squawk code and controller coverage before issue.", ifrWarning: "Check PRD, exit eligibility, runway configuration and active coordination requirements."
    },
    ja: {
      online: "規則を読込済み", overline: "ニューヨーク ARTCC · タワー意思決定支援", heroTitle: "次の飛び方を、<br><strong>もっと明確に。</strong>", heroLead: "空港と運用構成を選択すると、適用される出発方式、離陸方位、初期高度、周波数をすぐに確認できます。",
      configuration: "運用構成", loading: "規則データを読み込み中…", source: "データソース", result: "出発プラン", live: "ライブ", altitude: "初期高度", departure: "出発周波数", runway: "滑走路", summary: "クリアランス概要", copy: "コピー", summaryPlaceholder: "構成を選択すると概要が表示されます。", defaultWarning: "現在の運用構成、調整要件、有効な SOP を必ず確認してください。", simulation: "シミュレーション意思決定支援専用", copyright: "© 2026 Jurina. All rights reserved.", sourceReference: "参照元", copied: "クリップボードにコピーしました", loadError: "規則データを読み込めません。start.bat から起動してください。", revised: "改訂", primaryHeading: "離陸方位 / 上昇", primaryInstruction: "離陸指示",
      field: { operation: "飛行方式", runway: "出発滑走路", aircraft: "機種区分", configuration: "空港運用構成", navigation: "航法能力", route_group: "経路グループ", flight_following: "フライトフォローイング", exit: "出発ゲート", landing: "LGA 到着滑走路", gate: "出発方向", condition: "手順条件" },
      option: { ifr_departure: "IFR 出発", vfr_departure: "VFR 出発", jet: "ジェット / ターボジェット", prop: "プロペラ / ターボプロップ", normal: "通常運用", overnight: "現地時刻 23:00–07:00", overflow_22l: "22L オーバーフロー", overflow_4r: "4R オーバーフロー", ils_13l: "ILS 13L 使用中", lga_loc31: "LGA LOC 31 到着", rnav: "RNAV 対応", non_rnav: "RNAV 非対応・SID 対応", unable_sid: "SID 不可 / チャートなし", standard: "標準 / その他の経路", deezz_candr: "DEEZZ：J60/J64/Q480/Q42", deezz_towin: "DEEZZ：J6（TMU 限定）", yes: "フライトフォローイングあり", no: "なし（プロペラ機のみ）", north: "北", east: "東", south: "南", west: "西", lga_ils13: "LGA ILS 13 到着", portt_request: "RNAV PORTT 要求", ood_ditch_ruuth: "OOD / DITCH / RUUTH", dqo_stoen: "DQO / STOEN", mxe_ptw_fjc_mazie_ard: "MXE / PTW / FJC / MAZIE / ARD" },
      subtitle: { kjfk: "IFR・VFR 出発のコンパクトな意思決定支援", kewr: "EWR SOP と有効な MBI に基づく主要 SID・初期高度の選択", klga: "滑走路別の出発支援。滑走路 13 の条件付き空域は明示的な調整が必要", kphl: "PHL の初期高度とタワー指定の必須出発方位" },
      warning: {
        "Check PRD, SAPR, arrival runway restrictions, and nonstandard runway release.": "PRD、SAPR、到着滑走路の制限、非標準リリースを確認してください。",
        "Check PRD, exit eligibility, runway configuration, and active MBI.": "PRD、出口の適用性、滑走路構成、有効な MBI を確認してください。",
        "PORTT requires RNAV and a verbal pilot request.": "PORTT には RNAV 能力とパイロットからの口頭要求が必要です。",
        "Apply EWR no-DP heading table and coordinate departure frequency.": "EWR の no-DP 方位表を適用し、出発周波数を調整してください。",
        "Runway 13 requires Belmont/Coney ownership and JFK configuration; do not infer it from runway alone.": "滑走路 13 では Belmont/Coney の空域所有と JFK 構成の確認が必要です。滑走路だけで判断しないでください。",
        "TOWIN/J6 is TMU only; verify the qualifying destination and TMU direction.": "TOWIN/J6 は TMU 限定です。対象目的地と TMU の指示を確認してください。",
        "Verify pilot chart capability. If unable to accept a SID, Tower must issue applicable initial instructions with takeoff clearance.": "パイロットのチャート対応能力を確認してください。SID を受けられない場合、タワーは離陸許可とともに初期指示を発出する必要があります。",
        "Idlewild is prohibited while LGA is landing LOC 31; Canarsie is selected.": "LGA が LOC 31 で到着中は Idlewild 禁止のため、Canarsie を選択しました。"
      },
      vfrWarning: "VFR 指示は意思決定支援専用です。発出前に空域、コード、管制席を確認してください。", ifrWarning: "PRD、出口の適用性、滑走路構成、現在の調整要件を確認してください。"
    }
  };

  var profiles = {};
  var currentAirport = "kjfk";
  var language = initialLanguage();
  var form = document.getElementById("configForm");
  var lastResult;

  function initialLanguage() {
    var saved = localStorage.getItem("zny-language");
    if (saved === "zh" || saved === "en" || saved === "ja") return saved;
    var systemLanguages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < systemLanguages.length; i++) {
      var code = systemLanguages[i].toLowerCase();
      if (code.indexOf("zh") === 0) return "zh";
      if (code.indexOf("ja") === 0) return "ja";
      if (code.indexOf("en") === 0) return "en";
    }
    return "en";
  }

  function t(key) { return messages[language][key] || messages.en[key] || key; }
  function localizedWarning(value) { return messages[language].warning[value] || value; }
  function text(id, value) { document.getElementById(id).textContent = value || "—"; }
  function labelForOption(item) { return messages[language].option[item.id] || item.label; }
  function optionList(items) { return items.map(function (item) { return '<option value="' + item.id + '">' + labelForOption(item) + "</option>"; }).join(""); }
  function clock() { text("clock", new Date().toISOString().slice(11, 16) + "Z"); }
  clock(); setInterval(clock, 30000);

  function applyLanguage() {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language === "ja" ? "ja" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var value = t(node.dataset.i18n);
      if (node.dataset.i18n === "heroTitle") node.innerHTML = value;
      else node.textContent = value;
    });
    document.querySelectorAll("[data-language]").forEach(function (button) { button.classList.toggle("active", button.dataset.language === language); });
    buildTabs();
    if (profiles[currentAirport]) {
      var values = valuesOfForm();
      updateProfileMeta();
      renderForm(values);
    }
  }

  function buildTabs() {
    document.getElementById("airportTabs").innerHTML = airports.map(function (airport) {
      return '<button class="airport-tab' + (airport.id === currentAirport ? " active" : "") + '" data-airport="' + airport.id + '"><b>' + airport.code + "</b><small>" + airport.names[language] + "</small></button>";
    }).join("");
  }

  function fieldHtml(input, index) {
    var label = messages[language].field[input.id] || input.label;
    return '<div class="field"><label for="field-' + input.id + '"><span>' + label + "</span><b>" + String(index + 1).padStart(2, "0") + '</b></label><div class="select-wrap"><select id="field-' + input.id + '" name="' + input.id + '">' + optionList(input.options) + "</select></div></div>";
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
    return { instruction: instruction, procedure: procedure, altitude: result.altitude, frequency: result.departure, warning: localizedWarning(result.warning) || t("defaultWarning"), summary: [profile.profile.facility, "RWY " + values.runway, procedure, instruction, result.altitude, result.departure].filter(Boolean).join(" · ") };
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
    return { instruction: climb.instruction, procedure: procedure.sid_label + (procedure.transition ? " · " + procedure.transition + " TRANSITION" : ""), altitude: altitude.phraseology, frequency: departure.frequency, warning: localizedWarning(climb.warning || procedure.warning) || t("ifrWarning"), summary: "KJFK RWY " + values.runway + " · " + segments + " · Departure " + departure.frequency };
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
    text("facilityBadge", profile.profile.facility); text("profileSubtitle", messages[language].subtitle[currentAirport] || profile.profile.subtitle); text("sourceName", profile.source.document); text("sourceMeta", profile.source.revision + " · " + t("revised") + " " + profile.source.revised);
  }

  function selectAirport(id) { currentAirport = id; buildTabs(); updateProfileMeta(); renderForm(); }

  document.getElementById("airportTabs").addEventListener("click", function (event) { var button = event.target.closest("button[data-airport]"); if (button) selectAirport(button.dataset.airport); });
  document.querySelector(".language-switch").addEventListener("click", function (event) { var button = event.target.closest("button[data-language]"); if (!button) return; language = button.dataset.language; localStorage.setItem("zny-language", language); applyLanguage(); });
  document.getElementById("copyButton").addEventListener("click", function () {
    navigator.clipboard.writeText(document.getElementById("clearanceText").textContent).then(function () { var toast = document.getElementById("toast"); toast.classList.add("show"); setTimeout(function () { toast.classList.remove("show"); }, 1600); });
  });

  applyLanguage();
  Promise.all(airports.map(function (airport) { return fetch(airport.path).then(function (response) { if (!response.ok) throw new Error("Cannot load " + airport.path); return response.json(); }).then(function (data) { profiles[airport.id] = data; }); })).then(function () { selectAirport(currentAirport); }).catch(function (error) { text("profileSubtitle", t("loadError")); text("warningText", error.message); });
}());
