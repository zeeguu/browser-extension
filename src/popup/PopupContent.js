import React, { useState, useEffect } from "react";
import { setCurrentURL } from "./functions";
import sendFeedbackEmail from "../JSInjection/Modal/sendFeedbackEmail";
import { runningInChromeDesktop } from "../zeeguu-react/src/utils/misc/browserDetection";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

export default function PopupContent({
  isReadable,
  languageSupported,
  user,
  tab,
  api,
  sessionId,
}) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const LANGUAGE_FEEDBACK = "I want this language to be supported";
  const READABILITY_FEEDBACK = "I think this article should be readable";

  useEffect(() => {
    if (isReadable && languageSupported) {
      openModal();
    }
  }, [isReadable, languageSupported]);

  const openModal = async () => {
    const executeScriptOptions = {
      target: { tabId: tab.id },
      files: ["./main.js"],
      func: setCurrentURL(tab.url),
    };

    if (runningInChromeDesktop()) {
      chrome.scripting.executeScript(executeScriptOptions);
    } else {
      browser.tabs.executeScript(tab.id, { file: "./main.js" }, setCurrentURL(tab.url));
    }

    window.close();
  };

  const sendFeedbackHandler = (feedback, feedbackType) => {
    api.session = sessionId;
    sendFeedbackEmail(api, feedback, tab.url, undefined, feedbackType);
    setFeedbackSent(true);
    setFeedbackSuccess(true);
  };

  const renderFeedbackSection = (feedback, feedbackType, buttonLabel) => (
    <>
      {feedbackSuccess ? (
        <Alert severity="success">Thanks for the feedback</Alert>
      ) : (
        <>
          {<h1>Oh no!</h1>}
          {<p>{feedback}</p>}{<br/>}
          {!feedbackSent && (
            <Button
              variant="text"
              size="small"
              endIcon={<WarningOutlinedIcon />}
              onClick={() => sendFeedbackHandler(feedback, feedbackType)}
            >
              {buttonLabel}
            </Button>
          )}
        </>
      )}
    </>
  );

  if (!isReadable) {
    return renderFeedbackSection("This text is not readable", "READABLE_", "Report page");
  }

  if (isReadable && !languageSupported) {
    return renderFeedbackSection("This language is not supported yet", "LANGUAGE_", "Do you want us to support this language?");
  }

  return <></>;
}
