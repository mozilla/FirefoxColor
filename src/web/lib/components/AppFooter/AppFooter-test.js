import React from "react";
import { expect } from "chai";
import { sinon, stub, spy } from "sinon";
import { mount, shallow, configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

import { AppFooter } from "./index";
import Metrics from "../../../../lib/metrics";

configure({ adapter: new Adapter() });

describe('AppFooter', () => {
    const props= { 
            hasExtension: () => {},
            setDisplayLegalModal: () => { display: true;}
        };
    after( function () {
        Metrics.linkClick.restore();
    });

    it('enzyme renders without exploding',() => {
        expect(shallow( < AppFooter {...props} />).length).to.equal(1);
    });

    it('should render to Mozilla logo',() => {
        const wrapper = shallow( < AppFooter {...props} />);
        expect(wrapper.find('a.app-footer__legal-link').at(0).prop('href')).to.equal('https://www.mozilla.org');
    });

    it('should render to app-footer legal link',() => {
        const wrapper = shallow( < AppFooter {...props} />);
        expect(wrapper.find('a.app-footer__legal-link').at(1).prop('href')).to.equal('https://www.mozilla.org/about/legal');
    });

    it('should render to About Test Pilot link',() => {
        const wrapper = shallow( < AppFooter {...props} />);
        expect(wrapper.find('a.app-footer__legal-link').at(2).prop('href')).to.equal('https://testpilot.firefox.com/about');
    });

    it('should call LinkClick function', () => {
        const wrapper = shallow( < AppFooter {...props} />);
        spy(Metrics, 'linkClick');
        wrapper.find('a.app-footer__legal-link').at(0).simulate('click');                                                                                                       
        expect(Metrics.linkClick.callCount).to.equal(1);
    });

    /*it('should call toggleModal function', () => {
        const toggleModalClick = spy();
        const wrapper = shallow( < AppFooter {...props} toggleModal={toggleModalClick} />);
        wrapper.find('span').at(1).simulate('click');  
        expect(toggleModalClick.calledOnce).to.be.true;
    });*/

    it("should show a link to app-footer social-link", () => {
        const wrapper = shallow( < AppFooter {...props} />);
        expect(wrapper.find("a.app-footer__social-link")).to.have.property("length", 2);
    });
});
