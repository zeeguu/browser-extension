import React, { useState } from "react";
import ToolbarButtons from "../../../JSInjection/Modal/ToolbarButtons.js";

import {
  StyledSmallButton,
  StyledCloseButton,
} from "../../../JSInjection/Modal/Buttons.styles.js";

import { BROWSER_API } from "../../../utils/browserApi.js";
import colors from "../../../JSInjection/colors.js";
import { StyledHeading } from "../../../JSInjection/Modal/Modal.styles.js"; // "./Modal.styles";
//import { StyledModal, StyledHeading } from "./Modal.styles";

import * as s from "../../../JSInjection/Modal/Modal.sc";
//import * as s from "./Modal.sc";

import CloseSharpIcon from "@mui/icons-material/CloseSharp";

//"../colors";

// import colors from "../../../JSInjection/colors.js";
// import { white } from "../../../zeeguu-react/src/components/colors.js";

//const [isHovered, setIsHovered] = useState(false);

const Navbar = (onClick) => {
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
          <StyledCloseButton role="button" onClick={onClick} id="qtClose">
            <CloseSharpIcon sx={{ color: colors.gray }} />
          </StyledCloseButton>
        </s.ZeeguuRowFlexStart>
      </s.TopElementsContainer>
    </StyledHeading>
  );
  //   <div
  //     //inline for now
  //     style={{
  //       display: "flex",
  //       flexDirection: "row",
  //       alignItems: "flex-start",
  //       background: "rgba(255, 255, 255)",
  //       boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  //       padding: "20px",
  //       paddingBottom: "0px",
  //       borderTopLeftRadius: "8px",
  //       borderTopRightRadius: "8px",
  //       minWidth: "200px",
  //       justifyContent: "space-between",
  //     }}
  //   >
  //     <div>
  //       <StyledSmallButton>
  //         <a href="https://www.zeeguu.org">
  //           <img
  //             src={BROWSER_API.runtime.getURL("images/zeeguu32.png")}
  //             alt={"Zeeguu logo"}
  //             className="logoModal"
  //           />
  //         </a>{" "}
  //         <br />
  //         <span>Home</span>
  //       </StyledSmallButton>
  //     </div>
  //     <div>
  //       <ToolbarButtons />
  //     </div>
  //   </div>
  // );
};

export default Navbar;
