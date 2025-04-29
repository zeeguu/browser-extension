import React from "react";
import Navbar from "../Navbar/Navbar.js";
import TextContainer from "./TextContainer/TextContainer.js";

const TextSelectionUI = ({ selectedText, onClick }) => {
  // const overlayStyle = {
  //   position: "fixed",
  //   top: "0",
  //   left: "0",
  //   width: "100vw",
  //   height: "100vh",
  //   background: "rgba(0, 0, 0, 0.5)",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   zIndex: "1000",
  // };

  return (
    <div>
      <Navbar />
      <TextContainer text={selectedText} onClick={onClick} />
    </div>
  );
};

export default TextSelectionUI;

// id="textOverlay" style={overlayStyle}
