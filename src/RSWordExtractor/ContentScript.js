import createSmallOverlay from "./smallOverlay.js";
//Debugging  check
console.log("Content script loaded");

let selectedText = "";
let isOverlayActive = false;

document.addEventListener("mouseup", (event) => {
    //Debugginglog
    console.log("Mouse up event triggered.");

    if (isOverlayActive) return;

    let selection = window.getSelection();
    let url = window.location.href;
    let documentTitle = document.title;

    selectedText = selection.toString();

    if (selectedText.length > 0) {
        createSmallOverlay(event.clientX, event.clientY, isOverlayActive, selectedText, url, documentTitle);
        selection.removeAllRanges();
    }
});

