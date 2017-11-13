# ThemesRFun

Theming demo for Firefox Quantum and beyond. 

## Get Started

1. Install Node 6.2.x (e.g. using [node version manger][nvm]) - the latest LTS
   version seems to have issues running web-ext

1. Clone the repo, install dependencies, start the dev environment:
   
   ```
   git clone https://github.com/lmorchard/ThemesRFun.git
   cd ThemesRFun
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

## Caveats on Theming

It is my contention that there are a few issues with Lightweight Themes in FF
Quantum that should be resolved.

1. Themes enforce an ugly dropshadow on tab text if color contrast is not far
   enough apart.

2. The leftmost tab border has odd styling from a placeholder element that does
   not change if the first tab is focused.

3. The accent color on active tabs is the same as the background color on the
   tab strip.

In order to rectify issue 1 and partly rectify issue 2, I've added a
`userChrome.css` file to my Firefox profile with the following: 

```
@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");

.tabbrowser-tab { 
  text-shadow: none !important; 
}

.titlebar-placeholder[type="pre-tabs"] {
  border-inline-end: 1px solid var(--tabs-border) !important;
  opacity: 1 !important;
}

.tab-icon-sound {
  filter: none !important;
}

:root:-moz-lwtheme {
  --tab-line-color: var(--toolbar-color) !important;
}

.tab-line {
  height: 2.5px !important;
  opacity: .7 !important;
}

```

If you'd like to create a `userChrome.css` file you can do so by finding your
Firefox profile, making a directory called `chrome` and in it, a file called
`userChrome.css`. Pasting the above CSS and restarting Firefox will make your
world nicer as you demo this webExtension.

## TODO

- [ ] Import theme via URL params

- [ ] Export & share theme via URL params

- [ ] Pre-made curated themes (via link?)

- [ ] Button for firefox to install themesrfun add-on to use theme
