import { expect, assert } from 'chai';

import { shallow } from 'enzyme';

import { getUserData } from './getUserData';

describe('getUserData(accountId)', () => {
  it('should return a UserAccountHandle', async () => {
    const response = await getUserData(1);
    expect(response.id).to.be.an('number');
  });
});
