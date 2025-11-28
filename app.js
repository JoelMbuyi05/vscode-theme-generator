// --------------------
// VS Code Theme Generator - app.js
// --------------------

// --- DOM references ---
const editorBackground = document.getElementById("editorBackground");
const editorForeground = document.getElementById("editorForeground");
const keywordColor = document.getElementById("keywordColor");
const stringColor = document.getElementById("stringColor");
const functionColor = document.getElementById("functionColor");
const sidebarBackground = document.getElementById("sidebarBackground");
const sidebarForeground = document.getElementById("sidebarForeground");

const editorPreview = document.getElementById("editor-preview");
const keywordEl = editorPreview.querySelector(".keyword");
const stringEl = editorPreview.querySelector(".string");
const functionEl = editorPreview.querySelector(".function");
const sidebarPreview = document.getElementById("sidebar-preview");

const saveBtn = document.getElementById("saveTheme");
const loadBtn = document.getElementById("loadTheme");
const exportBtn = document.getElementById("exportTheme");
const randomBtn = document.getElementById("randomTheme");
const resetBtn = document.getElementById("resetTheme");
const importInput = document.getElementById("importTheme");
const themeJsonEl = document.getElementById("themeJson");
const savedThemesEl = document.getElementById("savedThemes");
const themeNameInput = document.getElementById("themeName");

// --- Utilities ---
const STORAGE_KEY = "vscode-themes-list"; // store array of themes

function makeThemeObject() {
  return {
    name: themeNameInput.value.trim() || `Theme ${new Date().toISOString().slice(11,19)}`,
    editorBackground: editorBackground.value,
    editorForeground: editorForeground.value,
    keyword: keywordColor.value,
    string: stringColor.value,
    function: functionColor.value,
    sidebarBackground: sidebarBackground.value,
    sidebarForeground: sidebarForeground.value
  };
}

function applyThemeObject(theme) {
  // set inputs
  themeNameInput.value = theme.name || "";
  editorBackground.value = theme.editorBackground;
  editorForeground.value = theme.editorForeground;
  keywordColor.value = theme.keyword;
  stringColor.value = theme.string;
  functionColor.value = theme.function;
  sidebarBackground.value = theme.sidebarBackground;
  sidebarForeground.value = theme.sidebarForeground;
  // apply visually
  applyAllColors();
}

// --- Apply colors to preview ---
function applyAllColors() {
  editorPreview.style.background = editorBackground.value;
  editorPreview.style.color = editorForeground.value;

  // token colors
  if (keywordEl) keywordEl.style.color = keywordColor.value;
  if (stringEl) stringEl.style.color = stringColor.value;
  if (functionEl) functionEl.style.color = functionColor.value;

  // sidebar
  if (sidebarPreview) {
    sidebarPreview.style.background = sidebarBackground.value;
    sidebarPreview.style.color = sidebarForeground.value;
  }

  // update JSON preview
  updateJsonPreview();
}

function updateJsonPreview() {
  const t = makeThemeObject();
  // produce a VS Code-like JSON (simplified)
  const output = {
    name: t.name,
    colors: {
      "editor.background": t.editorBackground,
      "editor.foreground": t.editorForeground,
      "sideBar.background": t.sidebarBackground,
      "sideBar.foreground": t.sidebarForeground
    },
    tokenColors: [
      { scope: ["keyword"], settings: { foreground: t.keyword } },
      { scope: ["string"], settings: { foreground: t.string } },
      { scope: ["entity.name.function"], settings: { foreground: t.function } }
    ]
  };
  themeJsonEl.textContent = JSON.stringify(output, null, 2);
  return output;
}

// --- persist multiple themes (list) ---
function getSavedThemes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function setSavedThemes(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// render saved themes list
function renderSavedThemes() {
  const list = getSavedThemes();
  savedThemesEl.innerHTML = "";
  if (!list.length) {
    savedThemesEl.innerHTML = `<div class="text-gray-500 text-sm">No saved themes</div>`;
    return;
  }

  list.forEach((t, idx) => {
    const item = document.createElement("div");
    item.className = "flex items-center justify-between bg-gray-50 rounded p-2";
    item.innerHTML = `
      <div class="flex items-center gap-3">
        <div style="width:28px;height:28px;border-radius:6px;background:${t.editorBackground};border:1px solid #eee"></div>
        <div class="text-sm">${t.name}</div>
      </div>
      <div class="flex items-center gap-2">
        <button data-load="${idx}" class="px-2 py-1 text-xs bg-blue-600 text-white rounded">Load</button>
        <button data-delete="${idx}" class="px-2 py-1 text-xs bg-red-500 text-white rounded">Delete</button>
      </div>
    `;
    savedThemesEl.appendChild(item);
  });

  // attach handlers (event delegation recommended)
  savedThemesEl.querySelectorAll("[data-load]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(btn.getAttribute("data-load"));
      const list = getSavedThemes();
      const theme = list[idx];
      if (theme) {
        applyThemeObject(theme);
      }
    });
  });

  savedThemesEl.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = Number(btn.getAttribute("data-delete"));
      let list = getSavedThemes();
      list.splice(idx, 1);
      setSavedThemes(list);
      renderSavedThemes();
    });
  });
}

// --- save current theme to list ---
saveBtn.addEventListener("click", () => {
  const theme = makeThemeObject();
  const list = getSavedThemes();
  list.unshift(theme); // newest first
  setSavedThemes(list);
  renderSavedThemes();
  alert("Theme saved to list.");
});

// --- load: choose selected theme via list "Load" buttons ---
// We also keep the "Load Selected" button to load the latest saved if any
loadBtn.addEventListener("click", () => {
  const list = getSavedThemes();
  if (!list.length) return alert("No saved themes to load.");
  applyThemeObject(list[0]); // load most recent by default
});

// --- export theme JSON (download) ---
exportBtn.addEventListener("click", () => {
  const payload = updateJsonPreview(); // returns VS Code-like JSON
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${makeThemeObject().name.replace(/\s+/g,"_")}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// --- import JSON (expects exported format) ---
importInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const obj = JSON.parse(ev.target.result);
      // try to map to our internal format (best-effort)
      const theme = {
        name: obj.name || `Imported ${new Date().toISOString()}`,
        editorBackground: (obj.colors && obj.colors["editor.background"]) || "#1e1e1e",
        editorForeground: (obj.colors && obj.colors["editor.foreground"]) || "#d4d4d4",
        sidebarBackground: (obj.colors && obj.colors["sideBar.background"]) || "#252526",
        sidebarForeground: (obj.colors && obj.colors["sideBar.foreground"]) || "#cccccc",
        keyword: (obj.tokenColors && obj.tokenColors[0] && obj.tokenColors[0].settings.foreground) || "#c586c0",
        string: (obj.tokenColors && obj.tokenColors[1] && obj.tokenColors[1].settings.foreground) || "#ce9178",
        function: (obj.tokenColors && obj.tokenColors[2] && obj.tokenColors[2].settings.foreground) || "#dcdcaa"
      };
      // add to saved list and apply
      const list = getSavedThemes();
      list.unshift(theme);
      setSavedThemes(list);
      renderSavedThemes();
      applyThemeObject(theme);
      alert("Imported and loaded theme.");
    } catch (err) {
      alert("Failed to import: invalid JSON");
    }
  };
  reader.readAsText(file);
  importInput.value = ""; // reset
});

// --- random utility ---
function randomColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
}

randomBtn.addEventListener("click", () => {
  editorBackground.value = randomColor();
  editorForeground.value = randomColor();
  keywordColor.value = randomColor();
  stringColor.value = randomColor();
  functionColor.value = randomColor();
  sidebarBackground.value = randomColor();
  sidebarForeground.value = randomColor();
  applyAllColors();
});

// --- reset to default theme ---
resetBtn.addEventListener("click", () => {
  const defaultTheme = {
    name: "Default",
    editorBackground: "#1e1e1e",
    editorForeground: "#d4d4d4",
    keyword: "#c586c0",
    string: "#ce9178",
    function: "#dcdcaa",
    sidebarBackground: "#252526",
    sidebarForeground: "#cccccc"
  };
  applyThemeObject(defaultTheme);
});

// --- live binding for inputs (update preview as user picks) ---
document.querySelectorAll("#controls input[type=color]").forEach(i => {
  i.addEventListener("input", applyAllColors);
});

// --- load saved themes list at start and auto-load last used theme if any ---
(function init() {
  renderSavedThemes();
  // if there's an autosaved last theme (separate key), load it
  const last = localStorage.getItem("vscode-theme-last");
  if (last) {
    try {
      const theme = JSON.parse(last);
      applyThemeObject(theme);
    } catch(e) { /* ignore */ }
  } else {
    // apply current inputs as preview
    applyAllColors();
  }
})();

// --- save last theme whenever user changes anything (small autosave) ---
document.querySelectorAll("#controls input").forEach(i => {
  i.addEventListener("input", () => {
    const t = makeThemeObject();
    localStorage.setItem("vscode-theme-last", JSON.stringify(t));
  });
});
