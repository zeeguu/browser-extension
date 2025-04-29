import React from "react";
import { StyledSmallButton } from "../../../JSInjection/Modal/Buttons.styles.js";
//import { StyledButton } from "../../../zeeguu-react/src/components/allButtons.sc.js";

const TextContainer = ({ text, onClick }) => {
  return (
    <div
      style={{
        flex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "white",
        borderRadius: "0px 0px 10px 10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        width: "800px",
        maxHeight: "80vh",
        overflow: "hidden",
        padding: "20px",
        paddingBottom: "10px",
      }}
    >
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          textAlign: "justify",
          margin: "0 20px",
          lineHeight: "1.6",
          fontSize: "18px",
          paddingTop: "10px",
          paddingBottom: "10px",
          color: "black"
        }}
      >
        {text}
      </div>

      <div
        style={{
          marginTop: "10px",
          marginBottom: "0px",
        }}
      >
        <StyledSmallButton onClick={onClick}>Close</StyledSmallButton>
      </div>
    </div>
  );
};

export default TextContainer;
