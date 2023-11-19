import styled from "styled-components";
import colors from "../JSInjection/colors";

export const PopUp = styled.div`
  font-weight: 600;
  display: flex;
  background-color: ${colors.lighterBlue} !important;
  flex-direction: column;
  border: none;
  padding: 10px;
  width: 230px;
  height: auto;
  min-height: 120px;
  border-radius: 10px;
  position: relative;
  marign: 50px;

  /* Triangle on the top */
  &:before {
    content: "";
    position: absolute;
    top: -5px; 
    left: calc(95% - 15px); 
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px; 
    border-color: transparent transparent ${colors.lighterBlue} transparent;
  }
`;


export const BottomButton = styled.div`
  cursor: pointer;
  color: ${colors.darkBlue};
  font-weight: 500;
  position: relative;
  bottom: -0.4em;
  font-size: 1em !important;
  font-weight: 600 !important;
  :hover {
    color: ${colors.hoverBlue} !important;
  }
`;

export const NotifyButton = styled.button`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  font-family: "Montserrat";
  cursor: pointer;
  color: ${colors.darkBlue};
  font-weight: 600 !important;
  :hover {
    color: ${colors.hoverBlue} !important;
  }
  font-size: 1em !important;

  //Small
  ${(props) =>
    props.disabled &&
    css`
      cursor: text;
      pointer-events: none;
      text-decoration: underline;
      color: ${colors.black} !important;
    `}
`;

export const HeadingContainer = styled.div`
  img {
    width: 15%;
  }
  display: flex;
  justify-content: center;
  margin: 10px;
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
`;

export const MiddleContainer = styled.div`
  margin-bottom: 1.4em;
  h1 {
    margin-block-start: 0.5em !important;
    margin-block-end: 0.5em !important;
    font-size: 1rem !important;
    font-weight: 600 !important;
    text-align: center;
  }
  p {
    margin-block-start: 0em !important;
    margin-block-end: 0em !important;
    font-weight: normal;
    font-size: 1.2em !important;
  }
`;
