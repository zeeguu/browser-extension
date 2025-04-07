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
        showSmallOverlay(event.clientX, event.clientY, selectedText, url);
        selection.removeAllRanges();
    }
});

function showSmallOverlay(x, y, selectedText, url) {
    const smallOverlay = document.createElement("img");
    smallOverlay.id = "smallOverlay";
    smallOverlay.style.position = "absolute";
    smallOverlay.style.top = `${y + window.scrollY}px`;
    smallOverlay.style.left = `${x + window.scrollX}px`;
    smallOverlay.style.cursor = "pointer";
    smallOverlay.style.zIndex = "1000";
    smallOverlay.src = chrome.runtime.getURL("/images/gold-elephant16.png");

    document.body.appendChild(smallOverlay);
    isOverlayActive = true;

    smallOverlay.addEventListener("click", () => {

        // Send selected text and URL to the background script
        chrome.runtime.sendMessage({
            type: "SELECTED_TEXT",
            selectedText: selectedText,
            url: url,
        });

        smallOverlay.remove();
        isOverlayActive = false;
    });
}
