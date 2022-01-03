import React from 'react';
import chai, { expect, assert } from 'chai';
import ChaiPromised from 'chai-as-promised';

import { shallow, mount, configure } from 'enzyme';
import '$tests/setup/index';

import { observer } from 'mobx-react-lite';

import { StoreProvider } from './init';
import { useAuthStore } from '$features/auth/store/auth';

describe('lib/stores', () => {
  describe('<StoreProvider>', () => {
    it('should render without exception', () => {
      const mountStoreProvider = () => {
        const wrapper = mount(<section>hello</section>, {
          wrappingComponent: StoreProvider
        });
      };
      expect(() => mountStoreProvider()).to.not.throw();
    });

    it('Should have authStore available in context', () => {
      const wrapper = mount(<section>hello</section>, {
        wrappingComponent: StoreProvider
      });
      const provider = wrapper.getWrappingComponent();
    });
  });

  it('useAuthStore() hook in components', async () => {
    const ComponentAuth = observer(() => {
      const authStore = useAuthStore();

      const hasAccessToAuthStore = authStore?.authToken !== undefined;
      return <span>{hasAccessToAuthStore && 'OK'}</span>;
    });
    const wrapper = mount(<ComponentAuth />, {
      wrappingComponent: StoreProvider
    });
    expect(wrapper.html()).to.contains('OK');
  });
});
