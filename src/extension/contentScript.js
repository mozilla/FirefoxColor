import { CHANNEL_NAME } from '../lib/constants';

// Relay backend port messages to content
let port;

function connect() {
  port = browser.runtime.connect({ name: CHANNEL_NAME });
  port.onDisconnect.addListener(() => {
    port = null;
    reconnect();
  });
  port.onMessage.addListener(message => {
    window.postMessage(
      {
        ...message,
        channel: `${CHANNEL_NAME}-web`
      },
      '*'
    );
  });
}

// HACK: try reconnecting when reloaded from about:debugging
function reconnect() {
  setTimeout(() => {
    if (port) {
      return;
    }
    connect();
    reconnect();
  }, 1000);
}

// Relay content messages to backend port if the channel name matches
// (Not a security feature so much as a noise filter)
window.addEventListener('message', event => {
  if (
    port &&
    event.source === window &&
    event.data &&
    event.data.channel === `${CHANNEL_NAME}-extension`
  ) {
    port.postMessage({
      ...event.data,
      location: window.location.href
    });
  }
});

connect();
