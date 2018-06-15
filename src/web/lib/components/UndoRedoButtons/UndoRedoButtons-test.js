import React from "react";
import { expect } from "chai";
import { sinon, stub, spy } from "sinon";
import { mount, shallow, configure} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';

import { UndoRedoButtons } from "./index";
import Metrics from "../../../../lib/metrics";

configure({ adapter: new Adapter() });

describe('UndoRedoButtons', () => {
    
    it('enzyme renders without exploding',() => {
        expect(shallow( < UndoRedoButtons />).length).to.equal(1);
    });

    it('indicates whether Undo button is disabled', () => {
        const CanUndo = true;
        const wrapper = shallow( < UndoRedoButtons themeCanUndo={CanUndo} />);
        expect(wrapper.find('button').at(0).hasClass('disabled')).to.equal(false);
    })

    it('indicates whether Redo button is disabled', () => {
        const CanRedo = true;
        const wrapper = shallow( < UndoRedoButtons themeCanRedo={CanRedo} />);
        expect(wrapper.find('button').at(1).hasClass('disabled')).to.equal(false);
    })

});
