import {
  StyledSmallButton,
  StyledSmallDisabledButton,
} from "./Buttons.styles";
import {EXTENSION_SOURCE} from "../constants";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import { useState } from "react";

export default function SaveToZeeguu({ api, articleId, setPersonalCopySaved, personalCopySaved}) {

  function handlePostCopy() {
    let article = { article_id: articleId };
    api.makePersonalCopy(article, (message) => console.log(message));
    api.logReaderActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
    setPersonalCopySaved(true);
  }
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {personalCopySaved ? (
        <StyledSmallDisabledButton>
          <BeenhereIcon fontSize="large"/> <br/>
          Saved
        </StyledSmallDisabledButton>
      ) : (
        <StyledSmallButton onClick={handlePostCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
          {isHovered ? <BeenhereIcon fontSize="large"/> : <BeenhereOutlinedIcon fontSize="large"/>} <br/>
          {isHovered ? "Save" : ""}
        </StyledSmallButton>
      )}
    </>
  );
}
