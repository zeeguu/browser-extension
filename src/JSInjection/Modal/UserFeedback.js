import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import { useState } from "react";
import sendFeedbackEmail from "./sendFeedbackEmail";
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import colors from "../colors";

export default function UserFeedback({ api, articleId, url }) {
  const [feedback, setFeedback] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const setModalIsOpenToTrue = () => {
    if (feedback === "") {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
      setModalIsOpen(true);
    }
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  function handleChange(e) {
    setFeedback(e.target.value);
    if (feedback !== "") {
      setIsEmpty(false);
    }
  }

  function submitFeedback(e) {
    e.preventDefault();
    if (!isEmpty) {
      sendFeedbackEmail(api, feedback, url, articleId, "PROBLEM_")
      resetInput(e);
    }
  }

  function resetInput(e){
    e.target.value = "";
    setFeedback(e.target.value);
  }

  return (
      <Accordion style={{ boxShadow: "none"}}>
        <AccordionSummary
          sx={{ justifyContent:'space-evenly', backgroundColor: `${colors.lighterBlue}`, color: `${colors.black}`, borderBottom: ".5px solid white", borderTopLeftRadius: '0.2rem', borderTopRightRadius: '0.2rem'}}
          expandIcon={<ExpandMoreIcon sx={{ color: `${colors.black}`, fontSize: '0.9rem' }}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ fontWeight: '200', fontSize: '0.9rem' }}>Report problems</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form fullWidth style={{ display: 'flex', alignContent: 'center', padding: '0.5rem'}} onSubmit={submitFeedback}>
                  <TextField id="outlined-multiline-flexible"
                  label="Feedback"
                  multiline
                  maxRows={3} 
                  value={feedback} 
                  onChange={handleChange}
                  defaultValue="Small"
                  margin="normal"
                  size="small" />
                  <IconButton  type="submit" value="Send feedback" onClick={setModalIsOpenToTrue} id="feedback-box" aria-label="send"> <SendIcon sx={{ color: `${colors.darkBlue}`, fontSize:"medium" }}/></IconButton>
          </form>
        </AccordionDetails>
      </Accordion> 
  );
}