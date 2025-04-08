export default function createSmallOverlay(selectedText, selection, url, x, y) {
  // Remove any existing small overlay
  const existingSmallOverlay = document.getElementById("smallOverlay");
  if (existingSmallOverlay) existingSmallOverlay.remove();

  //Create a new small overlay
  const smallOverlay = document.createElement("img");
  smallOverlay.id = "smallOverlay";
  smallOverlay.style.position = "absolute";
  smallOverlay.style.top = `${x + window.scrollY}px`;
  smallOverlay.style.left = `${y + window.scrollX}px`;
  smallOverlay.style.background = "rgba(255, 255, 255, 0.5)";
  smallOverlay.style.padding = "5px 10px";
  smallOverlay.style.borderRadius = "10px";
  smallOverlay.style.border = "1px solid orange";
  smallOverlay.style.cursor = "pointer";
  smallOverlay.style.zIndex = "1000";
  smallOverlay.src = chrome.runtime.getURL(
    "/images/selection/gold-elephant16.png"
  );

  document.body.appendChild(smallOverlay);
  isOverlayActive = true;

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
    // Send selected text and URL to the background script
    chrome.runtime.sendMessage({
      type: "SELECTED_TEXT",
      selectedText: selectedText,
      url: url,
    });

    smallOverlay.remove();
    clearTimeout(timeoutId); // Clear the timeout to prevent it from running
    // isOverlayActive = false;
    let selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  });
}
