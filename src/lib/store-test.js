const { expect } = require("chai");
const { actions, selectors, createAppStore } = require("./store");

describe("lib/store", () => {
  let store;

  beforeEach(() => {
    store = createAppStore({});
  });

  describe("custom backgrounds", () => {

    it("should support setting custom background images by index", () => {
      const url0 = "data:example0";
      const url1 = "data:example1";

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;

      let backgrounds;

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(0);

      store.dispatch(actions.theme.setCustomBackground({ index: 0, url: url0 }));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(1);
      expect(backgrounds[0]).to.equal(url0);

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.true;

      store.dispatch(actions.theme.setCustomBackground({ index: 1, url: url1 }));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(2);
      expect(backgrounds[1]).to.equal(url1);

      expect(backgrounds).to.deep.equal([ url0, url1 ]);

      store.dispatch(actions.theme.clearCustomBackground());

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;
      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.deep.equal([ ]);
    });
  });
});
