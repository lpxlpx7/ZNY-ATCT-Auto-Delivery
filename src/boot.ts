// Imported first by main.ts: sets the theme, styles and page markup before anything else touches the DOM.
import { layout } from "./ui/layout";
import { styles } from "./ui/styles";

function savedTheme(): string | null {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

const saved = savedTheme();
const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.dataset.theme = dark ? "dark" : "light";

const style = document.createElement("style");
style.textContent = styles;
document.head.append(style);

document.body.innerHTML = layout;
