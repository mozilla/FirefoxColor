const { expect } = require("chai");

const themes = require("./themes");

describe("lib/themes", () => {
  it("should exist", () => {
    expect(themes).to.not.be.undefined;
  });
});
