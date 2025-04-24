import textSelectionUI from "../textSelectionUI.js";

export default function createSmallOverlay(x, y, isOverlayActive, selectedText, url, documentTitle) {
    // Remove any existing small overlay
    const existingSmallOverlay = document.getElementById("smallOverlay");
    if (existingSmallOverlay) existingSmallOverlay.remove();

    //Create a new small overlay
    const smallOverlay = document.createElement("img");
    smallOverlay.id = "smallOverlay";
    smallOverlay.style.position = "absolute";
    smallOverlay.style.top = `${y + window.scrollY}px`;
    smallOverlay.style.left = `${x + window.scrollX}px`;
    smallOverlay.style.background = "rgba(255, 255, 255, 0.5)";
    smallOverlay.style.padding = "5px 10px";
    smallOverlay.style.borderRadius = "10px";
    smallOverlay.style.border = "1px solid orange";
    smallOverlay.style.cursor = "pointer";
    smallOverlay.style.zIndex = "1000";
    smallOverlay.src = chrome.runtime.getURL("/images/selection/gold-elephant16.png");

    document.body.appendChild(smallOverlay);
    isOverlayActive = true;
    //Debugging:
    console.log("small overlay");

    // Saved in variable to be able to clear it onClick:
    let timeoutId = setTimeout(() => {
        if (smallOverlay) {
            smallOverlay.remove();
            isOverlayActive = false;
            // Debugging log:
            console.log("isoverlayactive(timeout) " + isOverlayActive);
        }
    }, 3000);

    smallOverlay.addEventListener("click", () => {
        //debugging log:
        console.log("clicked");

        // Send selected text, URL and documentTitle to the background script
        chrome.runtime.sendMessage({
            type: "SELECTED_TEXT",
            selectedText: selectedText,
            url: url,
            documentTitle: documentTitle
        });

        //debugging log:
        console.log("After backgroundscript");

        //Initiating the text UI corresponing to Zeeguu-article UI 
        textSelectionUI(selectedText, url, documentTitle);
        // Debugging log:
        console.log("Selected text:", selectedText);
        console.log("URL:", url);
        console.log("Document title:", documentTitle);

        smallOverlay.remove();
        clearTimeout(timeoutId); // Clear the timeout to prevent it from running
        isOverlayActive = false;


    });

    return isOverlayActive;
}