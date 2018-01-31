
### In General
- [ ] It should generally match Photon styles.
- [ ] It should specify that it is a Firefox Test Pilot experiment. (cf Send)
- [ ] It should have a list of mandatory links at the bottom of the page including any required privacy documentation.(cf Send)
- [ ] It should not be called ThemesRFun (or any derivation thereof).
- [ ] It should match final visual specs.

### Add-on UI
- [ ] It should be accessible through a browserAction.
- [ ] The browserAction should be a single color SVG icon that accepts a value of `fill=context-fill`
- [ ] The browserACtion should not be a clone of the current [Photon customize icon](https://design.firefox.com/icons/viewer/#customize).
- [ ] Hitting the browserAction should direct the user to the TRF site

### For all desktop browser users
- [ ] It should be functionally responsive down to 640px.
- [ ] It should let users select colors for each individual component of the theming API via WYSIWYG editor.
- [ ] It should let users select background images or patterns from a preset list.
- [ ] It should let users select from preset themes using some kind of visual picker.
- [ ] It should let users see an in-content representation of how their theme would look in the Firefox Browser.
- [ ] It should let users undo or redo the changes they've made in an editing session.
- [ ] It should let users see a custom URL of the theme they've generated.

### For FF users with the TRF add-on
- [ ] It should propagate editor changes up to the browser chrome instantly.
- [ ] It should let users save themes they've generated to localStorage and see previews of them on subsequent visits.
- [ ] It should let users reset their browser back to it's default theme state.

### For FF users without the TRF add-on
- [ ] It should let users install the TRF add-on directly from the TRF site.
- [ ] It should prompt users who install TRF from TRF to check out Test Pilot.

### For non-FF desktop users
- [ ] It should have a primary CTA telling users to install Firefox

### For all mobile browser users
- [ ] It should have a minimal, pleasant mobile experience that lets users know it's a desktop experiment.

### Data Collection
- [ ] It should link to a survey and that survey link should include two query params `ver={addon-ver}` and `ref=app`
- [ ] It should only provide the survey link if the user has the TRF add-on installed.
- [ ] It should ping GA for all pings described in the [experiment metrics doc](./metrics.md).
- [ ] It should respect DNT.

### A11y
- [ ] All buttons and links should have visible focus states
- [ ] All buttons and links should be accessible via keyed entry (tab selection)
- [ ] All form elements should include appropriate label attributes
- [ ] All grouped buttons should be nested in a <fieldset> and described with a legend
- [ ] All UI should be verified to use A11y friendly contrast ratios
