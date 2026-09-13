# ZNY Departure Director

ZNY Departure Director is a local, data-driven departure decision-support web application for KJFK, KEWR, KLGA, and KPHL.

It reads the airport profiles in the `data` directory and presents the applicable departure procedure, takeoff heading or climb instruction, initial altitude, departure frequency, clearance summary, and operational notes.

## Features

- Decision profiles for KJFK, KEWR, KLGA, and KPHL
- IFR and VFR decision support for KJFK
- English, Simplified Chinese, and Japanese interface
- Automatic browser language detection on the first visit
- English fallback for unsupported system languages
- Persistent manual language selection
- Responsive desktop and mobile layout
- Apple-inspired liquid-glass interface
- Local operation with no analytics, uploads, or external application dependencies
- Live rule loading from JSON without a build step

Standard aviation procedure names, headings, climbs, altitudes, and clearance phraseology remain in English to preserve operational meaning.

## Run Locally

Double-click `start.bat` on Windows. The browser will open automatically at:

```text
http://localhost:8765/
```

Keep the terminal window open while using the application. Press `Ctrl+C` in that window to stop the local server.

The site must be served through HTTP because browsers block JSON requests made directly from a `file://` page. Node.js is not required; the included PowerShell server handles the local files.

## Rule Data

The application loads these files at runtime:

- `data/kjfk/atct-cab.json`
- `data/kewr/departure.json`
- `data/klga/departure.json`
- `data/kphl/departure.json`

After editing a JSON profile, refresh the browser to use the updated rules. No rebuild is required.

## Language Selection

On the first visit, the application checks the browser's preferred languages:

- Chinese locales use Simplified Chinese.
- Japanese locales use Japanese.
- English and all unsupported locales use English.

After the user selects a language manually, that choice is stored in the browser and takes priority on future visits.

## Disclaimer

This project is intended only for simulation decision support. Always verify the current SOP, live airport configuration, airspace ownership, departure eligibility, and coordination requirements before use.

Operational source reference: [New York ARTCC](https://nyartcc.org)

## Copyright

Copyright © 2026 Jurina. All rights reserved.
