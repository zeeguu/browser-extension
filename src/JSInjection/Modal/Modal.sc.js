import styled from "styled-components";

const ZeeguuRowFlexStart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;
const TopElementsContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SideElementsContainer = styled.div`
  margin-top: 1rem;
  margin-left: 1 rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  borderTopRightRadius: "8px",
  borderBottomRightRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  
`;

export { ZeeguuRowFlexStart, TopElementsContainer, SideElementsContainer };
