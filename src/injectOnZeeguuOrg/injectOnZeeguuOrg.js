// for some reason this gets injected too early and the page is not ready yet
// in order to handle this, we repeat the injection a few times
// Note that this is only used for Firefox; for Chrome we send a message from the web site to the extension

const NUMBER_OF_RETRIES = 10;
const DELAY_BETWEEN_RETRIES = 100;

function notifyZeeguuOrgOfExtensionPresence() {
  window.postMessage(
    {
      direction: "from-content-script",
      message: "Greetings from the Zeeguu Extension",
    },
    "*"
  );
}

function repeat_with_delay(i, fun) {
  setTimeout(function () {
    fun();
    if (i > 0) {
      repeat_with_delay(i - 1, fun);
    }
  }, DELAY_BETWEEN_RETRIES);
}

repeat_with_delay(NUMBER_OF_RETRIES, notifyZeeguuOrgOfExtensionPresence); //  start the loop
