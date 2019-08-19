# Firefox Color

[![Greenkeeper badge](https://badges.greenkeeper.io/mozilla/FirefoxColor.svg)](https://greenkeeper.io/)

[![CircleCI](https://circleci.com/gh/mozilla/FirefoxColor.svg?style=svg)](https://circleci.com/gh/mozilla/FirefoxColor)

## Get Started

1. Install Node 8.9.4+ (e.g. using [node version manger][nvm])

1. Clone the repo, install dependencies, start the dev environment:
   ```
   git clone https://github.com/mozilla/FirefoxColor.git
   cd FirefoxColor
   npm install
   npm start
   ```

   This will start a webpack-dev-server instance at port 8080 and start a
   watcher that will rebuild the browser extension with every file change.

1. In Firefox 57 + open `about:debugging` and load the
   `build/extension/manifest.json` file.

1. Visit `http://localhost:8080` to see the web-based theme editor - changes
   should be relayed through the temporarily installed add-on and alter the
   browser theme

[nvm]: https://github.com/creationix/nvm

**Note:** If you have problems seeing the editor at `http://localhost:8080/` on
your computer, it's possible that you already have some other service using
port 8080. You can change the port that Firefox Color uses for local development:

* For Linux & OS X: `PORT=9090 npm start`
* For Windows: `.\node_modules\.bin\cross-env PORT=9090 npm start`

This example switches to port 9090, but you can supply a different port as
needed.

## Environment variables

There are a few environment variables used in building the site and extension
that are handy to know about:

- `PORT` - (default: `8080`) Port at which the webpack dev server will start up
- `NODE_ENV` - (default: `production`) setting to `development` will enable some features for development work 
- `SITE_URL` - (default: `http://localhost:8080`) the URL where the web app is hosted
- `SITE_ID` - (default: empty string) the ID of the site for the extension - e.g. "", "local", "stage", "dev"
- `DOWNLOAD_FIREFOX_UTM_SOURCE` - host name used in metrics when the button to download Firefox is clicked
- `LOADER_DELAY_PERIOD` - (default: `2000`) delay in ms used for web site loader, can be set to `0` during development to make the site appear faster but with visual glitches

## Build & Release

Deploying a development release consists of pushing to the `development` branch
on this repo. Production release consists of pushing to the `production` branch.

The script `npm run release:dev` in `package.json` takes care of the following:

* Set `ADDON_URL` and `SITE_URL` vars to point at mozilla.github.io/FirefoxColor

* Build the site

* Build & sign the add-on

* Copy the signed add-on into the site

* Deploy the site to Github Pages

Signing depends on [`WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET` environment
variables being set for use by `web-ext sign`][sign]. Deployment depends on
[`GH_TOKEN` being set with a personal access token from GitHub][ghtoken]. These
are currently configured in CircleCI to support deployment after successful
test runs.

[ghtoken]: https://github.com/settings/tokens
[sign]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign

### Environment list

| Environment | Github Branch                                                           | URL                                     |
|-------------|-------------------------------------------------------------------------|-----------------------------------------|
| Development | [development](https://github.com/mozilla/FirefoxColor/tree/development) | https://mozilla.github.io/FirefoxColor/ |
| Stage       | [stage](https://github.com/mozilla/FirefoxColor/tree/stage)             | https://color.stage.mozaws.net/         |
| Production  | [production](https://github.com/mozilla/FirefoxColor/tree/production)   | https://color.firefox.com/              |

## Notes

- Further reading for themes
  - Other addons for managing & creating themes
    - https://addons.mozilla.org/en-US/firefox/collections/ntim/theming-extensions/
  - An example of a more complex dynamically changing theme
    - https://github.com/mdn/webextensions-examples/tree/master/dynamic-theme
  - Dynamic theme with colors based on favicon
    - https://addons.mozilla.org/en-US/firefox/addon/vivaldifox/
  - Theme API
    - https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/theme
  - Hacks post on Theme API
    - https://hacks.mozilla.org/2017/12/using-the-new-theming-api-in-firefox/
  - theme.getCurrent()
    - Useful for other webextensions to match current theme colors with their own UIs
    - Maybe pre-load web page with current theme?
    - https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/theme/getCurrent
