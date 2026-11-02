// Moon, sunny and arrow paths from Ionicons (MIT, see src/ui/LICENSE-ionicons.txt).
// The rest are drawn for this app.

const wrap = (body: string, viewBox = "0 0 24 24"): string =>
  `<svg class="icon" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

const stroke = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const icons = {
  moon: wrap('<path fill="currentColor" d="M264 480A232 232 0 0 1 32 248c0-94 54-178.28 137.61-214.67a16 16 0 0 1 21.06 21.06C181.07 76.43 176 104.66 176 136c0 110.28 89.72 200 200 200 31.34 0 59.57-5.07 81.61-14.67a16 16 0 0 1 21.06 21.06C442.28 426 358 480 264 480"/>', "0 0 512 512"),
  sun: wrap('<path fill="currentColor" d="M256 118a22 22 0 0 1-22-22V48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22M256 486a22 22 0 0 1-22-22v-48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22M369.14 164.86a22 22 0 0 1-15.56-37.55l33.94-33.94a22 22 0 0 1 31.11 31.11l-33.94 33.94a21.93 21.93 0 0 1-15.55 6.44M108.92 425.08a22 22 0 0 1-15.55-37.56l33.94-33.94a22 22 0 1 1 31.11 31.11l-33.94 33.94a21.94 21.94 0 0 1-15.56 6.45M464 278h-48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44M96 278H48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44M403.08 425.08a21.94 21.94 0 0 1-15.56-6.45l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.55 37.56M142.86 164.86a21.9 21.9 0 0 1-15.55-6.44l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.56 37.55M256 358a102 102 0 1 1 102-102 102.12 102.12 0 0 1-102 102"/>', "0 0 512 512"),
  external: wrap('<path fill="none" stroke="currentColor" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" d="m268 112 144 144-144 144M392 256H100"/>', "0 0 512 512"),
  copy: wrap(`<rect x="8" y="8" width="12" height="12" rx="2.5" ${stroke}/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" ${stroke}/>`),
  check: wrap(`<path d="m5 12.5 4.5 4.5L19 7.5" ${stroke}/>`),
  reset: wrap(`<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" ${stroke}/>`),
  link: wrap(`<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" ${stroke}/>`),
  info: wrap(`<circle cx="12" cy="12" r="9" ${stroke}/><path d="M12 11v5M12 7.5v.01" ${stroke}/>`),
  caution: wrap(`<path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" ${stroke}/><path d="M12 9.5v4M12 17v.01" ${stroke}/>`),
  stop: wrap(`<circle cx="12" cy="12" r="9" ${stroke}/><path d="m8.5 8.5 7 7M15.5 8.5l-7 7" ${stroke}/>`),
  logo: wrap(`<circle cx="12" cy="12" r="9.5" ${stroke}/><path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3" ${stroke}/><path d="m12 8 2.5 6.5L12 13l-2.5 1.5Z" fill="currentColor" stroke="none"/>`),
} as const;

export type IconName = keyof typeof icons;
