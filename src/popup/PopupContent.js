import { useState, useEffect } from "react";
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
  const [feedbackSent, setFeedbackSent] = useState(false);
  const LANGUAGE_FEEDBACK = "I want this language to be supported";
  const READABILITY_FEEDBACK = "I think this article should be readable";

  useEffect(() => {
    if (isReadable && languageSupported) {
      openModal();
    }
  }, [isReadable, languageSupported]);

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

  function sendFeedback(feedback, url, articleId, feedbackType) {
    api.session = sessionId;
    sendFeedbackEmail(api, feedback, url, articleId, feedbackType);
    setFeedbackSent(true);
  }

  if (!isReadable) {
    return (
      <>
        {user ? <h1>Oh no, {user.name}!</h1> : null}
        <p>Not readable...</p>
      </>
    );
  }

    if (isReadable && !languageSupported) {
      return (
        <>
          {user ? <h1>Oh no, {user.name}!</h1> : null}
          <p>Language not supported...</p>
        </>
      );
    }

  // Default content when conditions are met
  return (
        <>
          {isReadable && !languageSupported ? (
            <NotifyButton
              onClick={() =>
                sendFeedback(
                  LANGUAGE_FEEDBACK,
                  tab.url,
                  undefined,
                  "LANGUAGE_"
                )
              }
            >
              Do you want us to support this language? Send feedback.
            </NotifyButton>
          ) : null}

          {!isReadable ? (
            <NotifyButton
              onClick={() =>
                sendFeedback(
                  READABILITY_FEEDBACK,
                  tab.url,
                  undefined,
                  "READABLE_"
                )
              }
            >
              Should this be readable? Send feedback.
            </NotifyButton>
          ) : null}
    </>
  );
}
