import { expect } from "chai";
import { spy } from "sinon";
import { mount, shallow } from "enzyme";

import { AppHeader } from "./index";

require("babel-register")({
  presets: [
    ["env", { targets: ["last 2 versions"], modules: "commonjs" }],
    "react"
  ],
  plugins: ["transform-object-rest-spread"]
});

describe('AppHeader', () => {
    beforeEach(() => {
        target = {
            href: "https://testpilot.firefox.com"
        };
        wrapper = mount( < AppHeader / > );
    });
    it("should show a link to app-header icon", () => {
        expect(wrapper.find("a.app-header__icon_click")).to.have.property("length", 1);
    });
    it("should link to /", () => {
        wrapper.find('a.app-header__icon_click').simulate('click')
        expect(wrapper.find("a.app-header__icon_click")).to.have.property("href", target.href);
    });
    it("should show a link to app-header survey", () => {
        expect(wrapper.find("a.app-header__survey")).to.have.property("length", 1);
    });
});