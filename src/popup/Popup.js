/*global chrome*/
import Login from "./Login";
import { checkReadability } from "./checkReadability";
import {
  getUserInfo,
  saveCookiesOnZeeguu,
  removeCookiesOnZeeguu,
} from "./cookies";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import { getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import {
  HeadingContainer,
  PopUp,
  BottomButton,
  BottomContainer,
  MiddleContainer,
} from "./Popup.styles";
import PopupLoading from "./PopupLoading";
import PopupContent from "./PopupContent";
import { EXTENSION_SOURCE } from "../JSInjection/constants";
import { checkLanguageSupport, setUserInLocalStorage } from "./functions";
import { setCurrentURL } from "./functions";
import { PrimaryButton, NotifyButton } from "./Popup.styles";
import sendFeedbackEmail from "../JSInjection/Modal/sendFeedbackEmail";
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

  // if we display the loader, display it for at least 800 ms
  useEffect(() => {
    if (showLoader === true) {
      let timer = setTimeout(() => {
        setShowLoader(false);
      }, 900);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showLoader]);

  function handleSuccessfulSignIn(userInfo, session) {
    setUser({
      session: session,
      name: userInfo.name,
      learned_language: userInfo.learned_language,
      native_language: userInfo.native_language,
    });
    chrome.storage.local.set({ userInfo: userInfo });
    chrome.storage.local.set({ sessionId: session });
    setLoggedIn(true);
    saveCookiesOnZeeguu(userInfo, session, ZEEGUU_ORG);
  }

  function handleSignOut(e) {
    e.preventDefault();
    setLoggedIn(false);
    setUser();
    chrome.storage.local.set({ loggedIn: false });
    chrome.storage.local.remove(["sessionId"]);
    chrome.storage.local.remove(["userInfo"]);
    removeCookiesOnZeeguu(ZEEGUU_ORG);
  }

  const openLogin = () => {
    window.open('https://www.zeeguu.org/login', '_blank');
  };

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <PrimaryButton
          onClick={openLogin}
          name="toLogin"
          className="toLoginButton"
        >Login</PrimaryButton>
        {/* <Login
          setLoggedIn={setLoggedIn}
          handleSuccessfulSignIn={handleSuccessfulSignIn}
          api={api}
        /> */}
      </PopUp>
    );
  }

  if (loggedIn === true) {
    if (
      user === setUser ||
      isReadable === true ||
      languageSupported === true ||
      showLoader === true
    ) {
      openModal()
    }
    const [feedbackSent, setFeedbackSent] = useState(false);
    const LANGUAGE_FEEDBACK = "I want this language to be supported";
    const READABILITY_FEEDBACK = "I think this article should be readable";
    
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

  return (
    < >

    </>
  );
          }
}
