(function applyStoredTheme() {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var config = script.dataset;
  var palette = (config.accentPalette || "").split(",").filter(Boolean);
  var defaultAccent = config.defaultAccent || "#54b9a6";
  var theme = config.defaultTheme === "light" ? "light" : "dark";
  var accent = defaultAccent;

  try {
    var storedTheme = localStorage.getItem(config.themeStorageKey || "");
    if (storedTheme === "light" || storedTheme === "dark") theme = storedTheme;
    var storedAccent = (localStorage.getItem(config.accentStorageKey || "") || "").toLowerCase();
    if (palette.indexOf(storedAccent) >= 0) accent = storedAccent;
    else if (storedAccent) localStorage.removeItem(config.accentStorageKey || "");
  } catch {}

  var page = theme === "dark" ? "#0a0a0a" : "#ffffff";
  var ink = theme === "dark" ? "#ffffff" : "#0a0a0a";
  var minimumContrast = Number(config.accentContrast || "6");

  function rgb(hex) {
    return [1, 3, 5].map(function channel(index) {
      return parseInt(hex.slice(index, index + 2), 16);
    });
  }

  function luminance(hex) {
    var channels = rgb(hex).map(function normalize(value) {
      value /= 255;
      return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  function contrast(left, right) {
    var a = luminance(left);
    var b = luminance(right);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  }

  function mix(left, right, amount) {
    var a = rgb(left);
    var b = rgb(right);
    return "#" + a.map(function mixed(value, index) {
      return Math.round(value + (b[index] - value) * amount).toString(16).padStart(2, "0");
    }).join("");
  }

  var accentText = ink;
  for (var step = 0; step <= 20; step += 1) {
    var candidate = mix(accent, ink, step / 20);
    if (contrast(candidate, page) >= minimumContrast) {
      accentText = candidate;
      break;
    }
  }

  var onAccent = contrast("#0a0a0a", accent) >= 4.5
    ? "#0a0a0a"
    : contrast("#ffffff", accent) >= 4.5
      ? "#ffffff"
      : contrast("#000000", accent) >= contrast("#ffffff", accent)
        ? "#000000"
        : "#ffffff";

  var root = document.documentElement;
  root.dataset.theme = theme;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-text", accentText);
  root.style.setProperty("--on-accent", onAccent);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", page);
})();
