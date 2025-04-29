import React from "react";
import { StyledHeading } from "../../../JSInjection/Modal/Modal.styles.js";
import * as s from "../../../JSInjection/Modal/Modal.sc.js";
import {
  StyledCloseButton,
  StyledSmallButton,
} from "../../../JSInjection/Modal/Buttons.styles.js";
import ToolbarButtons from "../../../JSInjection/Modal/ToolbarButtons.js";
import { BROWSER_API } from "../../../utils/browserApi.js";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import colors from "../../../JSInjection/colors.js";

const Navbar = () => {
  return (
    <StyledHeading>
      <s.TopElementsContainer>
        <s.ZeeguuRowFlexStart>
          <StyledSmallButton>
            <a href="https://www.zeeguu.org">
              <img
                src={BROWSER_API.runtime.getURL("images/zeeguuLogo.svg")}
                alt={"Zeeguu logo"}
                className="logoModal"
              />
            </a>{" "}
            <br />
            <span>Home</span>
          </StyledSmallButton>
        </s.ZeeguuRowFlexStart>

        <s.ZeeguuRowFlexStart>
          <ToolbarButtons />
          <StyledCloseButton role="button" onClick={handleClose} id="qtClose">
            <CloseSharpIcon sx={{ color: colors.gray }} />
          </StyledCloseButton>
        </s.ZeeguuRowFlexStart>
      </s.TopElementsContainer>
    </StyledHeading>
  );
};

export default Navbar;

/* 
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
      </div> */

//   <div
//   //inline for now
//   style={{
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "flex-start",
//     background: "rgba(255, 255, 255, 0.9)",
//     boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
//     padding: "20px",
//     paddingBottom: "0px",
//     borderTopLeftRadius: "8px",
//     borderTopRightRadius: "8px",
//     minWidth: "200px",
//     justifyContent: "space-between",
//   }}
//   className={styles.sideMenu}
// > */}
