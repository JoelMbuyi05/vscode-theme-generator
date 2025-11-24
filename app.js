
//Select DOM Elements

//Inputs
const editorBackground = document.getElementById("editorBackground");
const editorForeground = document.getElementById("editorForeground");
const keywordColor = document.getElementById("keywordColor");
const stringColor = document.getElementById("stringColor");
const functionColor = document.getElementById("functionColor");
const sidebarBackground = document.getElementById("sidebarBackground");
const sidebarForeground = document.getElementById("sidebarForeground");

// Preview elements
const editorPreview = document.getElementById("editor-preview");
const keywordEl = document.querySelector(".keyword");
const stringEl = document.querySelector(".string");
const functionEl = document.querySelector(".function");
const sidebarPreview = document.getElementById("sidebar-preview");

//Buttons
const saveBtn = document.getElementById("saveTheme");
const loadBtn = document.getElementById("loadTheme");


// Apply Colors

function applyAllColors() {
    //Editor area
    editorPreview.style.background = editorBackground.value;
    editorPreview.style.color = editorForeground.value;

    keywordEl.style.color = keywordColor.value;
    stringEl.style.color = stringColor.value;
    functionEl.style.color = functionColor.value;

    //Sidebar
    if (sidebarPreview) {
        sidebarPreview.style.background = sidebarBackground.value;
        sidebarPreview.style.color = sidebarForeground.value;
    }
}

// Live updates

const inputs = document.querySelectorAll("#controls input");

inputs.forEach(input => {
    input.addEventListener("input", applyAllColors);
});

// Save Theme

saveBtn.addEventListener("click", () => {
    
    const theme = {
        editorBackground: editorBackground.value,
        editorForeground: editorForeground.value,
        keyword: keywordColor.value,
        string: stringColor.value,
        function: functionColor.value,
        sidebarBackground: sidebarBackground.value,
        sidebarForeground: sidebarForeground.value
    };

    localStorage.setItem("vscode-theme", JSON.stringify(theme));
    alert("Theme saved!");
});

//Load Theme

loadBtn.addEventListener("click", () => {
    const savedTheme = localStorage.getItem("vscode-theme");

    if (!savedTheme) return alert("No saved theme found!");

    const theme = JSON.parse(savedTheme);

    editorBackground.value = theme.editorBackground;
    editorForeground.value = theme.editorForeground;
    keywordColor.value = theme.keyword;
    stringColor.value = theme.string;
    functionColor.value = theme.function;
    sidebarBackground.value = theme.sidebarBackground;
    sidebarForeground.value = theme.sidebarForeground;

    applyAllColors();
});

// Auto Load theme

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("vscode-theme");

    if (savedTheme) {
        const theme = JSON.parse(savedTheme);

        editorBackground.value = theme.editorBackground;
        editorForeground.value = theme.editorForeground;
        keywordColor.value = theme.keyword;
        stringColor.value = theme.string;
        functionColor.value = theme.function;
        sidebarBackground.value = theme.sidebarBackground;
        sidebarForeground.value = theme.sidebarForeground;

        applyAllColors();
    }
});
