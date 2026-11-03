/** Collapses comments and whitespace so the injected stylesheet stays small. */
function css(strings: TemplateStringsArray): string {
  return strings.raw.join("").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").trim();
}

/** All page styles, light and dark themes included. Modelled on apple.com store pages. */
export const styles = css`
/* ---------- Fonts ---------- */
@font-face { font-family: "SF Pro Text Local"; src: url("/fonts/SF-Pro-Text-Regular.otf") format("opentype"); font-weight: 400; font-display: swap; }
@font-face { font-family: "SF Pro Text Local"; src: url("/fonts/SF-Pro-Text-Semibold.otf") format("opentype"); font-weight: 600; font-display: swap; }
@font-face { font-family: "SF Pro Display Local"; src: url("/fonts/SF-Pro-Display-Semibold.otf") format("opentype"); font-weight: 600; font-display: swap; }
@font-face { font-family: "SF Pro Display Local"; src: url("/fonts/SF-Pro-Display-Bold.otf") format("opentype"); font-weight: 700; font-display: swap; }

/* ---------- Tokens ---------- */
:root {
  color-scheme: light;
  --page: #fff;
  --panel: #f5f5f7;
  --surface: #fff;
  --ink: #1d1d1f;
  --muted: #6e6e73;
  --faint: #86868b;
  --line: #d2d2d7;
  --tile-border: #86868b;
  --link: #0066cc;
  --button: #0071e3;
  --button-hover: #0077ed;
  --select: #0071e3;
  --amber: #b64400;
  --red: #e30000;
  --globalnav: rgba(250,250,252,.8);
  --globalnav-ink: rgba(0,0,0,.8);
  --localnav: rgba(255,255,255,.72);
  --localnav-line: rgba(0,0,0,.16);
  --footer: #f5f5f7;
  --ease: cubic-bezier(.28,.11,.32,1);
  --width: 1120px;
  --font: "SF Pro Text Local", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
  --display-font: "SF Pro Display Local", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
[data-theme="dark"] {
  color-scheme: dark;
  --page: #000;
  --panel: #161617;
  --surface: #000;
  --ink: #f5f5f7;
  --muted: #a1a1a6;
  --faint: #86868b;
  --line: #424245;
  --tile-border: #6e6e73;
  --link: #2997ff;
  --select: #2997ff;
  --amber: #ffb340;
  --red: #ff6961;
  --globalnav: rgba(22,22,23,.8);
  --globalnav-ink: rgba(255,255,255,.8);
  --localnav: rgba(0,0,0,.72);
  --localnav-line: rgba(255,255,255,.24);
  --footer: #161617;
}

/* ---------- Base ---------- */
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-padding-top: 64px; }
body { margin: 0; min-width: 320px; overflow-x: clip; background: var(--page); color: var(--ink); font-family: var(--font); font-size: 17px; line-height: 1.47059; font-weight: 400; letter-spacing: -.022em; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -webkit-tap-highlight-color: transparent; }
:is(h1, h2, .localnav-title, .headline strong) { font-family: var(--display-font); }
h1, h2, p, dl, dd { margin: 0; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
button, input { font: inherit; color: inherit; letter-spacing: inherit; }
button { cursor: pointer; }
::selection { background: rgba(0,113,227,.2); }
:is(a, button, input):focus-visible { outline: 2px solid var(--select); outline-offset: 3px; }
.icon { display: inline-block; flex: none; width: 1em; height: 1em; vertical-align: -.125em; }
.visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.skip-link { position: absolute; z-index: 50; left: 16px; top: -60px; padding: 8px 16px; border-radius: 980px; background: var(--button); color: #fff; font-size: 14px; }
.skip-link:focus { top: 8px; text-decoration: none; }

/* ---------- Global nav ---------- */
.globalnav {
  position: relative; z-index: 31; height: 44px;
  background: var(--globalnav);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
.globalnav-inner { width: min(1024px, calc(100% - 44px)); height: 100%; margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.globalnav-logo { display: flex; opacity: .9; transition: opacity .3s ease; }
.globalnav-logo:hover { opacity: 1; }
.globalnav-logo img { width: 22px; height: 22px; border-radius: 50%; }
.globalnav-links { flex: 1; display: flex; justify-content: center; gap: 36px; }
.globalnav-link { padding: 0; border: 0; background: none; color: var(--globalnav-ink); font-size: 12px; letter-spacing: -.01em; opacity: .8; transition: opacity .3s ease, color .3s ease; }
.globalnav-link:hover, .globalnav-link[aria-pressed="true"] { opacity: 1; color: var(--ink); }
.globalnav-tools { display: flex; align-items: center; gap: 18px; }
.clock { color: var(--globalnav-ink); font-size: 12px; font-variant-numeric: tabular-nums; letter-spacing: -.01em; }
.globalnav-button { width: 28px; height: 28px; padding: 0; border: 0; border-radius: 50%; display: grid; place-items: center; background: none; color: var(--globalnav-ink); transition: background-color .3s ease; }
.globalnav-button:hover { background: rgba(127,127,127,.14); }
.globalnav-button .icon { width: 15px; height: 15px; }

/* ---------- Local (product) nav ---------- */
.localnav {
  position: sticky; z-index: 30; top: 0; height: 52px;
  background: var(--localnav);
  border-bottom: 1px solid var(--localnav-line);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
.localnav-inner { width: min(1024px, calc(100% - 44px)); height: 100%; margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.localnav-title { color: var(--ink); font-size: 21px; font-weight: 600; letter-spacing: .011em; white-space: nowrap; }
.localnav-title:hover { text-decoration: none; }
.localnav-actions { display: flex; align-items: center; gap: 18px; }
.localnav-airport { color: var(--muted); font-size: 12px; letter-spacing: -.01em; }

/* ---------- Buttons ---------- */
.pill-button { min-width: 64px; min-height: 32px; padding: 0 16px; border: 0; border-radius: 980px; background: var(--button); color: #fff; font-size: 14px; letter-spacing: -.016em; transition: background-color .3s ease; }
.pill-button:hover { background: var(--button-hover); }
.pill-button.small { min-width: 0; min-height: 24px; padding: 0 11px; font-size: 12px; letter-spacing: -.01em; }
.link-button { padding: 0; border: 0; background: none; color: var(--link); font-size: 14px; }
.link-button:hover { text-decoration: underline; }
.link-button::after { content: " ›"; }

/* ---------- Page head ---------- */
.page { width: min(var(--width), calc(100% - 44px)); margin-inline: auto; }
.page-head { padding-block: 52px 36px; }
.page-head h1 { font-size: 48px; font-weight: 600; line-height: 1.08349; letter-spacing: -.003em; }
.page-head p { max-width: 620px; margin-top: 10px; color: var(--muted); font-size: 21px; line-height: 1.381; letter-spacing: .011em; }

/* ---------- Buy flow ---------- */
.buyflow { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 56px; align-items: start; }

/* Left: the "product", kept in view while choosing. The column stretches so the panel has room to stick. */
.product { align-self: stretch; }
.product-sticky { position: sticky; top: 76px; padding: 40px 40px 32px; border-radius: 18px; background: var(--panel); text-align: center; }
.product-eyebrow { color: var(--muted); font-size: 17px; font-weight: 600; }
.compass-slot { width: 232px; margin: 24px auto 28px; border-radius: 50%; background: var(--surface); box-shadow: 0 2px 6px rgba(0,0,0,.04), 0 12px 30px rgba(0,0,0,.08); }
[data-theme="dark"] .compass-slot { box-shadow: 0 0 0 1px rgba(255,255,255,.08); }
.compass { display: block; width: 100%; height: auto; }
.compass-face { fill: none; }
.compass-ticks line { stroke: var(--faint); stroke-linecap: round; }
.compass-ticks .minor { stroke-width: 1; opacity: .4; }
.compass-ticks .major { stroke-width: 1.5; opacity: .8; }
.compass-labels text { fill: var(--muted); font: 600 10px var(--font); }
.compass-runway, .compass-vector { transform-box: view-box; transform-origin: 100px 100px; transition: transform .8s var(--ease); }
.compass-runway rect { fill: var(--panel); stroke: var(--line); }
.compass-runway .centerline { stroke: var(--faint); stroke-width: 1; stroke-dasharray: 4 5; opacity: .7; }
.compass-vector line { stroke: var(--select); stroke-width: 2.5; stroke-linecap: round; }
.compass-vector path { fill: var(--select); }
.compass-vector.is-runway { opacity: .3; }
.compass-hub { fill: var(--ink); }

.headline > span { color: var(--muted); font-size: 12px; letter-spacing: -.01em; }
.headline strong { display: block; max-width: 520px; margin: 4px auto 8px; font-size: 40px; font-weight: 600; line-height: 1.1; letter-spacing: 0; text-wrap: balance; overflow-wrap: anywhere; }
.headline p { color: var(--muted); font-size: 17px; }
.product[data-severity="stop"] .headline strong { color: var(--red); }

.specs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 32px; padding-block: 20px; border-block: 1px solid var(--line); }
.specs > div { min-width: 0; padding-inline: 12px; }
.specs > div + div { border-left: 1px solid var(--line); }
.specs dt { color: var(--muted); font-size: 12px; letter-spacing: -.01em; }
.specs dd { margin-top: 4px; font-size: 17px; font-weight: 600; line-height: 1.3; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.specs dd small { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; font-weight: 400; }

.clearance-card { margin-top: 24px; padding: 20px 22px; border-radius: 18px; background: var(--surface); text-align: left; }
.clearance-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.clearance-head > span { font-size: 14px; font-weight: 600; }
.clearance-actions { display: flex; align-items: center; gap: 18px; }
#clearanceText { margin-top: 10px; font-size: 17px; line-height: 1.5; }

.notice { display: flex; justify-content: center; align-items: flex-start; gap: 6px; margin-top: 18px; color: var(--muted); font-size: 12px; line-height: 1.33337; letter-spacing: -.01em; text-align: left; }
.notice-icon { font-size: 13px; }
.notice[data-severity="caution"] { color: var(--amber); }
.notice[data-severity="stop"] { color: var(--red); }

/* Right: the options. */
.options { display: grid; gap: 44px; padding-bottom: 24px; }
.config-form { display: grid; gap: 44px; }
.field { min-width: 0; margin: 0; padding: 0; border: 0; }
.field-label { display: block; margin: 0 0 14px; padding: 0; font-family: var(--display-font); font-size: 24px; line-height: 1.16667; letter-spacing: .009em; }
.field-label b { font-weight: 600; }
.field-label span { color: var(--faint); font-weight: 600; }
.field-hint { display: block; margin-top: 8px; color: var(--muted); font-size: 12px; }

.airport-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.airport-card { min-height: 76px; padding: 16px 18px; border: 1px solid var(--tile-border); border-radius: 12px; background: var(--surface); display: grid; align-content: center; gap: 2px; text-align: left; transition: border-color .2s ease, box-shadow .2s ease; }
.airport-card b { font-size: 17px; font-weight: 600; }
.airport-card span { color: var(--muted); font-size: 14px; }
.airport-card[aria-pressed="true"] { border-color: var(--select); box-shadow: inset 0 0 0 1px var(--select); }
.airport-note { margin-top: 14px; color: var(--muted); font-size: 14px; line-height: 1.43; }

.choices { display: grid; grid-template-columns: 1fr; gap: 12px; }
.choices[data-columns] { grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr)); }
.choices[data-columns="2"] { --cols: 2; }
.choices[data-columns="4"] { --cols: 4; }
.choices[data-columns="6"] { --cols: 3; }
.field[data-field="exit"] .choices { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }
.choice { position: relative; display: block; min-width: 0; }
.choice input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
.choice span {
  display: flex; align-items: center; height: 100%; min-height: 56px; padding: 12px 18px;
  border: 1px solid var(--tile-border); border-radius: 12px; background: var(--surface);
  font-size: 17px; font-weight: 600; line-height: 1.24; font-variant-numeric: tabular-nums;
  transition: border-color .2s ease, box-shadow .2s ease;
  pointer-events: none;
}
.choices[data-columns] .choice span, .field[data-field="exit"] .choice span { justify-content: center; text-align: center; padding-inline: 8px; }
.choice input:checked + span { border-color: var(--select); box-shadow: inset 0 0 0 1px var(--select); }
.choice input:focus-visible + span { outline: 2px solid var(--select); outline-offset: 3px; }

.choice-group + .choice-group { margin-top: 18px; }
.choice-group-label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 14px; }

.text-input { width: 100%; max-width: 220px; height: 56px; padding: 0 18px; border: 1px solid var(--tile-border); border-radius: 12px; outline: none; background: var(--surface); font-size: 17px; font-variant-numeric: tabular-nums; letter-spacing: .06em; transition: border-color .2s ease, box-shadow .2s ease; }
.text-input::placeholder { color: var(--faint); letter-spacing: -.022em; }
.text-input:focus { border-color: var(--select); box-shadow: inset 0 0 0 1px var(--select); }
.text-input:not(:placeholder-shown):invalid { border-color: var(--red); box-shadow: inset 0 0 0 1px var(--red); }

.options-foot { display: grid; gap: 10px; padding-top: 24px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; line-height: 1.33337; letter-spacing: -.01em; }
.options-foot .link-button { justify-self: start; font-size: 12px; }

/* ---------- Bottom bar on phones ---------- */
.dock {
  position: fixed; z-index: 35; left: 0; right: 0; bottom: 0;
  display: grid; gap: 1px; padding: 12px 22px max(12px, env(safe-area-inset-bottom)); border: 0; border-top: 1px solid var(--localnav-line); text-align: left;
  background: var(--localnav);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
.dock[hidden] { display: none; }
.dock-main { overflow: hidden; font-size: 17px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.dock-sub { overflow: hidden; color: var(--muted); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.dock-sub::after { content: "  ·  See details ›"; color: var(--link); }

/* ---------- Footer ---------- */
.footer { margin-top: 80px; background: var(--footer); color: var(--muted); font-size: 12px; line-height: 1.33337; letter-spacing: -.01em; }
.footer-inner { width: min(980px, calc(100% - 44px)); margin-inline: auto; padding-bottom: max(21px, env(safe-area-inset-bottom)); }
.footnotes { display: grid; gap: 8px; padding-block: 17px 11px; border-bottom: 1px solid var(--line); }
.footer a { color: var(--ink); }
.breadcrumbs { display: flex; align-items: center; gap: 8px; padding-block: 15px 13px; border-bottom: 1px solid var(--line); color: var(--ink); }
.breadcrumbs img { width: 14px; height: 14px; border-radius: 50%; }
.chevron { color: var(--faint); }
.legal { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 24px; padding-top: 14px; }
.legal-links { display: flex; }
.legal-links a { color: var(--muted); }
.legal-links a + a { margin-left: 8px; padding-left: 8px; border-left: 1px solid var(--line); }
.legal-links a:hover { color: var(--ink); }
.external .icon { width: .7em; height: .7em; margin-left: 1px; vertical-align: .02em; transform: rotate(-45deg); }

.toast { position: fixed; z-index: 40; left: 50%; bottom: max(24px, env(safe-area-inset-bottom)); padding: 10px 18px; border-radius: 980px; background: var(--globalnav); box-shadow: 0 0 0 .5px var(--localnav-line), 0 10px 30px rgba(0,0,0,.12); -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px); font-size: 14px; opacity: 0; pointer-events: none; transform: translate(-50%, 16px); transition: opacity .3s ease, transform .5s var(--ease); }
.toast.show { opacity: 1; transform: translate(-50%, 0); }

/* ---------- Responsive ---------- */
@media (max-width: 1068px) {
  .buyflow { gap: 32px; }
  .product-sticky { padding: 32px 24px 28px; }
  .headline strong { font-size: 32px; }
}
@media (max-width: 833px) {
  .globalnav-links { display: none; }
  .buyflow { grid-template-columns: 1fr; gap: 48px; }
  .options { order: -1; }
  .product-sticky { position: static; }
  .page-head { padding-block: 32px 28px; }
  .page-head h1 { font-size: 40px; line-height: 1.1; }
  .page-head p { font-size: 19px; }
  .footer { padding-bottom: 72px; }
}
@media (max-width: 480px) {
  .page, .globalnav-inner, .localnav-inner, .footer-inner { width: calc(100% - 32px); }
  .clock { display: none; }
  .localnav-title { font-size: 19px; }
  .page-head h1 { font-size: 32px; }
  .page-head p { font-size: 17px; }
  .field-label { font-size: 21px; }
  .choices[data-columns="4"] { --cols: 2; }
  .choice span { min-height: 52px; font-size: 15px; }
  .compass-slot { width: 196px; }
  .headline strong { font-size: 28px; }
  .specs { grid-template-columns: 1fr; padding-block: 0; }
  .specs > div { padding: 14px 0; display: flex; justify-content: space-between; align-items: baseline; gap: 16px; text-align: left; }
  .specs > div + div { border-left: 0; border-top: 1px solid var(--line); }
  .specs dd { margin: 0; text-align: right; }
  .legal { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: .01ms !important; }
}
`;
