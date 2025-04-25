import React, { useEffect } from "react";
import SideMenu from "./SideMenu/SideMenu.js";
import TextContainer from "./TextContainer/TextContainer.js";

const TextSelectionUI = ({ selectedText, onClick }) => {
  const overlayStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "1000",
  };

  return (
    <div id="textOverlay" style={overlayStyle}>
      <div>
        <SideMenu />
        <TextContainer text={selectedText} onClick={onClick} />
      </div>
    </div>
  );
};

export default TextSelectionUI;
