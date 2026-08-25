export type Theme = "light" | "dark";

/* Bumped again with the palette. v2 recorded choices against a cream
   light default that no longer exists, so a stored "light" from then
   meant "not that dark", not "this white". A first visit and a stale
   visit both land on the new dark default. */
export const THEME_STORAGE_KEY = "botteams-theme-v4";
export const ACCENT_STORAGE_KEY = "botteams-accent";
/* Dark is the site now. Light is the same system inverted, opt-in. */
export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_ACCENT = "#54b9a6";
/* Accent is also the colour of 0.6rem section labels. WCAG AA 4.5:1 is
   the legal floor; stopping there left mint at 4.89 on white, which is
   a thin wash at 9.6px. Six-to-one keeps the hue and reads as text. */
export const ACCENT_TEXT_MIN_CONTRAST = 6;

export const ACCENT_PALETTE = [
  "#54b9a6", "#ff6308", "#e11d48", "#c2410c", "#ea580c", "#ca8a04", "#ffe000", "#65a30d",
  "#4f7a55", "#0e7c7b", "#0891b2", "#0284c7", "#2563eb", "#4f46e5",
  "#7c5cff", "#9333ea", "#c026d3", "#db2777", "#8a2f24", "#b5563c",
  "#92400e", "#b45309", "#a16207", "#9c6644", "#8b5e3c", "#a8845c",
  "#c4a574", "#15150f", "#3d3a36", "#5b554c", "#797064", "#948b7d",
] as const;

const PAGE: Record<Theme, string> = { light: "#ffffff", dark: "#0a0a0a" };
const INK: Record<Theme, string> = { light: "#0a0a0a", dark: "#ffffff" };
const HEX6 = /^#[0-9a-fA-F]{6}$/;

export function normalizeTheme(value: string | null | undefined): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function normalizeStoredAccent(value: string | null | undefined): string | null {
  if (!value || !HEX6.test(value)) return null;
  const normalized = value.toLowerCase();
  return ACCENT_PALETTE.some((color) => color === normalized) ? normalized : null;
}

function rgb(hex: string): [number, number, number] {
  const value = hex.slice(1);
  return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const channels = rgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

function mix(from: string, to: string, amount: number): string {
  const a = rgb(from);
  const b = rgb(to);
  const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * amount);
  return `#${[0, 1, 2].map((i) => channel(i).toString(16).padStart(2, "0")).join("")}`;
}

export function onAccentFor(accent: string): string {
  if (contrastRatio("#0a0a0a", accent) >= 4.5) return "#0a0a0a";
  if (contrastRatio("#ffffff", accent) >= 4.5) return "#ffffff";
  return contrastRatio("#000000", accent) >= contrastRatio("#ffffff", accent) ? "#000000" : "#ffffff";
}

export function accentTextFor(accent: string, theme: Theme): string {
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mix(accent, INK[theme], step / 20);
    if (contrastRatio(candidate, PAGE[theme]) >= ACCENT_TEXT_MIN_CONTRAST) return candidate;
  }
  return INK[theme];
}

export function themeColorFor(theme: Theme): string {
  return PAGE[theme];
}

export function createThemeBootstrapScript(): string {
  const palette = JSON.stringify([...ACCENT_PALETTE]);
  return `(function(){var p=${palette},d="${DEFAULT_ACCENT}",t="${DEFAULT_THEME}",a=d;try{var st=localStorage.getItem("${THEME_STORAGE_KEY}");if(st==="light"||st==="dark")t=st;var sa=(localStorage.getItem("${ACCENT_STORAGE_KEY}")||"").toLowerCase();if(p.indexOf(sa)>=0)a=sa;else if(sa)localStorage.removeItem("${ACCENT_STORAGE_KEY}")}catch(e){}var page=t==="dark"?"#0a0a0a":"#ffffff",ink=t==="dark"?"#ffffff":"#0a0a0a";function rgb(h){return[1,3,5].map(function(i){return parseInt(h.slice(i,i+2),16)})}function lum(h){var c=rgb(h).map(function(v){v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});return.2126*c[0]+.7152*c[1]+.0722*c[2]}function cr(x,y){var X=lum(x),Y=lum(y);return(Math.max(X,Y)+.05)/(Math.min(X,Y)+.05)}function mix(x,y,n){var X=rgb(x),Y=rgb(y);return"#"+X.map(function(v,i){return Math.round(v+(Y[i]-v)*n).toString(16).padStart(2,"0")}).join("")}var at=ink;for(var i=0;i<=20;i++){var q=mix(a,ink,i/20);if(cr(q,page)>=${ACCENT_TEXT_MIN_CONTRAST}){at=q;break}}var on=cr("#0a0a0a",a)>=4.5?"#0a0a0a":cr("#ffffff",a)>=4.5?"#ffffff":cr("#000000",a)>=cr("#ffffff",a)?"#000000":"#ffffff";var root=document.documentElement;root.dataset.theme=t;root.style.setProperty("--accent",a);root.style.setProperty("--accent-text",at);root.style.setProperty("--on-accent",on);var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",page)})();`;
}
