import React from "react";
import { expect } from "chai";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { AppHeader } from "./index";

configure({ adapter: new Adapter() });

describe("AppHeader", () => {
  const props = {
    theme: {
      colors: {
        tab_line: {}
      }
    },
    hasExtension: () => {}
  };

  it("enzyme renders without exploding", () => {
    expect(shallow(<AppHeader {...props} />).length).to.equal(1);
  });
});
