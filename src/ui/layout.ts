/**
 * Static page markup, laid out like an apple.com store page: global nav, sticky
 * product nav, a sticky "product" panel on the left and the options on the right.
 * Dynamic parts are filled in by main.ts using the ids below.
 */
export const layout = `
  <a class="skip-link" href="#result">Skip to result</a>

  <nav class="globalnav" aria-label="Global">
    <div class="globalnav-inner">
      <a class="globalnav-logo" href="https://nyartcc.org" target="_blank" rel="noopener noreferrer" title="New York ARTCC">
        <img src="/img/nyartcc-logo.png" alt="New York ARTCC" width="22" height="22">
      </a>
      <div class="globalnav-links" id="globalLinks"></div>
      <div class="globalnav-tools">
        <time class="clock" id="clock" title="Current UTC time">--:--:--Z</time>
        <button class="globalnav-button" id="themeButton" type="button" title="Switch theme (T)" aria-label="Switch to dark theme"></button>
      </div>
    </div>
  </nav>

  <nav class="localnav" aria-label="Departure Director">
    <div class="localnav-inner">
      <a class="localnav-title" href="./">Departure Director</a>
      <div class="localnav-actions">
        <span class="localnav-airport" id="localAirport">KJFK</span>
        <button class="pill-button small" id="localCopy" type="button" title="Copy clearance (C)">Copy</button>
      </div>
    </div>
  </nav>

  <main class="page">
    <header class="page-head">
      <h1>Departures, sorted.</h1>
      <p>Pick an airport and its current configuration. Get the SID, heading, initial altitude and frequency.</p>
    </header>

    <div class="buyflow">
      <section class="product" id="result" aria-labelledby="resultTitle" aria-live="polite">
        <div class="product-sticky">
          <p class="product-eyebrow" id="facilityBadge">KJFK</p>
          <h2 class="visually-hidden" id="resultTitle">Departure</h2>

          <div class="compass-slot" id="compassSlot"></div>

          <div class="headline">
            <span id="primaryLabel">Heading / climb</span>
            <strong id="primaryInstruction">—</strong>
            <p id="procedureText">—</p>
          </div>

          <dl class="specs">
            <div><dt>Initial altitude</dt><dd id="altitudeText">—</dd></div>
            <div><dt>Departure</dt><dd id="frequencyText">—</dd></div>
            <div><dt>Runway</dt><dd id="runwayText">—</dd></div>
          </dl>

          <div class="clearance-card">
            <div class="clearance-head">
              <span>Clearance</span>
              <div class="clearance-actions">
                <button class="link-button" id="shareButton" type="button" title="Copy a link to this configuration">Copy link</button>
                <button class="pill-button" id="copyButton" type="button" title="Copy clearance (C)">Copy</button>
              </div>
            </div>
            <p id="clearanceText">—</p>
          </div>

          <div class="notice" id="notice" data-severity="info">
            <span class="notice-icon" id="noticeIcon"></span>
            <p id="warningText">Check the current configuration and SOP before you issue anything.</p>
          </div>
        </div>
      </section>

      <section class="options" aria-labelledby="optionsTitle">
        <h2 class="visually-hidden" id="optionsTitle">Configuration</h2>

        <div class="field">
          <p class="field-label"><b>Airport.</b> <span>Which field are you working?</span></p>
          <div class="airport-cards" id="airportCards"></div>
          <p class="airport-note" id="profileSubtitle">Loading rules…</p>
        </div>

        <form id="configForm" class="config-form" autocomplete="off"></form>

        <div class="options-foot">
          <p>
            Based on <a class="external" id="sourceLink" href="#" target="_blank" rel="noopener noreferrer"><span id="sourceName">—</span></a>,
            <span id="sourceMeta">—</span>.
          </p>
          <button class="link-button" id="resetButton" type="button">Reset to defaults</button>
        </div>
      </section>
    </div>
  </main>

  <button class="dock" id="dock" type="button" aria-label="Jump to the departure result" hidden>
    <span class="dock-main" id="dockInstruction">—</span>
    <span class="dock-sub" id="dockMeta">—</span>
  </button>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footnotes">
        <p>For VATSIM use only. Not for real-world flight. Always check the current SOP, airport configuration and coordination before you issue a clearance.</p>
        <p>Procedures are based on <a class="external" href="https://nyartcc.org" target="_blank" rel="noopener noreferrer">New York ARTCC</a> documents. Shortcuts: 1–4 switch airport, C copies the clearance, T switches the theme.</p>
      </div>
      <div class="breadcrumbs">
        <img src="/img/nyartcc-logo.png" alt="" width="14" height="14">
        <span class="chevron" aria-hidden="true">›</span>
        <span>Departure Director</span>
      </div>
      <div class="legal">
        <p>Copyright © 2026 Jurina. All rights reserved.</p>
        <p class="legal-links">
          <a href="https://github.com/lpxlpx7/ZNY-ATCT-Auto-Delivery" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
          <a href="https://nyartcc.org" target="_blank" rel="noopener noreferrer">nyartcc.org</a>
        </p>
      </div>
    </div>
  </footer>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;
