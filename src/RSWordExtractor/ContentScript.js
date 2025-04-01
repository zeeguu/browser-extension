let selectedText = "";
let isOverlayActive = false;
//debugging log:
console.log("isoverlayactive" + isOverlayActive);
document.addEventListener("mouseup", (event) => {
    // Check if overlay is already active
    if (isOverlayActive) return;

    let selection = window.getSelection();
    // Get the selected text:
    selectedText = selection.toString();
    //Get selected anchorNode:
    let selectedNode = selection.anchorNode;
    //Get parent element of selected text:
    let parentElement = selectedNode?.parentElement || null;
    //Get URL:
    let url = window.location.href;
    if (selectedText.length > 0) {
        //debugging log:
        console.log("Selected text:", selectedText);
        console.log("Selected anchorNode:", selectedNode);
        console.log("Parent element:", parentElement);
        console.log("URL:", url);
        // small overlay:
        showSmallOverlay(event.clientX, event.clientY, selectedText);
        //sending to background script:
        chrome.runtime.sendMessage({
            selectedText: selectedText,
            url: url,
            anchorNode: selectedNode,
            parentElement: parentElement
        });
        //clearing selection
        selection.removeAllRanges();
    }
});


// Function to show a small overlay when double-clicking a word:
function showSmallOverlay(x, y, selectedText) {
    // Remove any existing small overlay
    const existingSmallOverlay = document.getElementById("smallOverlay");
    if (existingSmallOverlay) existingSmallOverlay.remove();
    //escape 'mouseup' event:
    isOverlayActive = true;
    //debugging log:
    console.log("isoverlayactive" + isOverlayActive);

    // Create a small overlay
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
    smallOverlay.src = chrome.runtime.getURL("/images/gold-elephant16.png");

    // Append the small overlay to the body
    document.body.appendChild(smallOverlay);

    // Saved in variable to be able to clear it onClick:
    let timeoutId = setTimeout(() => {
        if (smallOverlay) {
            smallOverlay.remove();
            isOverlayActive = false;
            // Debugging log:
            console.log("isoverlayactive(timeout) " + isOverlayActive);
        }
    }, 3000);

    //onClick
    smallOverlay.addEventListener("click", () => {
        showOverlay(selectedText);
        smallOverlay.remove();
        clearTimeout(timeoutId); // Clear the timeout to prevent it from running
    });
}

// Function to create and show the overlay
function showOverlay(paragraph) {
    // Check if overlay already exists
    if (!document.getElementById("textOverlay")) {
        // escape 'mouseup' event:
        isOverlayActive = true;
        //debugging log:
        console.log("isoverlayactive" + isOverlayActive);
        // Create overlay element
        let overlay = document.createElement("div");
        overlay.id = "textOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";

        // Create popup box
        let popup = document.createElement("div");
        popup.style.background = "white";
        popup.style.padding = "20px";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
        popup.style.textAlign = "center";
        popup.style.width = "50%";

        // Create paragraph text
        let overlayParagraph = document.createElement("p");
        overlayParagraph.innerHTML = paragraph;
        overlayParagraph.style.color = "black";

        // Create close button
        let closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.style.marginTop = "10px";
        closeBtn.style.padding = "5px 10px";
        closeBtn.style.background = "orange";
        closeBtn.style.color = "white";
        closeBtn.style.border = "none";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.borderRadius = "5px";
        closeBtn.addEventListener("click", () => {
            overlay.remove();
            isOverlayActive = false;
            //debugging log:
            console.log("isoverlayactive" + isOverlayActive);
        });

        // Append elements
        popup.appendChild(overlayParagraph);
        popup.appendChild(closeBtn);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }
}
