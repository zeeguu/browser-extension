/*global chrome*/
import { checkReadability } from "./checkReadability";
import { getUserInfo} from "./cookies";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import { getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import { HeadingContainer, PopUp } from "./Popup.styles";
import { EXTENSION_SOURCE } from "../JSInjection/constants";
import { checkLanguageSupport, setUserInLocalStorage } from "./functions";
import { setCurrentURL } from "./functions";
import { PrimaryButton } from "./Popup.styles";
import { runningInChromeDesktop} from "../zeeguu-react/src/utils/misc/browserDetection";
//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

const ZEEGUU_ORG = "https://www.zeeguu.org";

export default function Popup({ loggedIn, setLoggedIn }) {
  let api = new Zeeguu_API("https://api.zeeguu.org");

  const [user, setUser] = useState();
  const [tab, setTab] = useState();
  const [isReadable, setIsReadable] = useState();
  const [languageSupported, setLanguageSupported] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const LANGUAGE_FEEDBACK = "I want this language to be supported";
  const READABILITY_FEEDBACK = "I think this article should be readable";
  
  useEffect(() => {
    if (loggedIn) {
      getUserInfo(ZEEGUU_ORG, setUser);
    }
  }, [loggedIn]);

  useEffect(() => {
    setUserInLocalStorage(user, api)
  }, [user]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
  }, []);

  useEffect(() => {
    if (tab !== undefined && user !== undefined) {
      api.session = user.session;
      api.logReaderActivity(api.OPEN_POPUP, "", tab.url, EXTENSION_SOURCE);

      // Readability check and language check
      const documentFromTab = getSourceAsDOM(tab.url);
      const isProbablyReadable = isProbablyReaderable(
        documentFromTab,
        minLength,
        minScore
      );
      const ownIsProbablyReadable = checkReadability(tab.url);
      if (!isProbablyReadable || !ownIsProbablyReadable) {
        setIsReadable(false);
        setLanguageSupported(false);
      } else {
        setIsReadable(true);
        api.session = user.session;
        if (api.session !== undefined) {
          checkLanguageSupport(api, tab, setLanguageSupported)
        }
      }
    }
  }, [tab, user]);

  const openLogin = () => {
    window.open('https://www.zeeguu.org/login', '_blank');
  };

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

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <PrimaryButton
          onClick={openLogin}
          name="toLogin"
          className="toLoginButton">Login
        </PrimaryButton>
      </PopUp>
    );
  } else{
    if (isReadable === true && languageSupported === true) {
      openModal();
    }   
  }
  return (
    < >
    </>
  );
}
