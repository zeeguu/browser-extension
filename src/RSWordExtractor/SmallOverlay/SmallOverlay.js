import React from "react";
import { useEffect } from "react";
import colors from "../../JSInjection/colors";

const SmallOverlay = ({ onClick, onTimeout, x, y }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimeout();
    }, 3000);

    return () => clearTimeout(timer);
    // Jeg er ikke sikker på, at vi bliver nødt til at have onTimeout her ?!!
  }, [onTimeout]);

  const style = {
    position: "absolute",
    top: `${y + window.scrollY}px`,
    left: `${x + window.scrollX}px`,
    background: colors.white,
    padding: "5px 10px",
    borderRadius: "10px",
    border: "1px solid orange",
    cursor: "pointer",
    zIndex: "1000",
  };

  return (
    <img
      id="smallOverlay"
      src={chrome.runtime.getURL("/images/zeeguu16.png")}
      style={style}
      onClick={onClick}
      alt="Small Overlay"
    />
  );
};

export default SmallOverlay;

// import React from "react";
// import { useEffect } from "react";
// import { StyledSmallOverlay } from "./SmallOverlay.sc.js";

// const SmallOverlay = ({ onClick, onTimeout, x, y }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onTimeout();
//     }, 3000);

//     return () => clearTimeout(timer);
//     // Jeg er ikke sikker på, at vi bliver nødt til at have onTimeout her ?!!
//   }, [onTimeout]);

//   return (
//     <StyledSmallOverlay x={x} y={y}>
//       {" "}
//       <img
//         id="smallOverlay"
//         src={chrome.runtime.getURL("images/zeeguu16.png")}
//         style={style}
//         onClick={onClick}
//         alt="Small Overlay"
//       />
//     </StyledSmallOverlay>
//   );
// };

// export default SmallOverlay;
