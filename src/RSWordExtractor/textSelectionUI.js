export default function textSelectionUI(text, url, documentTitle) {
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
        overlayParagraph.innerHTML = text;
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