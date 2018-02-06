
### In General
- [ ] [#38](https://github.com/mozilla/ThemesRFun/issues/38) 
  It should generally match Photon styles.
- [ ] [#31](https://github.com/mozilla/ThemesRFun/issues/31) 
  It should specify that it is a Firefox Test Pilot experiment. (cf Send)
- [ ] [#39](https://github.com/mozilla/ThemesRFun/issues/39) 
  It should have a list of mandatory links at the bottom of the page including any required privacy documentation.(cf Send)
- [ ] [#23](https://github.com/mozilla/ThemesRFun/issues/23) 
  It should not be called ThemesRFun (or any derivation thereof).
- [ ] [#40](https://github.com/mozilla/ThemesRFun/issues/40) 
  It should match final visual specs.

### Add-on UI
- [x] It should be accessible through a browserAction.
- [ ] [#18](https://github.com/mozilla/ThemesRFun/issues/18) 
  The browserAction should be a single color SVG icon that accepts a value of `fill=context-fill`
- [ ] [#18](https://github.com/mozilla/ThemesRFun/issues/18) 
  The browserAction should not be a clone of the current [Photon customize icon](https://design.firefox.com/icons/viewer/#customize).
- [x] Hitting the browserAction should direct the user to the TRF site

### For all desktop browser users
- [ ] [#41](https://github.com/mozilla/ThemesRFun/issues/41) 
  It should be functionally responsive down to 640px.
- [x] It should let users select colors for each individual component of the theming API via WYSIWYG editor.
- [x] It should let users select background images or patterns from a preset list.
- [x] It should let users select from preset themes using some kind of visual picker.
- [x] It should let users see an in-content representation of how their theme would look in the Firefox Browser.
- [ ] [#42](https://github.com/mozilla/ThemesRFun/issues/42) 
  It should let users undo or redo the changes they've made in an editing session.
- [x] It should let users see a custom URL of the theme they've generated.

### For FF users with the TRF add-on
- [x] It should propagate editor changes up to the browser chrome instantly.
- [ ] [#43](https://github.com/mozilla/ThemesRFun/issues/43)
  It should let users save themes they've generated to localStorage and see previews of them on subsequent visits.
- [ ] [#44](https://github.com/mozilla/ThemesRFun/issues/44) 
  It should let users reset their browser back to it's default theme state.

### For FF users without the TRF add-on
- [x] It should let users install the TRF add-on directly from the TRF site.
- [ ] [#31](https://github.com/mozilla/ThemesRFun/issues/31)
  It should prompt users who install TRF from TRF to check out Test Pilot.

### For non-FF desktop users
- [ ] [#28](https://github.com/mozilla/ThemesRFun/issues/28)
  It should have a primary CTA telling users to install Firefox

### For all mobile browser users
- [ ] [#45](https://github.com/mozilla/ThemesRFun/issues/45)
  It should have a minimal, pleasant mobile experience that lets users know it's a desktop experiment.

### Data Collection
- [ ] [#29](https://github.com/mozilla/ThemesRFun/issues/29) 
  It should link to a survey and that survey link should include two query params `ver={addon-ver}` and `ref=app`
- [ ] [#29](https://github.com/mozilla/ThemesRFun/issues/29)
  It should only provide the survey link if the user has the TRF add-on installed.
- [ ] [#46](https://github.com/mozilla/ThemesRFun/issues/46)
  It should ping GA for all pings described in the [experiment metrics doc](./metrics.md).
- [ ] [#46](https://github.com/mozilla/ThemesRFun/issues/46)
  It should respect DNT.

### A11y
- [ ] [#47](https://github.com/mozilla/ThemesRFun/issues/47) All buttons and links should have visible focus states
- [ ] [#47](https://github.com/mozilla/ThemesRFun/issues/47) All buttons and links should be accessible via keyed entry (tab selection)
- [ ] [#47](https://github.com/mozilla/ThemesRFun/issues/47) All form elements should include appropriate label attributes
- [ ] [#47](https://github.com/mozilla/ThemesRFun/issues/47) All grouped buttons should be nested in a <fieldset> and described with a legend
- [ ] [#47](https://github.com/mozilla/ThemesRFun/issues/47) All UI should be verified to use A11y friendly contrast ratios
