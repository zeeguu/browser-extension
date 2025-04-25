import React from "react";
import style from "./YellowButton.module.css";

const YellowButton = ({ text, onClick }) => {
  return (
    <button
      // remove this, when we get the style sheets to work
      style={{
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        marginBottom: "20px",
        padding: "10px 20px",
        background: "rgb(255, 187, 84)",
        color: "rgb(25, 118, 210)",
        fontSize: "smaller",
        fontWeight: "bolder",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      }}
      className={style.yellowButton}
      onClick={() => {
        onClick
          ? onClick()
          : console.log(
              `${text} button clicked(no functionallity passed down)`
            );
      }}
    >
      {text}
    </button>
  );
};

export default YellowButton;
