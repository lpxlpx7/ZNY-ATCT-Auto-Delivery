# ZNY Departure Director

A small tool for VATSIM tower and delivery controllers in New York. Pick an airport and its configuration, and it shows the SID, takeoff heading or climb, initial altitude, departure frequency and a clearance you can copy.

Covers KJFK (IFR and VFR), KEWR, KLGA and KPHL.

## Run locally

Double-click `start.bat`. It opens `http://localhost:8765/` in your browser. Keep the window open while you use it and press `Ctrl+C` to stop.

You need the local server because browsers won't load the JSON files from a `file://` page. Nothing else needs installing.

## Rule data

The rules live in plain JSON:

- `data/kjfk/atct-cab.json`
- `data/kewr/departure.json`
- `data/klga/departure.json`
- `data/kphl/departure.json`

Edit a file and refresh the page. There's no build step.

## Disclaimer

For VATSIM use only. Always check the current SOP, airport configuration and coordination before you issue a clearance. Procedures are based on [New York ARTCC](https://nyartcc.org) documents.

© 2026 Jurina
