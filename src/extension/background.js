console.log('Background script in THEMESRFUN');

browser.runtime.onMessage.addListener(message => {
  console.log("background script heard", JSON.stringify(message));
});
