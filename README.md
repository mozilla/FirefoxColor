# Firefox Color

[![CircleCI](https://circleci.com/gh/mozilla/FirefoxColor.svg?style=svg)](https://circleci.com/gh/mozilla/FirefoxColor)

## Get Started

1. Install Node 10.18.1+ (e.g. using [node version manger][nvm])

1. Clone the repo, install dependencies, start the dev environment:
   ```
   git clone https://github.com/mozilla/FirefoxColor.git
   cd FirefoxColor
   npm ci
   npm start
   ```

   This will start a webpack-dev-server instance at port 8080 and start a
   watcher that will rebuild the browser extension with every file change.

1. To activate the extension:

   1. Find the XPI for the environment:

      - Locally: `npm run package` which adds an addon.xpi to the root of the project

      - DEV / STAGE: Visit the dev or stage version of the website and click on "Get Firefox Color" (i.e. open testing.html) and use one of the referenced XPI files

   2. Now load the XPI (from the previous step) to the browser by one of the following ways:

      - Go to `about:debugging` and click on "Load Temporary Add-on..." and add the xpi

      - (or) Go to `about:config` and add setting `xpinstall.signatures.required` and set to `false`. Next drag and drop the XPI to the browser. Note you must use Beta, Dev or Nightly browser with this approach.

notes:

To debug the background file, go to `about:debugging` and click the "Inspect" button

To toggle the add-on on and off or remove, you can go to `about:addons`


4. Visit `http://localhost:8080` to see the web-based theme editor - changes
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

Upon push, CircleCI will run the following steps, as defined in the `.circleci/config.yml` file:

* Run gen-environment.sh to define the `SITE_URL` and `ADDON_URL` applicable to the current branch.

* Run code linter

* Build the site for the current branch

* Build the add-ons for all build targets (development, stage, release).

* Run tests on the current branch.

When pushed to the development branch, `npm run deploy` is run to deploy the site to Github Pages.
The stage and and production branches are updated by a push to an AWS S3 bucket.

The build includes unsigned xpi files for all branches. To finalize the deployment, the unsigned
xpi file for the production branch should be uploaded to AMO by an AMO admin
(who is allowed to upload an add-on with "Firefox" in the name).

Deployment for the development branch depends on
[`GH_TOKEN` being set with an access token from GitHub][ghtoken].
The stage and production branches rely on AWS tokens, managed by ops. These
are currently configured in CircleCI to support deployment after successful
test runs.

[ghtoken]: https://github.com/settings/tokens

## Build, test and publish add-on
The script `npm run xpi` in `package.json` generates unsigned xpi files, which
are added to `build/web` (and published to the root of `SITE_URL` by CircleCI),
on all branches (development, stage, production). These XPIs can be loaded at
`about:debugging` for manual testing.

- `firefox-color-dev-unsigned.xpi` - test with Development (testing only).
- `firefox-color-stage-unsigned.xpi` - test with Stage (testing only).
- `firefox-color-unsigned.xpi` - test with Production (release candidate).

After passing QA, the XPI can be published by manually uploading it to AMO.
Every release requires a version bump, because version numbers cannot be reused.

### Environment list

| Environment | Github Branch                                                           | URL                                     |
|-------------|-------------------------------------------------------------------------|-----------------------------------------|
| Development | [development](https://github.com/mozilla/FirefoxColor/tree/development) | https://mozilla.github.io/FirefoxColor/ |
| Stage       | [stage](https://github.com/mozilla/FirefoxColor/tree/stage)             | https://color.stage.mozaws.net/         |
| Production  | [production](https://github.com/mozilla/FirefoxColor/tree/production)   | https://color.firefox.com/              |

## UI to install the addon:

* Coming from AMO
  - The user clicks on the "Install" button and after granting permissions, a new tab opens to the addon's home page.

* Coming from the addon's home page:
  The user can click on the "Get Firefox Color" button which will direct the user to a page from where the add-on can be installed, usually AMO.


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
