import createSmallOverlay from "./SmallOverlay";

//Debugging  check
console.log("Content script loaded");

let selectedText = "";
let isOverlayActive = false;

document.addEventListener("mouseup", (event) => {
  //Debugginglog
  console.log("Mouse up event triggered.");

  if (isOverlayActive) return;

  let selection = window.getSelection();
  selectedText = selection.toString();
  let url = window.location.href;

  if (selectedText.length > 0) {
    createSmallOverlay(selectedText, selection, url, x, y);
  }
});
