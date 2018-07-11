const { expect } = require("chai");
const { actions, selectors, createAppStore } = require("./store");

describe("lib/store", () => {
  let store;

  beforeEach(() => {
    store = createAppStore({});
  });

  describe("custom backgrounds", () => {

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

      let backgrounds;

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(0);

      store.dispatch(actions.theme.setCustomBackground({ index: 0, ...background0 }));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(1);
      expect(backgrounds[0]).to.deep.include(background0);

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.true;

      store.dispatch(actions.theme.setCustomBackground({ index: 1, ...background1 }));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(2);
      expect(backgrounds[1]).to.deep.include(background1);

      store.dispatch(actions.theme.clearCustomBackground());

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;
      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.deep.equal([ ]);
    });
  });
});
