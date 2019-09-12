import { actions, selectors, themeChangeActions } from "../../lib/store";
import {
  localStorageSpace,
  STORAGE_ERROR_MESSAGE
} from "./components/StorageSpaceInformation";

export default function({
  postMessage,
  urlEncodeTheme,
  storage: { imageStorage }
}) {
  const updateExtensionThemeMiddleware = ({ getState }) => next => action => {
    const returnValue = next(action);
    const meta = action.meta || {};
    if (!meta.skipAddon && themeChangeActions.includes(action.type)) {
      postMessage("setTheme", { theme: selectors.theme(getState()) });
    }
    return returnValue;
  };

  const updateHistoryMiddleware = ({ getState }) => next => action => {
    const returnValue = next(action);
    const meta = action.meta || {};
    if (!meta.skipHistory && themeChangeActions.includes(action.type)) {
      const state = getState();
      const theme = selectors.theme(state);
      const hasCustomBackgrounds = selectors.themeHasCustomBackgrounds(state);
      urlEncodeTheme({ theme, hasCustomBackgrounds }).then(url =>
        window.history.pushState({ theme }, "", url)
      );
    }
    return returnValue;
  };

  const imageManagementMiddleware = ({
    getState,
    dispatch
  }) => next => action =>
    action.type in imageHandlers
      ? imageHandlers[action.type](getState, dispatch, next, action)
      : next(action);

  const imageHandlers = {
    [actions.images.updateImage]: (getState, dispatch, next, action) => {
      const rv = next(action);
      const { name } = action.payload;
      const state = getState();
      const images = selectors.themeCustomImages(state);
      const image = images[name];
      if (image.importing) {
        const { importing, ...importedImage } = image; // eslint-disable-line no-unused-vars
        postMessage("updateImage", { image: importedImage });
        try {
          imageStorage.put(name, importedImage);
          dispatch(actions.images.updateImage({ name, importing: false }));
          dispatch(
            actions.ui.setUsedStorage({
              space: localStorageSpace()
            })
          );
        } catch (err) {
          dispatch(actions.ui.setStorageErrorMessage(STORAGE_ERROR_MESSAGE));
          console.error(err);
        }
      }
      return rv;
    },
    [actions.images.deleteImages]: (getState, dispatch, next, action) => {
      // On image delete, also notify add-on and clean up localStorage
      const images = action.payload;
      postMessage("deleteImages", { images });
      images.forEach(name => imageStorage.delete(name));
      dispatch(
        actions.ui.setUsedStorage({
          space: localStorageSpace()
        })
      );
      return next(action);
    },
    [actions.theme.clearCustomBackground]: (
      getState,
      dispatch,
      next,
      action
    ) => {
      // Watch for deleted backgrounds in current theme to purge orphaned images
      const rv = next(action);
      purgeImages(getState, dispatch);
      return rv;
    }
  };

  const purgeImages = (getState, dispatch) => {
    const state = getState();

    const imageNames = backgrounds =>
      backgrounds.map(background => background.name);

    // Start from the set of images used in the current theme.
    const usedImages = new Set(
      imageNames(selectors.themeCustomBackgrounds(state))
    );

    // Scan through undo/redo stack for images still in use.
    [(selectors.themePast(state), selectors.themeFuture(state))].forEach(
      themes => {
        themes
          .filter(theme => theme.images && theme.images.custom_backgrounds)
          .forEach(theme => {
            imageNames(theme.images.custom_backgrounds).forEach(name =>
              usedImages.add(name)
            );
          });
      }
    );

    // Scan through saved themes for images still in use.
    const savedThemes = Object.values(selectors.savedThemes(state) || {});
    savedThemes
      .filter(({ theme }) => theme.images && theme.images.custom_backgrounds)
      .forEach(({ theme }) => {
        theme.images.custom_backgrounds.forEach(background =>
          usedImages.add(background.name)
        );
      });

    // Finally, come up with the list of images not used anywhere.
    const toDelete = Object.keys(selectors.themeCustomImages(state)).filter(
      name => !usedImages.has(name)
    );

    dispatch(actions.images.deleteImages(toDelete));
  };

  return [
    updateExtensionThemeMiddleware,
    imageManagementMiddleware,
    updateHistoryMiddleware
  ];
}
