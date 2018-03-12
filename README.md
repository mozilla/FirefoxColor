# Themer

[![Greenkeeper badge](https://badges.greenkeeper.io/mozilla/Themer.svg)](https://greenkeeper.io/)

[![CircleCI](https://circleci.com/gh/mozilla/Themer.svg?style=svg)](https://circleci.com/gh/mozilla/Themer)

## Get Started

1. Install Node 8.9.4+ (e.g. using [node version manger][nvm])

1. Clone the repo, install dependencies, start the dev environment:
   ```
   git clone https://github.com/mozilla/Themer.git
   cd Themer
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
port 8080. You can change the port that Themer uses for local development:

* For Linux & OS X: `PORT=9090 npm start`
* For Windows: `.\node_modules\.bin\cross-env PORT=9090 npm start`

This example switches to port 9090, but you can supply a different port as
needed.

## Build & Release

Deploying a development release consists of pushing to the `development` branch
on this repo. Production release process is TBD.

The script `npm run release:dev` in `package.json` takes care of the following:

* Set `ADDON_URL` and `SITE_URL` vars to point at mozilla.github.io/Themer

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

## TODO

- [ ] Links to docs and calls-to-action to learn & make more complex themes

- [ ] Make editor local only to extension? Only show preview on web?

- [ ] Social sharing buttons

- [ ] Pre-made curated themes (via link?)

- [ ] Tweak build & release for prod where add-on & site will be at different
  URLs and neither on github

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
