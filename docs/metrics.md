
# Theming Metrics

Metrics collections and analysis plan for the as yet unnamed theming experiment for [Firefox Test Pilot](https://testpilot.firefox.com).

## Analysis

Data collected in this experiment will be used to answer the following high-level questions:

* Do people set custom themes?
  * Do people prefer preset themes or themes of their own creation?
  * Do people set and retain custom themes or revert to originals?
* Do people share custom themes?
  * Are there specific color spaces around which themes cluster.
* Is there a potential growth story around theming for Firefox. Can this experiment drive acquisition?


## Collection
Data will be collected with Google Analytics and follow [Test Pilot standards](https://github.com/mozilla/testpilot/blob/master/docs/experiments/ga.md) for reporting.

## Referals

* WIP referral for firefox download
* WIP referral for add-on
* WIP referral for shared theme


## Custom Metrics
* `cm1` - integer count of `select-full` events from start of visit
* `cm2` - integer count of `select-bg` events from start of visit
* `cm3` - integer count of `select-color` events from start of visit


### Custom Dimensions

* `cd1` - does the user have the add-on installed. One of `true` or `false`
* `cd2` - did this visit originate from an add-on click. One of `true` or `false`
* `cd3` - did the user receive a theme as a query parameter
* `cd4` - hash of current theme
* `cd5` - engaged with any `theme-change` event. One of `true` or `false` based on whether user has fired any `theme-change` during their visit.

### Events


#### `theme-change`
_Events stemming specific interactions with the theming sections of the service._

##### Select a full theme
```
ec: theme-change
ea: select-full
ev: {$id} // unique integer value id of the selected theme
```

##### Select a background
```
ec: theme-change
ea: select-bg
el: ${theme-api-key} // bg key in theme api
ev: {$id} // unique integer id of the selected background
```


##### Complete change of one of the individual color values
```
ec: theme-change
ea: select-color
el: ${theme-api-key} // specific theme api key
```

#### `share-engagment`
_Events stemming specific interactions with the sharing interface._
```
ec: share-engagement
ea: button-click
```

#### `exit-engagement`
_Events stemming from interactions that open other websites for the user_
```
ec: exit-engagement
ea: click
el: ${element-title} // Unique name of the element clicked such as experiment-page, download-firefox, twitter, github, cookies, terms, privacy, about, legal, mozilla.
```


