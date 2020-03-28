import React from "react";
import { expect } from "chai";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { AppFooter } from "./index";

configure({ adapter: new Adapter() });

describe("AppFooter", () => {
  const props = {
    hasExtension: () => {},
    setDisplayLegalModal: () => {}
  };

  it("enzyme renders without exploding", () => {
    expect(shallow(<AppFooter {...props} />).length).to.equal(1);
  });

  it("should render to Mozilla logo", () => {
    const wrapper = shallow(<AppFooter {...props} />);
    expect(
      wrapper
        .find("a.app-footer__legal-link")
        .at(0)
        .prop("href")
    ).to.equal("https://www.mozilla.org");
  });

  it("should render to app-footer legal link", () => {
    const wrapper = shallow(<AppFooter {...props} />);
    expect(
      wrapper
        .find("a.app-footer__legal-link")
        .at(1)
        .prop("href")
    ).to.equal("https://www.mozilla.org/about/legal");
  });

  it("should show a link to app-footer social-link", () => {
    const wrapper = shallow(<AppFooter {...props} />);
    expect(wrapper.find("a.app-footer__social-link")).to.have.property(
      "length",
      2
    );
  });
});
