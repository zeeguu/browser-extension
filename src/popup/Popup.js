/*global chrome*/
import { checkReadability } from "./checkReadability";
import { getUserInfo} from "./cookies";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import { getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import {
  HeadingContainer,
  PopUp,
  MiddleContainer,
  BottomContainer,
} from "./Popup.styles";
import PopupLoading from "./PopupLoading";
import PopupContent from "./PopupContent";
import { EXTENSION_SOURCE } from "../JSInjection/constants";
import { checkLanguageSupport, setUserInLocalStorage } from "./functions";
import { PrimaryButton } from "./Popup.styles";
import { StyledPrimaryButton } from "../JSInjection/Modal/Buttons.styles";

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

  const openLogin = () => {
    window.open('https://www.zeeguu.org/login', '_blank');
  };

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <BottomContainer>
          <StyledPrimaryButton
            onClick={openLogin}
            name="toLogin"
            className="toLoginButton">Login            
          </StyledPrimaryButton>
        </BottomContainer>
      </PopUp>
    );
  } else {
    if (
      user === undefined ||
      isReadable === undefined ||
      languageSupported === undefined ||
      showLoader === true
    ) {
      return (
        <PopUp>
          <PopupLoading
            showLoader={showLoader}
            setShowLoader={setShowLoader}
          ></PopupLoading>
        </PopUp>
      );
    } else {
      return (
        <PopUp>
          <HeadingContainer>
            <img src={logo} alt="Zeeguu logo" />
          </HeadingContainer>
          <MiddleContainer>
            <PopupContent
              isReadable={isReadable}
              languageSupported={languageSupported}
              user={user}
              tab={tab}
              api={api}
              sessionId={user.session}
            ></PopupContent>
          </MiddleContainer>
        </PopUp>
      );
    }
  }
}