# App data flow

Theme param is extracted from the url search query.

If no theme param, fire off a message to request current theme from add-on. The add-on may never answer, so start the loader delay. Set timeout for `LOADER_DELAY_PERIOD` and once the timer expires, dispatch action `actions.ui.setLoaderDelayExpired(true)` .

If theme param present,

 - decode param to get the `theme`.

 - If the theme is decoded, shared theme is received.

   * Dispatch action `{...actions.theme.setTheme({theme})}` to set the theme to current editor theme. But for this theme, skip  updating history(because it came from the url) and add-on updates(because it needs approval).

   * Dispatch action `actions.ui.setPendingTheme({ theme })` to store the theme as pending.

   * Fire off a message to request current theme from the add-on. If the add-on never responds with a current theme, the shared theme just appears in the editor. If the add-on is installed and responds with a current theme, then that current theme is loaded into the editor.

   * If the pending theme exists and is not identical to the current theme  and `state.ui.userHasEdited` is false, the "pending" shared theme is presented in an approval dialog with a preview (i.e. SharedThemeDialog).
   * From there,
     - the user can apply the shared theme by dispatching action `{...actions.theme.setTheme({theme: pendingTheme }), meta: { userEdit: true }}`  to override the current theme.
or
     - skip it and discard by dispatching action `actions.ui.clearPendingTheme()`.

 - If theme decoding fails, ignore it.
