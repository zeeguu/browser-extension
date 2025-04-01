// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if ((message.selectedText)) {
        //debugging log
        console.log("Service worker(text):", message.selectedText);
        console.log("Service worker(anchorNode):", message.anchorNode);
        console.log("Service worker(parentElement):", message.parentElement);
        console.log("Service worker(URL):", message.url);
    }
});
