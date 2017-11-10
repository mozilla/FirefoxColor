console.log('Content script in THEMESRFUN');

browser.runtime.sendMessage({
  msg: 'hi there boss', 
  location: window.location.href
});

window.addEventListener('message', event => {
 if (event.source == window && event.data) {
   console.log('content script heard this', JSON.stringify(event.data), 'from', window.location.href);
   browser.runtime.sendMessage({
     location: window.location.href,
     wrap: event.data
   });
  }
});
