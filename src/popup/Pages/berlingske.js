export function readableBerlingske(HTMLContent) {
    const div = document.createElement("div");
    div.innerHTML = HTMLContent;
    if(div.innerHTML.indexOf("paywall_article") !== -1) {
        return false
    }
    else if(div.innerHTML.indexOf("paywall_videoarticle") !== -1){
        return false
    }
    else {
      return true;
    }
  }