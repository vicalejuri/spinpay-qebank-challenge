import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';

import { shallow, mount, configure } from 'enzyme';
import '$tests/setup/index';

import StoreProvider from './index';

describe('lib/stores', () => {
  describe('<StoreProvider>', () => {
    it('should render without exceptions', () => {
      const wrapper = shallow(
        <StoreProvider>
          <section>hello</section>
        </StoreProvider>
      );
      const section = wrapper.find('section');
      expect(section.text()).to.be.equal('hello');
    });
  });
  // it('useStore() hook', () => {
  //   const wrapper = shallow(
  //     <StoreProvider>
  //       <section>hello</section>
  //     </StoreProvider>
  //   );
  //   // console.log('wrapper => ', wrapper);
  //   expect(wrapper.html).to.be.equal('<div><section>hello</section></div>');
  // });
  // });
});
