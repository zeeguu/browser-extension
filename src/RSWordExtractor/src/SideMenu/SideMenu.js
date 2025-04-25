import React from "react";
import styles from "./SideMenu.module.css";
import MUISwitch from "../toggleSwitch";
import YellowButton from "../YellowButton/YellowButton.js";

const SideMenu = () => {
  return (
    <div
      //inline for now
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        background: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        padding: "20px",
        paddingBottom: "0px",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        minWidth: "200px",
        justifyContent: "space-between",
      }}
      className={styles.sideMenu}
    >
      <div>
        <YellowButton text="Home" />
      </div>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
        }}
      >
        <MUISwitch label="See Translation" />
        <MUISwitch label="Hear Pronunciation" />
      </div>
    </div>
  );
};

export default SideMenu;
