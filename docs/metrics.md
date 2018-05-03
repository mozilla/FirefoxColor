
# Theming Metrics

Metrics collections and analysis plan for the as yet unnamed theming experiment for [Firefox Test Pilot](https://testpilot.firefox.com).

## Analysis

Data collected in this experiment will be used to answer the following high-level questions:

* Do people set custom themes?
  * Do people prefer preset themes or themes of their own creation?
  * Do people set and retain custom themes or revert to default?
* Do people share custom themes?
  * Are there specific color spaces around which themes cluster.
* Is there a potential growth story around theming for Firefox. Can this experiment drive acquisition?


## Collection
Data will be collected with Google Analytics and follow [Test Pilot standards](https://github.com/mozilla/testpilot/blob/master/docs/experiments/ga.md) for reporting.

## Custom Metrics
* `cm1` - integer count of `select-full` events from start of visit
* `cm2` - integer count of `select-bg` events from start of visit
* `cm3` - integer count of `select-color` events from start of visit

### Custom Dimensions

* `cd1` - does the user have the add-on installed. One of `true` or `false`
* `cd2` - did this visit originate from an add-on click. One of `true` or `false`
* `cd3` - did the user receive a theme as a query parameter. One of `true` or `false`
* `cd4` - engaged with any `theme-change` event. One of `true` or `false` based on whether user has fired any `theme-change` during their visit.
* `cd5` - rgba (csv) of the `toolbar`
* `cd6` - rgb (csv) of the `toolbar_text`
* `cd7` - rgb (csv) of the `accentcolor`
* `cd8` - rgb (csv) of the `textcolor`
* `cd9` - rgba (csv) of the `toolbar_field`
* `cd10` - rgb (csv) of the `toolbar_field_text`
* `cd11` - unique integer id of the background pattern selected
* `cd12` - rgb (csv) of the `tab_line`

### Events

#### `install`

_Event stemming from the add-on install flow._
##### When user clicks on install event
```
ec: install-addon,
ea: button-click,
el: install-trigger,
cm1,
cm2,
cm3,
cd3,
cd4,
cd5,
cd6,
cd7,
cd8
cd9,
cd10,
cd11,
cd12
```

##### If we deem installation fails (based on polling)
```
ec: install-addon,
ea: poll-event,
el: install-fail
```

##### If we deem installation succeeds (based on polling)
```
ec: install-addon,
ea: poll-event,
el: install-success
```

#### `theme-change`

_Events stemming specific interactions with the theming sections of the service._
##### Select a full theme
```
ec: theme-change,
ea: select-full,
ev: {$id} // unique integer value id of the selected theme
cm1,
cm2,
cm3,
cd1,
cd2
```

##### Select a background
```
ec: theme-change,
ea: select-background,
el: ${theming-api-prop}, // specific theme API prop being changed
cm1,
cm2,
cm3,
cd1,
cd2,
cd3,
cd11
```

##### Complete change of one of the individual color values
```
ec: theme-change,
ea: select-color,
el: ${theme-api-prop}, // specific theme API prop (toolbar, toolbar_text etc.)
cm1,
cm2,
cm3,
cd1,
cd2,
cd3
```

#### `share-engagment`

_Events stemming specific interactions with the sharing interface._
```
ec: share-engagement,
ea: button-click,
cm1,
cm2,
cm3,
cd1,
cd2,
cd3,
cd4,
cd5,
cd6,
cd7,
cd8,
cd9,
cd10,
cd11,
cd12
```

#### `link-engagement`
_Events stemming from interactions that open other websites for the user._
```
ec: link-engagement,
ea: click,
el: ${element-title}, // Unique name of the element clicked such as experiment-page, download-firefox, twitter, github, cookies, terms, privacy, about, legal, mozilla.
cm1,
cm2,
cm3,
cd1,
cd2,
cd3,
cd4,
// if el === download-firefox, add the following dimensions to this event
cd5,
cd6,
cd7,
cd8,
cd9,
cd10,
cd11,
cd12
```

#### `receive-theme`

_Events triggered when a user with the add-on visits the site with a theme URL that does not match the currently applied theme_
```
ec: receive-theme,
ea: click-button,
el: accept || reject, // depending on what a user does with the received theme
cd1,
cd5,
cd6,
cd7,
cd8,
cd9,
cd10,
cd11,
cd12
```

#### `finish-visit`

_This event should fire when a user with the add-on leaves the site_
```
ec: finish-visit
ea: leave
cm2,
cm3,
cd1,
cd2,
cd3,
cd4,
cd5,
cd6,
cd7,
cd8,
cd9,
cd10,
cd11
```

## Referrals

The Firefox download link should appear as follows:

```
https://www.mozilla.org/firefox/new/?utm_campaign=${experiment-slug}-acquisition&utm_medium=referral&utm_source=${experiment-host}
```
