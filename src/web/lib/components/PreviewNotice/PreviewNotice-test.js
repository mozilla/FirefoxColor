import React from "react";
import { expect } from "chai";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { PreviewNotice } from "./index";
import { NOVA_BLOG_POST_URL } from "../../../../lib/constants";

configure({ adapter: new Adapter() });

describe("PreviewNotice", () => {
  it("renders without exploding", () => {
    expect(shallow(<PreviewNotice />).length).to.equal(1);
  });

  it("links to the Nova blog post", () => {
    const wrapper = shallow(<PreviewNotice />);
    expect(wrapper.find("a.preview-notice__link").prop("href")).to.equal(
      NOVA_BLOG_POST_URL
    );
  });
});
