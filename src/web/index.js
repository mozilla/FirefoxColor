console.log('This is the web page index');

setInterval(() => {
  window.postMessage({
    time: Date.now(),
    message: 'message from the page'
  }, '*');
}, 2500);
