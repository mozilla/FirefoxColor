const { expect } = require("chai");
const { actions, selectors, createAppStore } = require("./store");

describe("lib/store", () => {
  let store;

  beforeEach(() => {
    store = createAppStore({});
  });

  describe("managing images", () => {
    let images;

    const imageName = "random.png";
    const imageData = "data:8675309";
    const imageType = "image/png";
    const imageSize = 8675309;
    const imageImporting = false;

    const expectedImage1 = {
      name: imageName,
      image: imageData,
      size: imageSize,
      type: imageType,
      importing: imageImporting
    };

    it("should support loading images in bulk", () => {
      store.dispatch(
        actions.images.loadImages({
          [imageName]: expectedImage1
        })
      );

      images = selectors.themeCustomImages(store.getState());
      expect(Object.keys(images)).to.have.lengthOf(1);
      expect(images[imageName]).to.deep.equal(expectedImage1);
    });

    it("should support adding an image", () => {
      images = selectors.themeCustomImages(store.getState());
      expect(Object.keys(images)).to.have.lengthOf(0);

      store.dispatch(actions.images.addImage(expectedImage1));

      images = selectors.themeCustomImages(store.getState());
      expect(Object.keys(images)).to.have.lengthOf(1);
      expect(images[imageName]).to.deep.equal(expectedImage1);
    });

    it("should flag an image as updating by default", () => {
      store.dispatch(
        actions.images.addImage({
          name: imageName,
          image: imageData,
          size: imageSize,
          type: imageType
        })
      );

      images = selectors.themeCustomImages(store.getState());
      expect(images[imageName].importing).to.be.true;
    });

    it("should support updating an image", () => {
      store.dispatch(actions.images.addImage(expectedImage1));
      store.dispatch(
        actions.images.updateImage({ name: imageName, importing: true })
      );

      images = selectors.themeCustomImages(store.getState());
      expect(images[imageName].importing).to.be.true;
    });

    it("should support loading a single image without replacing all", () => {
      store.dispatch(
        actions.images.loadImages({
          additional: { ...expectedImage1, name: "additional" },
          [imageName]: { ...expectedImage1, image: "foo" }
        })
      );
      store.dispatch(actions.images.loadImage(expectedImage1));

      images = selectors.themeCustomImages(store.getState());
      expect(Object.keys(images)).to.have.lengthOf(2);
      expect(images[imageName]).to.deep.equal(expectedImage1);
    });

    it("should support deleting imported images", () => {
      const names = ["one", "two", "three"];
      names.forEach(name =>
        store.dispatch(actions.images.addImage({ ...expectedImage1, name }))
      );

      images = selectors.themeCustomImages(store.getState());
      expect(Object.keys(images)).to.have.lengthOf(names.length);

      store.dispatch(actions.images.deleteImages(names));

      images = selectors.themeCustomImages(store.getState());
      expect(Object.keys(images)).to.have.lengthOf(0);
    });
  });

  describe("themes via addonId", () => {
    it("should support setting a theme via addonId", () => {
      const addonId = "a@b.com";

      expect(selectors.themeHasAddonId(store.getState())).to.be.false;
      expect(selectors.theme(store.getState()).addonId === addonId).to.be.false;

      store.dispatch(actions.theme.setTheme({ theme: { addonId } }));

      expect(selectors.themeHasAddonId(store.getState())).to.be.true;
      expect(selectors.theme(store.getState()).addonId === addonId).to.be.true;
    });
  });

  describe("custom backgrounds", () => {
    let backgrounds;

    const background0 = {
      name: "random0.png",
      alignment: "bottom",
      tiling: "no-repeat"
    };
    const background1 = {
      name: "random1.jpg",
      alignment: "center",
      tiling: "repeat"
    };

    it("should support adding a background", () => {
      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(0);

      store.dispatch(actions.theme.addCustomBackground(background0));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(1);
      expect(backgrounds[0]).to.deep.include(background0);

      store.dispatch(actions.theme.addCustomBackground(background1));

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(2);
      expect(backgrounds[0]).to.deep.include(background1);
      expect(backgrounds[1]).to.deep.include(background0);
    });

    it("should support updating a background by index", () => {
      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.false;

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(0);

      store.dispatch(
        actions.theme.updateCustomBackground({ index: 0, ...background0 })
      );

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(1);
      expect(backgrounds[0]).to.deep.include(background0);

      expect(selectors.themeHasCustomBackgrounds(store.getState())).to.be.true;

      store.dispatch(
        actions.theme.updateCustomBackground({ index: 1, ...background1 })
      );

      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds).to.have.lengthOf(2);
      expect(backgrounds[1]).to.deep.include(background1);
    });

    it("should support partial updates to a background", () => {
      store.dispatch(actions.theme.addCustomBackground(background0));
      store.dispatch(
        actions.theme.updateCustomBackground({ index: 0, name: "changed" })
      );
      backgrounds = selectors.themeCustomBackgrounds(store.getState());
      expect(backgrounds[0]).to.deep.include({
        ...background0,
        name: "changed"
      });
    });

    it("should support clearing custom background by index", () => {
      store.dispatch(actions.theme.addCustomBackground(background1));
      store.dispatch(actions.theme.addCustomBackground(background0));

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
      for (let idx = 4; idx >= 0; idx--) {
        const background = { name: `${idx}` };
        backgrounds.push(background);
        store.dispatch(actions.theme.addCustomBackground(background));
      }

      const result = () =>
        selectors
          .themeCustomBackgrounds(store.getState())
          .map(background => background.name);

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
