import React, { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SmallOverlay from "./SmallOverlay.js";
import TextSelectionUI from "./TextSelectionUI.js";

// container for the React component
const container = document.createElement("div");
container.id = "react-overlay-container";
document.body.appendChild(container);

const App = () => {
  // Using useState (overlay) to manage overlays
  const [overlay, setOverlay] = useState(null);
  const [isSmallOverlayActive, setIsSmallOverlayActive] = useState(false);
  const [isUIActive, setIsUIActive] = useState(false);

  // Collecting all the info of the selection in one state
  const [selection, setSelection] = useState({
    selectedText: "",
    x: 0,
    y: 0,
    url: null,
    documentTitle: "",
  });

  // remove small overlay when clicked and send selected text to background script
  const handleSmallOverlayClick = (event) => {
    event.stopPropagation(); //?
    setIsSmallOverlayActive(false);
    window.getSelection().removeAllRanges();

    const handleUIClose = () => {
      setOverlay(null);
      setIsUIActive(false);
    };

    // Send selected text, URL and documentTitle to the background script
    chrome.runtime.sendMessage({
      type: "SELECTED_TEXT",
      selectedText: selection.selectedText,
      url: selection.url,
      documentTitle: selection.documentTitle,
    });

    setOverlay(
      <TextSelectionUI
        selectedText={selection.selectedText}
        url={selection.url}
        documentTitle={selection.documentTitle}
        onClick={handleUIClose}
      />
    );
    setIsUIActive(true);
  };

  // useEffect that sets up the eventlistner for mouseup events (runs once on on-mount of the App component)
  useEffect(() => {
    // Function for mouseup event listner
    const handleMouseUp = (event) => {
      if (
        event.target.id === "smallOverlay" ||
        isSmallOverlayActive ||
        isUIActive
      )
        return;

      const text = window.getSelection().toString().trim();
      // showing small overlay, if selected text
      if (text.length > 0) {
        // Setting state values based on the selection
        setSelection({
          selectedText: text,
          x: event.clientX,
          y: event.clientY,
          url: window.location.href,
          documentTitle: document.title,
        });
        setIsSmallOverlayActive(true);
      }
    };

    // Adding event listner
    document.addEventListener("mouseup", handleMouseUp);

    // Cleaning event listener on unmount
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // rendering the overlay when the states are updated.
  useEffect(() => {
    if (
      !isSmallOverlayActive ||
      isUIActive ||
      selection.selectedText.length === 0
    )
      return;

    // removing small overlay when timeout
    const handleTimeout = () => {
      console.log("Overlay timed out");
      setOverlay(null);
      setIsSmallOverlayActive(false);
      window.getSelection().removeAllRanges();
    };

    setOverlay(
      <SmallOverlay
        onClick={handleSmallOverlayClick}
        onTimeout={handleTimeout}
        x={selection.x}
        y={selection.y}
      />
    );
  }, [selection, isSmallOverlayActive]);

  return <>{overlay}</>;
};

// Initialising the App component by rendering it inside the container (allowing use of React)
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  container
);
