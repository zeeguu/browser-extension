/*global chrome*/
import { Article } from "../JSInjection/Modal/Article";

export async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export function setCurrentURL(tabURL) {
  chrome.storage.local.set({ tabURL: tabURL });
}

export async function getCurrentURL() {
  const value = await chrome.storage.local.get("tabURL");
  return value.tabURL;
}

export async function getNativeLanguage() {
  const value = await chrome.storage.local.get("userInfo");
  return value.userInfo.native_language;
}

export async function getUsername() {
  const value = await chrome.storage.local.get("userInfo");
  return value.userInfo.name;
}

export async function getSessionId() {
  const value = await chrome.storage.local.get("sessionId");
  return value.sessionId;
}

export function getSourceAsDOM(url) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, false);
  xmlhttp.send();
  const parser = new DOMParser();
  //const clean = DOMPurify.sanitize(xmlhttp.responseText);
  return parser.parseFromString(xmlhttp.responseText, "text/html");
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function deleteCurrentDOM() {
  const body = document.querySelector("body");
  if (body) {
    removeAllChildNodes(body);
  }
  const head = document.querySelector("head");
  if (head) {
    removeAllChildNodes(head);
  }
  const div = document.querySelector("div");
  if (div) {
    removeAllChildNodes(div);
  }
  const iframe = document.querySelector("iframe");
  if (iframe) {
    removeAllChildNodes(iframe);
  }
}

export function deleteTimeouts() {
  var id = window.setTimeout(function () {}, 0);
  while (id--) {
    window.clearTimeout(id);
  }
}

export function deleteIntervals() {
  var id = window.setInterval(function () {}, 0);
  while (id--) {
    window.clearInterval(id);
  }
}

export function checkLanguageSupport(api, tab, setLanguageSupported) {
  Article(tab.url).then((article) => {
    api.isArticleLanguageSupported(
      article.textContent,
      (result_dict) => {
        console.log(result_dict);
        if (result_dict === "NO") {
          setLanguageSupported(false);
        }
        if (result_dict === "YES") {
          setLanguageSupported(true);
        }
      }
    );
  });
}

export function setUserInLocalStorage(user, api) {
  if (user !== undefined) {
    chrome.storage.local.set({ userInfo: user }, () =>
      console.log("user set in local storage")
    );
    chrome.storage.local.set({ sessionId: user.session });
    api.session = user.session;
  }
}