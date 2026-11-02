/** Collapses comments and whitespace so the injected stylesheet stays small. */
function css(strings: TemplateStringsArray): string {
  return strings.raw.join("").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").trim();
}

/** All page styles, light and dark themes included. */
export const styles = css`
/* ---------- Tokens ---------- */
:root {
  color-scheme: light;
  --bg: #f3f5f8;
  --surface: #ffffff;
  --surface-2: #f4f6f9;
  --ink: #0e1726;
  --muted: #5b6676;
  --faint: #8a94a3;
  --line: #e3e7ed;
  --line-strong: #cfd6e0;
  --accent: #1463ff;
  --accent-hover: #0b52e0;
  --accent-soft: rgba(20, 99, 255, .1);
  --on-accent: #ffffff;
  --glass: rgba(243, 245, 248, .78);
  --shadow: 0 1px 2px rgba(14, 23, 38, .04), 0 8px 28px rgba(14, 23, 38, .06);

  /* The result panel is a dark "scope" in both themes. */
  --scope-bg: radial-gradient(120% 90% at 0% 0%, #13213a 0%, #0b1322 55%, #080e19 100%);
  --scope-ink: #e9f0fb;
  --scope-muted: #8fa0ba;
  --scope-line: rgba(150, 175, 215, .16);
  --scope-panel: rgba(255, 255, 255, .045);
  --scope-accent: #4ff0c0;
  --caution: #ffb547;
  --stop: #ff6b6b;

  --radius: 20px;
  --radius-sm: 12px;
  --ease: cubic-bezier(.2, .8, .2, 1);
  --sans: system-ui, -apple-system, "Segoe UI", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace;
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0b0f17;
  --surface: #121925;
  --surface-2: #182131;
  --ink: #e6ebf3;
  --muted: #98a3b5;
  --faint: #6c788b;
  --line: #222c3c;
  --line-strong: #2e3a4e;
  --accent: #5b93ff;
  --accent-hover: #7aa8ff;
  --accent-soft: rgba(91, 147, 255, .16);
  --on-accent: #08101f;
  --glass: rgba(11, 15, 23, .78);
  --shadow: 0 0 0 1px rgba(255, 255, 255, .04);
  --scope-bg: radial-gradient(120% 90% at 0% 0%, #10203a 0%, #080f1c 60%, #060a12 100%);
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
body {
  margin: 0;
  min-width: 320px;
  overflow-x: clip;
  background: var(--bg);
  color: var(--ink);
  font: 15px/1.5 var(--sans);
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}
h1, h2, p { margin: 0; }
a { color: inherit; text-decoration: none; }
button, input { font: inherit; color: inherit; }
button { cursor: pointer; }
::selection { background: var(--accent-soft); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.icon { width: 1em; height: 1em; flex: none; display: block; }
.shell { width: min(1180px, 100% - 32px); margin-inline: auto; }

.skip-link { position: absolute; left: 16px; top: -48px; z-index: 50; padding: 8px 14px; border-radius: 10px; background: var(--accent); color: var(--on-accent); font-weight: 600; }
.skip-link:focus { top: 8px; }

kbd { display: inline-block; min-width: 1.6em; padding: 1px 5px; border: 1px solid var(--line-strong); border-bottom-width: 2px; border-radius: 6px; background: var(--surface); font: 600 11px/1.4 var(--mono); text-align: center; }

/* ---------- Top bar ---------- */
.topbar {
  position: sticky; top: 0; z-index: 30;
  background: var(--glass);
  border-bottom: 1px solid var(--line);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  backdrop-filter: saturate(180%) blur(16px);
}
.topbar-inner { height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.brand-mark { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--accent); color: var(--on-accent); font-size: 20px; }
.brand-text { display: grid; line-height: 1.15; min-width: 0; }
.brand-text b { font-size: 15px; font-weight: 700; letter-spacing: -.01em; white-space: nowrap; }
.brand-text small { color: var(--muted); font-size: 12px; white-space: nowrap; }
.topbar-tools { display: flex; align-items: center; gap: 8px; }
.clock { padding: 6px 10px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--muted); font: 600 12px/1 var(--mono); font-variant-numeric: tabular-nums; letter-spacing: .02em; }
.icon-button { width: 36px; height: 36px; padding: 0; border: 1px solid var(--line); border-radius: 50%; display: grid; place-items: center; background: var(--surface); color: var(--muted); font-size: 16px; transition: color .2s, border-color .2s; }
.icon-button:hover { color: var(--ink); border-color: var(--line-strong); }

/* ---------- Airport tabs ---------- */
main { padding-top: 24px; }
.airport-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); box-shadow: var(--shadow); }
.airport-tab { position: relative; min-width: 0; padding: 10px 14px; border: 0; border-radius: 12px; background: transparent; text-align: left; transition: background-color .2s; }
.airport-tab:hover { background: var(--surface-2); }
.airport-tab[aria-pressed="true"] { background: var(--accent); color: var(--on-accent); }
.airport-tab b { display: block; font: 700 17px/1.2 var(--mono); letter-spacing: .02em; }
.airport-tab small { display: block; overflow: hidden; color: var(--muted); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.airport-tab[aria-pressed="true"] small { color: inherit; opacity: .8; }

/* ---------- Workspace ---------- */
.workspace { margin-top: 16px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr); gap: 16px; align-items: start; }
.card { padding: 24px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); }
.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.card-head h1 { font-size: 20px; font-weight: 700; letter-spacing: -.015em; }
.card-sub { margin-top: 4px; color: var(--muted); font-size: 13px; }
.ghost-button { flex: none; display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--line); border-radius: 999px; background: transparent; color: var(--muted); font-size: 12px; font-weight: 600; transition: color .2s, border-color .2s; }
.ghost-button:hover { color: var(--ink); border-color: var(--line-strong); }

/* ---------- Form ---------- */
.config-form { display: grid; gap: 18px; }
.field { min-width: 0; margin: 0; padding: 0; border: 0; }
.field-label { display: block; margin-bottom: 8px; padding: 0; color: var(--muted); font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
.field-hint { display: block; margin-top: 6px; color: var(--faint); font-size: 12px; }

.choices { display: flex; flex-wrap: wrap; gap: 6px; }
.choices[data-columns] { display: grid; grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); }
.choices[data-columns="2"] { --cols: 2; }
.choices[data-columns="4"] { --cols: 4; }
.choices[data-columns="6"] { --cols: 6; }

.choice { position: relative; display: block; min-width: 0; }
.choice input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
.choice span {
  display: flex; align-items: center; justify-content: center; height: 100%; min-height: 40px;
  padding: 8px 12px; border: 1px solid var(--line); border-radius: var(--radius-sm);
  background: var(--surface-2); color: var(--ink); font-size: 14px; font-weight: 500; line-height: 1.25; text-align: center;
  transition: background-color .15s, border-color .15s, color .15s, box-shadow .15s;
  pointer-events: none;
}
.choice:hover span { border-color: var(--line-strong); }
.choice input:checked + span { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); font-weight: 650; box-shadow: inset 0 0 0 1px var(--accent); }
.choice input:focus-visible + span { outline: 2px solid var(--accent); outline-offset: 2px; }
.field[data-field="runway"] .choice span, .field[data-field="exit"] .choice span { font-family: var(--mono); font-weight: 600; letter-spacing: .02em; }
.field[data-field="exit"] .choice span { min-width: 72px; }

.choice-group { display: grid; grid-template-columns: 112px 1fr; align-items: start; gap: 10px; padding: 8px 0; border-top: 1px dashed var(--line); }
.choice-group:first-of-type { border-top: 0; padding-top: 0; }
.choice-group-label { padding-top: 10px; color: var(--faint); font-size: 12px; font-weight: 600; }

.text-input { width: 100%; max-width: 180px; height: 42px; padding: 0 14px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--surface-2); font: 600 16px var(--mono); letter-spacing: .12em; transition: border-color .15s, box-shadow .15s; }
.text-input::placeholder { color: var(--faint); font-weight: 400; letter-spacing: 0; font-family: var(--sans); font-size: 14px; }
.text-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
.text-input:not(:placeholder-shown):invalid { border-color: var(--stop); }

.source { display: grid; gap: 2px; margin-top: 22px; padding: 14px 16px; border-radius: var(--radius-sm); background: var(--surface-2); transition: background-color .2s; }
.source:hover { background: var(--accent-soft); }
.source-label { color: var(--faint); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.source strong { font-size: 14px; }
.source small { color: var(--muted); font-size: 12px; }

/* ---------- Scope (result) ---------- */
.scope {
  position: sticky; top: 76px;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--scope-bg);
  color: var(--scope-ink);
  box-shadow: 0 18px 48px rgba(6, 12, 24, .28), inset 0 0 0 1px rgba(255, 255, 255, .06);
  scroll-margin-top: 76px;
}
.scope-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.scope-head h2 { font-size: 13px; font-weight: 600; color: var(--scope-muted); letter-spacing: .06em; text-transform: uppercase; }
.scope-head h2 span { color: var(--scope-accent); font-family: var(--mono); }
.scope-tag { padding: 5px 10px; border: 1px solid var(--scope-line); border-radius: 999px; background: var(--scope-panel); font: 600 12px/1.3 var(--mono); letter-spacing: .02em; }

.scope-main { display: grid; grid-template-columns: 188px minmax(0, 1fr); align-items: center; gap: 24px; padding: 22px 0; }
.readout-label { color: var(--scope-muted); font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
.readout-value { display: block; margin-top: 6px; font-size: clamp(24px, 2.6vw, 34px); font-weight: 750; line-height: 1.12; letter-spacing: -.02em; text-wrap: balance; overflow-wrap: anywhere; }
.scope[data-severity="stop"] .readout-value { color: var(--stop); }

/* Compass */
.compass { display: block; width: 100%; height: auto; overflow: visible; }
.compass-face { fill: rgba(255, 255, 255, .03); stroke: var(--scope-line); }
.compass-ticks line { stroke: var(--scope-muted); stroke-linecap: round; }
.compass-ticks .minor { stroke-width: 1; opacity: .35; }
.compass-ticks .major { stroke-width: 2; opacity: .8; }
.compass-labels text { fill: var(--scope-muted); font: 700 11px var(--mono); }
.compass-runway, .compass-vector { transform-box: view-box; transform-origin: 100px 100px; transition: transform .7s var(--ease); }
.compass-runway rect { fill: rgba(255, 255, 255, .1); stroke: rgba(255, 255, 255, .22); }
.compass-runway .centerline { stroke: rgba(255, 255, 255, .45); stroke-width: 1; stroke-dasharray: 5 5; }
.compass-vector line { stroke: var(--scope-accent); stroke-width: 3; stroke-linecap: round; }
.compass-vector path { fill: var(--scope-accent); }
.compass-vector { filter: drop-shadow(0 0 6px rgba(79, 240, 192, .55)); }
.compass-vector.is-runway { opacity: .45; filter: none; }
.compass-vector.is-runway line { stroke-dasharray: 4 5; }
.compass-hub { fill: var(--scope-ink); }

.metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin: 0; overflow: hidden; border-radius: 14px; background: var(--scope-line); }
.metric { min-width: 0; padding: 14px 16px; background: #0d1626; }
[data-theme="dark"] .metric { background: #0a121f; }
.metric dt { color: var(--scope-muted); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.metric dd { margin: 4px 0 0; font: 600 15px/1.35 var(--mono); overflow-wrap: anywhere; }
.metric dd small { display: block; margin-top: 2px; color: var(--scope-muted); font: 500 11px/1.35 var(--sans); }

.clearance { margin-top: 12px; padding: 14px 16px 16px; border: 1px solid var(--scope-line); border-radius: 14px; background: var(--scope-panel); }
.clearance-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--scope-muted); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.clearance-actions { display: flex; gap: 6px; }
.clearance-text { margin-top: 10px; font: 500 14px/1.65 var(--mono); overflow-wrap: anywhere; user-select: all; }
.pill-button { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border: 0; border-radius: 999px; background: var(--scope-accent); color: #04261b; font-size: 12px; font-weight: 700; letter-spacing: 0; text-transform: none; transition: filter .2s, transform .15s var(--ease); }
.pill-button:hover { filter: brightness(1.08); }
.pill-button:active { transform: scale(.96); }
.pill-button.subtle { border: 1px solid var(--scope-line); background: transparent; color: var(--scope-ink); }
.pill-button.done { background: #b9f7e3; }

.notice { display: flex; align-items: flex-start; gap: 10px; margin-top: 12px; padding: 12px 14px; border-radius: 12px; color: var(--scope-muted); font-size: 13px; line-height: 1.5; }
.notice-icon { padding-top: 2px; font-size: 16px; }
.notice[data-severity="caution"] { background: rgba(255, 181, 71, .12); color: #ffd28f; }
.notice[data-severity="caution"] .notice-icon { color: var(--caution); }
.notice[data-severity="stop"] { background: rgba(255, 107, 107, .14); color: #ffb3b3; }
.notice[data-severity="stop"] .notice-icon { color: var(--stop); }

.shortcuts { margin-top: 16px; color: var(--faint); font-size: 12px; text-align: center; }

/* ---------- Mobile dock ---------- */
.dock {
  position: fixed; z-index: 35; left: 12px; right: 12px; bottom: max(12px, env(safe-area-inset-bottom));
  display: grid; gap: 2px; padding: 12px 16px; border: 0; border-radius: 16px;
  background: #0b1322; color: var(--scope-ink); text-align: left;
  box-shadow: 0 12px 32px rgba(6, 12, 24, .35), inset 0 0 0 1px rgba(255, 255, 255, .08);
  animation: dock-in .3s var(--ease);
}
.dock[hidden] { display: none; }
.dock-main { overflow: hidden; color: var(--scope-accent); font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
.dock-sub { overflow: hidden; color: var(--scope-muted); font: 500 12px var(--mono); text-overflow: ellipsis; white-space: nowrap; }
@keyframes dock-in { from { opacity: 0; transform: translateY(12px); } }

/* ---------- Footer & toast ---------- */
.footer { display: flex; justify-content: space-between; gap: 8px 24px; flex-wrap: wrap; margin-top: 40px; padding: 20px 0 max(28px, env(safe-area-inset-bottom)); border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }
.footer-links { display: flex; gap: 16px; }
.footer a:hover { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }

.toast { position: fixed; z-index: 40; left: 50%; bottom: max(24px, env(safe-area-inset-bottom)); padding: 10px 16px; border-radius: 999px; background: var(--ink); color: var(--bg); font-size: 13px; font-weight: 600; box-shadow: 0 8px 24px rgba(0, 0, 0, .2); opacity: 0; pointer-events: none; transform: translate(-50%, 12px); transition: opacity .2s, transform .3s var(--ease); }
.toast.show { opacity: 1; transform: translate(-50%, 0); }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .workspace { grid-template-columns: 1fr; }
  .scope { position: static; }
  .shortcuts { display: none; }
  .footer { padding-bottom: max(96px, env(safe-area-inset-bottom)); }
}
@media (max-width: 600px) {
  .shell { width: calc(100% - 24px); }
  main { padding-top: 12px; }
  .topbar-inner { height: 56px; }
  .brand-text small { display: none; }
  .airport-tab { padding: 8px 4px; text-align: center; }
  .airport-tab b { font-size: 15px; }
  .airport-tab small { font-size: 11px; }
  .card, .scope { padding: 18px 16px; }
  .choices[data-columns="6"] { --cols: 3; }
  .choice-group { grid-template-columns: 1fr; gap: 6px; }
  .choice-group-label { padding-top: 0; }
  .field[data-field="exit"] .choice span { min-width: 64px; }
  .scope-main { grid-template-columns: 1fr; justify-items: center; text-align: center; gap: 16px; }
  .compass-slot { width: 168px; }
  .metrics { grid-template-columns: 1fr; }
  .metric { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .metric dd { margin: 0; text-align: right; }
  .footer { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`;
