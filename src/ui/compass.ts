const NS = "http://www.w3.org/2000/svg";
const C = 100;

function el<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string | number>, ...children: SVGElement[]): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  node.append(...children);
  return node;
}

function polar(degrees: number, radius: number): [number, number] {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [C + radius * Math.cos(radians), C + radius * Math.sin(radians)];
}

/** Rotates by the shortest way round, so 350° → 010° turns 20° instead of 340°. */
class Rotor {
  private angle: number | null = null;

  constructor(private readonly node: SVGGElement) {}

  set(degrees: number): void {
    if (this.angle === null) {
      this.angle = degrees;
    } else {
      const delta = ((((degrees - this.angle) % 360) + 540) % 360) - 180;
      this.angle += delta;
    }
    this.node.style.transform = `rotate(${this.angle}deg)`;
  }
}

export interface Compass {
  readonly element: SVGSVGElement;
  /** `heading` null means no heading is assigned; the vector then follows the runway. */
  update(runwayHeading: number, heading: number | null): void;
}

export function createCompass(): Compass {
  const ticks = el("g", { class: "compass-ticks" });
  for (let degrees = 0; degrees < 360; degrees += 5) {
    const major = degrees % 30 === 0;
    const [x1, y1] = polar(degrees, major ? 80 : degrees % 10 === 0 ? 84 : 87);
    const [x2, y2] = polar(degrees, 91);
    ticks.append(el("line", { x1, y1, x2, y2, class: major ? "major" : "minor" }));
  }

  const labels = el("g", { class: "compass-labels" });
  for (const [degrees, text] of [[0, "N"], [90, "E"], [180, "S"], [270, "W"]] as const) {
    const [x, y] = polar(degrees, 69);
    const label = el("text", { x, y, "text-anchor": "middle", "dominant-baseline": "central" });
    label.textContent = text;
    labels.append(label);
  }

  const runway = el(
    "g",
    { class: "compass-runway" },
    el("rect", { x: C - 5, y: C - 52, width: 10, height: 104, rx: 2 }),
    el("line", { x1: C, y1: C - 46, x2: C, y2: C + 46, class: "centerline" }),
  );

  const vector = el(
    "g",
    { class: "compass-vector" },
    el("line", { x1: C, y1: C, x2: C, y2: C - 74 }),
    el("path", { d: `M${C} ${C - 86} l-7 13 h14 Z` }),
  );

  const element = el(
    "svg",
    { viewBox: "0 0 200 200", class: "compass", role: "img", "aria-label": "Departure heading" },
    el("circle", { cx: C, cy: C, r: 95, class: "compass-face" }),
    ticks,
    labels,
    runway,
    vector,
    el("circle", { cx: C, cy: C, r: 5, class: "compass-hub" }),
  );

  const runwayRotor = new Rotor(runway);
  const vectorRotor = new Rotor(vector);

  return {
    element,
    update(runwayHeading, heading) {
      runwayRotor.set(runwayHeading);
      vectorRotor.set(heading ?? runwayHeading);
      vector.classList.toggle("is-runway", heading === null);
      element.setAttribute(
        "aria-label",
        heading === null ? `Runway heading ${String(runwayHeading).padStart(3, "0")}, no heading assigned` : `Heading ${String(heading).padStart(3, "0")}`,
      );
    },
  };
}
