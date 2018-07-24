import { expect } from "chai";
import themes from "./index";

describe("AppBackground", () => {
  it("Theme should exist", () => {
    expect(themes).to.not.be.undefined;
  });
});
