import React from 'react';
import { configure, mount } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import SignupPage from '../../src/components/SignupPage';
import { asyncFlush } from '../../src/helpers/testHelpers/testHelpers';

configure({ adapter: new Adaptor() });
describe('SignupPage', () => {
  let props;
  function sutFactory() {
    return mount(<SignupPage {...props} />);
  }

  beforeEach(() => {
    props = { onHandleSubmitUsername: jest.fn() };
  });

  it('should submit the username', async () => {
    const sut = sutFactory();
    sut.find('input[data-test-id="usernameInput"]').simulate('change', { target: { value: 'Sonic' } });
    sut.find('form[data-test-id="usernameForm"]').simulate('submit');
    await asyncFlush(sut);
    expect(props.onHandleSubmitUsername).toHaveBeenCalledWith('Sonic');
  });
});
