# ZNY Departure Director

A small tool for VATSIM tower and delivery controllers in New York. Pick an airport and its configuration, and it shows the SID, takeoff heading or climb, initial altitude, departure frequency and a clearance you can copy.

Covers KJFK (IFR and VFR), KEWR, KLGA and KPHL.

## Using it

- Click the options on the left; the result on the right updates as you go.
- **Copy** puts the clearance on your clipboard. **Link** copies a URL that opens the page with the same selections.
- Your last selections for each airport are remembered in the browser. **Reset** puts an airport back to its defaults.
- Shortcuts: <kbd>1</kbd>–<kbd>4</kbd> switch airport, <kbd>C</kbd> copy the clearance, <kbd>T</kbd> switch theme.
- For a JFK VFR departure you can type the squawk, and it's filled into the clearance.

## Run locally

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

This opens `http://localhost:8765/`. Edits to the code or rules reload the page automatically.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run typecheck` | Checks types without building |
| `npm run build` | Type-checks, then builds the site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder |

## Project layout

```
index.html              Page shell
src/main.ts             Wiring: state, rendering, shortcuts
src/engine.ts           Rule matching and small helpers
src/state.ts            Remembered selections and shareable links
src/types.ts            Shared types
src/airports/*.ts       Rules for each airport
src/ui/*.ts             Form, compass, icons, DOM helpers
src/styles.css          Styles (light and dark themes)
public/                 Files copied as-is (CNAME, favicon)
```

## Rule data

Each airport's rules are a typed TypeScript module in `src/airports/`:

- `kjfk.ts` uses ordered tables: the first matching rule wins, and IFR resolves the SID, then the climb, then the altitude.
- `kewr.ts`, `klga.ts` and `kphl.ts` use a single table where the most specific matching rule wins (more `match` keys beats fewer; on a tie, the later rule wins).

A `match` value of `"*"` matches anything. Because the rules are typed, a misspelled field name or a missing result field is a build error rather than a silent bug.

## Deploying

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages on every push to `main`. In the repository settings, set **Pages → Source** to **GitHub Actions**. The custom domain comes from `public/CNAME`.

## Disclaimer

For VATSIM use only. Always check the current SOP, airport configuration and coordination before you issue a clearance. Procedures are based on [New York ARTCC](https://nyartcc.org) documents.

© 2026 Jurina
