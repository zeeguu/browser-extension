import React, { useState } from "react";
import ToolbarButtons from "../../../JSInjection/Modal/ToolbarButtons.js";
import {
  StyledSmallButton,
  StyledCloseButton,
} from "../../../JSInjection/Modal/Buttons.styles.js";
import { BROWSER_API } from "../../../utils/browserApi.js";
import colors from "../../../JSInjection/colors.js";
import { StyledHeading } from "../../../JSInjection/Modal/Modal.styles.js";
import * as s from "../../../JSInjection/Modal/Modal.sc";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import styled from "styled-components";

//const [isHovered, setIsHovered] = useState(false);

const Navbar = ({ onClick }) => {
  const CustomizedStyledHeading = styled(StyledHeading)`
    padding: 5px 20px 10px 30px;
    border-radius: 10px 10px 0px 0px;
  `;

  const CustomizedTopElementsContainer = styled(s.TopElementsContainer)`
    border-radius: 10px 10px 0px 0px;
  `;

  const CustomizedZeeguuRowFlexStart = styled(s.ZeeguuRowFlexStart)`
    margin-top: 20px;
  `;

  return (
    <CustomizedStyledHeading>
      <CustomizedTopElementsContainer>
        <CustomizedZeeguuRowFlexStart>
          <StyledSmallButton>
            <a href="https://www.zeeguu.org">
              <img
                src={BROWSER_API.runtime.getURL("images/zeeguu48.png")}
                alt={"Zeeguu logo"}
                className="logoModal"
              />
            </a>{" "}
            <br />
            <span>Home</span>
          </StyledSmallButton>
        </CustomizedZeeguuRowFlexStart>

        <s.ZeeguuRowFlexStart>
          <ToolbarButtons />
          <StyledCloseButton role="button" onClick={onClick} id="qtClose">
            <CloseSharpIcon sx={{ color: colors.gray }} />
          </StyledCloseButton>
        </s.ZeeguuRowFlexStart>
      </CustomizedTopElementsContainer>
    </CustomizedStyledHeading>
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
