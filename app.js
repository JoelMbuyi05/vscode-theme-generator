
//Select DOM Elements
const editorPreview = document.getElementById("editor-preview");
const keywordEl = document.querySelector(".keyword");
const stringEl = document.querySelector(".string");
const functionEl = document.querySelector(".function");


//Inputs
const editorBackground = document.getElementById("editorBackground");
const editorForeground = document.getElementById("editorForeground");
const keywordColor = document.getElementById("keyword");
const stringColor = document.getElementById("sting");
const functionColor = document.getElementById("functionColor");

// Update Functions

//Editor background
editorBackground.addEventListerner('input', () => {
    editorPreview.style.backgroundColor = editorBackground.value;
});

//Editor text color
editorForeground.addEventListener('input', () => {
    editorPreview.style.color = editorForeground.value;
});

//Keyword color
keywordColor.addEventListener('input', () => {
    keywordEl.style.color = keywordColor.value;
});

//String color
stringColor.addEventListener('input', () => {
    stringEl.style.color = stringColor.value;
});

// Function color
functionColor.addEventListener('input', () => {
    functionEl.style.color = functionColor.value;
});
