/*Final cleanup function */
export function generalClean(content) {
  //let cleanContent = cleanImages(content);
  let cleanContent = removeSVG(content);
  cleanContent = removeLinks(cleanContent);
  cleanContent = removeFigcaption(cleanContent);
  //cleanContent = extractTextFromHTML(cleanContent);
  return cleanContent

}

/* Functions */
function cleanImages(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const firstImage = div.getElementsByTagName("img")[0];
  if (firstImage !== undefined) {
    firstImage.setAttribute("id", "zeeguuImage");
    let images = div.getElementsByTagName("img"),
      index;
    for (index = images.length - 1; index >= 0; index--) {
      if (index !== 0) {
        images[index].parentNode.removeChild(images[index]);
      }
    }
    content = div.innerHTML;
  }
  return content;
}

export function getImage(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const firstImage = div.getElementsByTagName("img")[0];
  if((firstImage != undefined)){
  const image = {src:firstImage.getAttribute("src"), alt:firstImage.getAttribute("alt")};
  return image
  }
}

function removeSVG(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const allSVG = div.getElementsByTagName("svg");
  if (allSVG !== undefined) {
    let svg = allSVG,
      index;
    for (index = svg.length - 1; index >= 0; index--) {
      svg[index].parentNode.removeChild(svg[index]);
    }
    content = div.innerHTML;
  }
  return content;
}

function removeLinks(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  var links = div.getElementsByTagName("a");
  while (links.length) {
    var parent = links[0].parentNode;
    while (links[0].firstChild) {
      parent.insertBefore(links[0].firstChild, links[0]);
    }
    parent.removeChild(links[0]);
  }
  content = div.innerHTML;
  return content;
}

function extractTextFromHTML(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const nodes = [div];
  const text = nodes
    .filter((node) => !!node.textContent)
    .map((node) => node.textContent)
    .join(" ");
  return text;
}

function removeFigcaption(content){
  const div = document.createElement("div");
  div.innerHTML = content;
  const figcaption = div.getElementsByTagName("figcaption");
  if (figcaption  !== undefined) {
    console.log(figcaption)
    let caption = figcaption ,
      index;
    for (index = caption.length - 1; index >= 0; index--) {
      caption[index].parentNode.removeChild(caption[index]);
    }
    content = div.innerHTML;
  }
  return content;

}




