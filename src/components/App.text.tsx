import React from 'react';
import { expect, assert } from 'chai';

import { shallow, mount, configure } from 'enzyme';
import '../../tests/setup/index';

import AppComponent from './App';

describe('components/App', () => {
  it('should render', () => {
    const wrapper = shallow(<AppComponent />);
    const section = wrapper.find('section');
    expect(section.text().length).to.be.greaterThan(0);
  });
});
