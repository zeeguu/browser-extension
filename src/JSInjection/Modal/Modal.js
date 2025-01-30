/*global chrome*/
import { useState, useEffect, useRef } from "react";

import {
  StyledModal,
  StyledHeading,
  GlobalStyle,
  OverwriteZeeguu,
} from "./Modal.styles";

import * as s from "./Modal.sc";

import { StyledCloseButton, StyledSmallButton } from "./Buttons.styles";
import FloatingMenu from "./FloatingMenu";
import ZeeguuLoader from "../ZeeguuLoader";
import UserFeedback from "./UserFeedback";

import { EXTENSION_SOURCE } from "../constants";

import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText";
import { getMainImage } from "../Cleaning/generelClean";
import { getNativeLanguage, getUsername } from "../../popup/functions";
import { ReadArticle } from "./ReadArticle";
import WordsForArticleModal from "./WordsForArticleModal";
import ToolbarButtons from "./ToolbarButtons";
import useUILanguage from "../../zeeguu-react/src/assorted/hooks/uiLanguageHook";
import { getHTMLContent } from "../Cleaning/pageSpecificClean";
import { BROWSER_API } from "../../utils/browserApi";

import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import SaveToZeeguu from "./SaveToZeeguu";
import colors from "../colors";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { SpeechContext } from "../../zeeguu-react/src/contexts/SpeechContext";
import ZeeguuSpeech from "../../zeeguu-react/src/speech/APIBasedSpeech";
import useActivityTimer from "../../zeeguu-react/src/hooks/useActivityTimer";
import useShadowRef from "../../zeeguu-react/src/hooks/useShadowRef";
import ratio from "../../zeeguu-react/src/utils/basic/ratio";

import DigitalTimer from "../../zeeguu-react/src/components/DigitalTimer";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import ZeeguuError from "../ZeeguuError";
import useUserPreferences from "../../zeeguu-react/src/hooks/useUserPreferences.js";

export function Modal({
  title,
  content,
  modalIsOpen,
  setModalIsOpen,
  api,
  url,
  author,
}) {
  const [readArticleOpen, setReadArticleOpen] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState();
  const {
    translateInReader,
    pronounceInReader,
    updateTranslateInReader,
    updatePronounceInReader,
  } = useUserPreferences(api);

  const [articleID, setArticleID] = useState(null);
  const [articleInfo, setArticleInfo] = useState();
  const [articleTopics, setArticleTopics] = useState([]);
  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [nativeLang, setNativeLang] = useState();
  const [username, setUsername] = useState();
  const [isHovered, setIsHovered] = useState(false);

  const [loadingPersonalCopy, setLoadingPersonalCopy] = useState(true);
  const [personalCopySaved, setPersonalCopySaved] = useState(false);
  const [articleImage, setarticleImage] = useState();
  const [bookmarks, setBookmarks] = useState([]);

  const [logContext, setLogContext] = useState("ARTICLE");
  const logContextRef = useRef({});

  logContextRef.current = logContext;

  const [activeSessionDuration, clockActive] = useActivityTimer(uploadActivity);
  const [readingSessionId, setReadingSessionId] = useState();

  const activeSessionDurationRef = useShadowRef(activeSessionDuration);
  const readingSessionIdRef = useShadowRef(readingSessionId);

  function uploadActivity() {
    if (readingSessionIdRef.current)
      api.readingSessionUpdate(
        readingSessionIdRef.current,
        activeSessionDurationRef.current
      );
  }

  function updateBookmark() {
    if (articleInfo)
      api.bookmarksForArticle(articleInfo.id, (bookmarks) => {
        setBookmarks(bookmarks);
      });
  }

  const [scrollPosition, setScrollPosition] = useState();
  const scrollEvents = useRef();
  const lastSampleScroll = useRef();
  const SCROLL_SAMPLE_FREQUENCY = 1; // Sample Every second

  const openSettings = () => {
    window.open("https://www.zeeguu.org/account_settings/options", "_blank");
  };

  const buttons = [
    <UserFeedback api={api} articleId={articleID} url={url} />,
    <Button
      style={{
        textTransform: "none",
        justifyContent: "space-between",
        fontSize: "0.9rem",
        fontWeight: "200",
        backgroundColor: `${colors.lighterBlue}`,
        color: `${colors.black}`,
      }}
      key="two"
      onClick={openSettings}
    >
      Settings <SettingsIcon sx={{ fontSize: "0.9rem" }} />
    </Button>,
  ];

  const [buttonGroupVisible, setButtonGroupVisible] = useState(false);

  const toggleButtonGroup = () => {
    setButtonGroupVisible(!buttonGroupVisible);
  };
  const [speechEngine, setSpeechEngine] = useState();

  useUILanguage();

  function getScrollRatio() {
    let scrollElement = document.getElementById("scrollHolder");
    let scrollY = scrollElement.scrollTop;
    let bottomRowHeight = document.getElementById("bottomRow");
    if (!bottomRowHeight) {
      bottomRowHeight = 450; // 450 Is a default in case we can't acess the property
    } else {
      bottomRowHeight = bottomRowHeight.offsetHeight;
    }
    let endArticle =
      scrollElement.scrollHeight - scrollElement.clientHeight - bottomRowHeight;
    let ratioValue = ratio(scrollY, endArticle);
    // Should we allow the ratio to go above 1?
    // Above 1 is the area where the feedback + exercises are.
    return ratioValue;
  }

  const handleScroll = () => {
    let ratio = getScrollRatio();
    setScrollPosition(ratio);
    let percentage = Math.floor(ratio * 100);
    let currentSessionDuration = activeSessionDurationRef.current;
    if (
      currentSessionDuration - lastSampleScroll.current >=
      SCROLL_SAMPLE_FREQUENCY
    ) {
      scrollEvents.current.push([currentSessionDuration, percentage]);
      lastSampleScroll.current = currentSessionDuration;
    }
  };

  function logFocus() {
    api.logReaderActivity(
      logContextRef.current + " FOCUSED",
      articleID,
      "",
      EXTENSION_SOURCE
    );
  }

  function logBlur() {
    api.logReaderActivity(
      logContextRef.current + " LOST FOCUS",
      articleID,
      "",
      EXTENSION_SOURCE
    );
  }
  useEffect(() => {
    api.getOwnTexts((articles) => {
      checkOwnTexts(articles);
      setLoadingPersonalCopy(false);
    });
  }, [articleID]);

  useEffect(() => {
    const timedOutTimer = setTimeout(() => {
      setIsTimedOut(true);
    }, 15000);
    scrollEvents.current = [];
    lastSampleScroll.current = 0;
    setScrollPosition(0);
    if (content !== undefined) {
      let info = {
        url: url,
        htmlContent: content,
        title: title,
        authors: author,
      };
      api.findOrCreateArticle(info, (result_dict) => {
        if (result_dict.includes("Language not supported")) {
          return alert("not readable");
        }
        let artinfo = JSON.parse(result_dict);
        console.log("Created Article in the Modal JS constructore...: ");
        console.dir(artinfo);
        setArticleInfo(artinfo);
        let articleTopics = artinfo.topics_list.map((x) => x[0]);
        setArticleTopics(articleTopics);
        let engine = new ZeeguuSpeech(api, artinfo.language);
        setSpeechEngine(engine);
        api.getArticleInfo(artinfo.id, (articleData) => {
          console.log("Got Article Info in the Modal JS constructore...: ");
          setArticleID(artinfo.id);
          setInteractiveText(
            new InteractiveText(
              articleData.tokenized_paragraphs,
              articleData.id,
              true,
              api,
              articleData.translations,
              api.TRANSLATE_TEXT,
              articleData.language,
              EXTENSION_SOURCE,
              engine
            )
          );
          let itTitle = new InteractiveText(
            articleData.tokenized_title,
            articleData.id,
            false,
            api,
            articleData.translations,
            api.TRANSLATE_TEXT,
            articleData.language,
            EXTENSION_SOURCE,
            engine
          );
          setInteractiveTitle(itTitle);
          setBookmarks(articleData.translations);
          console.log("Creating reading session");
          api.readingSessionCreate(articleData.id, (sessionID) => {
            setReadingSessionId(sessionID);
            api.setArticleOpened(articleData.id);
            api.logReaderActivity(
              api.OPEN_ARTICLE,
              articleData.id,
              sessionID,
              EXTENSION_SOURCE
            );
            clearTimeout(timedOutTimer);
          });
        });
      });
    }
    getNativeLanguage().then((result) => setNativeLang(result));
    getUsername().then((result) => setUsername(result));
    setarticleImage(getMainImage(getHTMLContent(url), url));

    window.addEventListener("focus", logFocus);
    window.addEventListener("blur", logBlur);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("beforeunload", handleClose, true);
    return () => {
      window.removeEventListener("focus", logFocus);
      window.removeEventListener("blur", logBlur);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("beforeunload", handleClose, true);
    };
  }, []);

  localStorage.setItem("native_language", nativeLang);
  localStorage.setItem("name", username);

  function handleClose() {
    setModalIsOpen(false);
    uploadActivity();
    api.logReaderActivity(
      api.SCROLL,
      articleID,
      scrollEvents.current.length,
      JSON.stringify(scrollEvents.current).slice(0, 4096),
      EXTENSION_SOURCE
    );
    api.logReaderActivity(api.ARTICLE_CLOSED, articleID, "", EXTENSION_SOURCE);
    window.removeEventListener("focus", logFocus);
    window.removeEventListener("blur", logBlur);
    window.removeEventListener("scroll", handleScroll, true);
    window.location.reload();
  }

  if (!modalIsOpen) {
    window.location.reload();
  }

  function checkOwnTexts(articles) {
    if (articles.length !== 0) {
      for (var i = 0; i < articles.length; i++) {
        if (articles[i].id === articleID) {
          setPersonalCopySaved(true);
          break;
        }
      }
    }
  }

  function openReview() {
    setLogContext("WORDS REVIEW");
    setReviewOpen(true);
    setReadArticleOpen(false);
    setExerciseOpen(false);
  }

  function openArticle() {
    setReadArticleOpen(true);
    setExerciseOpen(false);
    setReviewOpen(false);
    setLogContext("ARTICLE");
  }

  const setLikedState = (state) => {
    let newArticleInfo = { ...articleInfo, liked: state };
    api.setArticleInfo(newArticleInfo, () => {
      setAnswerSubmitted(true);
      setArticleInfo(newArticleInfo);
    });
    api.logReaderActivity(
      api.LIKE_ARTICLE,
      articleInfo.id,
      state,
      EXTENSION_SOURCE
    );
  };

  const updateArticleDifficultyFeedback = (answer) => {
    let newArticleInfo = { ...articleInfo, relative_difficulty: answer };
    api.submitArticleDifficultyFeedback(
      { article_id: articleInfo.id, difficulty: answer },
      () => {
        setAnswerSubmitted(true);
        setArticleInfo(newArticleInfo);
      }
    );
    api.logReaderActivity(
      api.DIFFICULTY_FEEDBACK,
      articleInfo.id,
      answer,
      EXTENSION_SOURCE
    );
  };

  if (
    (interactiveText === undefined || loadingPersonalCopy) &&
    isTimedOut === undefined
  ) {
    return <ZeeguuLoader />;
  }
  if (isTimedOut) {
    return <ZeeguuError api={api} isTimeout={isTimedOut} />;
  }
  return (
    <>
      <SpeechContext.Provider value={speechEngine}>
        <div>
          <GlobalStyle />

          <StyledModal
            isOpen={modalIsOpen}
            className="Modal"
            id="scrollHolder"
            overlayClassName={"reader-overlay"}
          >
            <OverwriteZeeguu>
              <StyledHeading>
                <s.TopElementsContainer>
                  <s.ZeeguuRowFlexStart>
                    <StyledSmallButton>
                      <a href="https://www.zeeguu.org">
                        <img
                          src={BROWSER_API.runtime.getURL(
                            "images/zeeguuLogo.svg"
                          )}
                          alt={"Zeeguu logo"}
                          className="logoModal"
                        />
                      </a>{" "}
                      <br />
                      <span>Home</span>
                    </StyledSmallButton>
                    <SaveToZeeguu
                      api={api}
                      articleId={articleID}
                      setPersonalCopySaved={setPersonalCopySaved}
                      personalCopySaved={personalCopySaved}
                    />
                    <div>
                      <StyledSmallButton
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={openReview}
                      >
                        {isHovered ? (
                          <FactCheckIcon fontSize="large" />
                        ) : (
                          <FactCheckOutlinedIcon fontSize="large" />
                        )}{" "}
                        <br />
                        <span>Words</span>
                      </StyledSmallButton>
                    </div>
                  </s.ZeeguuRowFlexStart>
                  <s.ZeeguuRowFlexStart>
                    {readArticleOpen && (
                      <ToolbarButtons
                        translating={translateInReader}
                        pronouncing={pronounceInReader}
                        setTranslating={updateTranslateInReader}
                        setPronouncing={updatePronounceInReader}
                      />
                    )}
                    <StyledCloseButton
                      role="button"
                      onClick={handleClose}
                      id="qtClose"
                    >
                      <CloseSharpIcon sx={{ color: colors.gray }} />
                    </StyledCloseButton>
                  </s.ZeeguuRowFlexStart>
                </s.TopElementsContainer>
                {readArticleOpen && (
                  <div>
                    <DigitalTimer
                      activeSessionDuration={activeSessionDuration}
                      clockActive={clockActive}
                      showClock={true}
                    ></DigitalTimer>
                    <progress value={scrollPosition} />
                  </div>
                )}
              </StyledHeading>
              {readArticleOpen === true && (
                <ReadArticle
                  articleId={articleID}
                  articleTopics={articleTopics}
                  api={api}
                  author={author}
                  interactiveText={interactiveText}
                  interactiveTitle={interactiveTitle}
                  articleImage={articleImage}
                  openReview={openReview}
                  translating={translateInReader}
                  pronouncing={pronounceInReader}
                  url={url}
                  setPersonalCopySaved={setPersonalCopySaved}
                  personalCopySaved={personalCopySaved}
                  articleInfo={articleInfo}
                  setLikedState={setLikedState}
                  updateArticleDifficultyFeedback={
                    updateArticleDifficultyFeedback
                  }
                  answerSubmitted={answerSubmitted}
                  bookmarks={bookmarks}
                  fetchBookmarks={updateBookmark}
                />
              )}

              {reviewOpen === true && (
                <WordsForArticleModal
                  api={api}
                  articleID={articleID}
                  openArticle={openArticle}
                />
              )}
            </OverwriteZeeguu>
            <FloatingMenu
              buttons={buttons}
              buttonGroupVisible={buttonGroupVisible}
              toggleButtonGroup={toggleButtonGroup}
            />
          </StyledModal>
        </div>
      </SpeechContext.Provider>
    </>
  );
}
