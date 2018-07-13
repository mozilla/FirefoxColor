// import React from "react";
// import { expect } from "chai";
// import { spy } from "sinon";
// import { shallow, configure } from "enzyme";
// import Adapter from "enzyme-adapter-react-16";

// import { AppHeader } from "./index";
// import Metrics from "../../../../lib/metrics";

// configure({ adapter: new Adapter() });

// describe("AppHeader", () => {
//   const props = {
//     theme: {
//       colors: {
//         tab_line: {}
//       }
//     },
//     hasExtension: () => {}
//   };

//   after(function() {
//     Metrics.linkClick.restore();
//   });

//   it("enzyme renders without exploding", () => {
//     expect(shallow(<AppHeader {...props} />).length).to.equal(1);
//   });

//   it("should link to Firefox Test Pilot", () => {
//     const wrapper = shallow(<AppHeader {...props} />);
//     expect(
//       wrapper
//         .find("a")
//         .at(0)
//         .prop("href")
//     ).to.equal("https://testpilot.firefox.com");
//   });

//   it("should link to Survey Url", () => {
//     const wrapper = shallow(<AppHeader {...props} />);
//     expect(wrapper.find("a").at(1)).to.have.property("length", 1);
//   });

//   it("should call LinkClick function", () => {
//     const wrapper = shallow(<AppHeader {...props} />);
//     spy(Metrics, "linkClick");
//     wrapper
//       .find("a")
//       .at(0)
//       .simulate("click");
//     expect(Metrics.linkClick.callCount).to.equal(1);
//   });
// });
