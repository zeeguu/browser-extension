import React from "react";
import { setCurrentURL } from "./functions";
import sendFeedbackEmail from "../JSInjection/Modal/sendFeedbackEmail";
import { runningInChromeDesktop } from "../zeeguu-react/src/utils/misc/browserDetection";

export default function PopupContent({
  isReadable,
  languageSupported,
  user,
  tab,
  api,
  sessionId,
}) {
  const LANGUAGE_FEEDBACK = "This language is not supported yet";
  const READABILITY_FEEDBACK = "This text is not readable";

  async function openModal() {
    if (runningInChromeDesktop()) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["./main.js"],
        func: setCurrentURL(tab.url),
      });
    } else {
      browser.tabs.executeScript(
        tab.id,
        { file: "./main.js" },
        setCurrentURL(tab.url)
      );
    }
    window.close();
  }

  function sendFeedback(feedback, feedbackType) {
    api.session = sessionId;
    sendFeedbackEmail(api, feedback, tab.url, undefined, feedbackType);
  }

  const renderFeedbackSection = (feedback, feedbackType) => (
    <>
      {<h1>Oh no!</h1>}
      {<p>{feedback}</p>}
      {sendFeedback(feedback, feedbackType)}
    </>
  );

  if (!isReadable) {
    return renderFeedbackSection(READABILITY_FEEDBACK, "READABLE_");
  } else{
    if (!languageSupported) {
      return renderFeedbackSection(LANGUAGE_FEEDBACK, "LANGUAGE_");
    }
    if (languageSupported) {
      return<>{openModal()}</>;
    }
  }
}
