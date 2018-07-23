const { expect } = require("chai");
const { actions, selectors, createAppStore } = require("./store");

describe("lib/store", () => {
  let store;

  beforeEach(() => {
    store = createAppStore({});
  });

  describe("custom backgrounds", () => {
    let backgrounds;

    it("should support setting custom background images by index", () => {
      const background0 = {
        url: "data:example0",
        alignment: "bottom",
        tiling: "no-repeat"
      };
      const background1 = {
        url: "data:example1",
        alignment: "center",
        tiling: "repeat"
      };

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(0);

      store.dispatch(
        actions.theme.setCustomBackground({ index: 0, ...background0 })
      );

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(1);
      expect(backgrounds[0]).to.deep.include(background0);

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.true;

      store.dispatch(
        actions.theme.setCustomBackground({ index: 1, ...background1 })
      );

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(2);
      expect(backgrounds[1]).to.deep.include(background1);

      store.dispatch(actions.theme.clearAllCustomBackgrounds());

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;
      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.deep.equal([]);
    });

    it("should support clearing custom background by index", () => {
      const background0 = {
        url: "data:example0",
        alignment: "bottom",
        tiling: "no-repeat"
      };
      const background1 = {
        url: "data:example1",
        alignment: "center",
        tiling: "repeat"
      };

      store.dispatch(
        actions.theme.setCustomBackground({ index: 0, ...background0 })
      );
      store.dispatch(
        actions.theme.setCustomBackground({ index: 1, ...background1 })
      );

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(2);
      expect(backgrounds[0]).to.deep.include(background0);
      expect(backgrounds[1]).to.deep.include(background1);

      store.dispatch(actions.theme.clearCustomBackground({ index: 0 }));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(1);
      expect(backgrounds[0]).to.deep.include(background1);

      store.dispatch(actions.theme.clearCustomBackground({ index: 0 }));
    });

    it("should support reordering custom background images", () => {
      const backgrounds = [];
      for (let idx = 0; idx < 5; idx++) {
        const background = { url: `${idx}` };
        backgrounds.push(background);
        store.dispatch(
          actions.theme.setCustomBackground({ index: idx, ...background })
        );
      }

      const result = () =>
        selectors
          .themeCustomBackgrounds(store.getState())
          .map(background => background.url);

      expect(result()).to.deep.equal(["0", "1", "2", "3", "4"]);

      store.dispatch(
        actions.theme.moveCustomBackground({ oldIndex: 1, newIndex: 3 })
      );

      expect(result()).to.deep.equal(["0", "2", "3", "1", "4"]);

      store.dispatch(
        actions.theme.moveCustomBackground({ oldIndex: 4, newIndex: 0 })
      );

      expect(result()).to.deep.equal(["4", "0", "2", "3", "1"]);
    });
  });
});
