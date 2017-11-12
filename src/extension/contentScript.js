import { CHANNEL_NAME } from '../lib/constants';

// Relay backend port messages to content
const port = browser.runtime.connect({ name: CHANNEL_NAME });
port.onMessage.addListener(message => {
  window.postMessage(
    {
      ...message,
      channel: `${CHANNEL_NAME}-web`
    },
    '*'
  );
});

// Relay content messages to backend port if the channel name matches
// (Not a security feature so much as a noise filter)
window.addEventListener('message', event => {
  if (
    event.source === window &&
    event.data &&
    event.data.channel === `${CHANNEL_NAME}-background`
  ) {
    port.postMessage({
      ...event.data,
      location: window.location.href
    });
  }
});
