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
    props = { onHandleSubmitUsername: jest.fn(), error: false };
  });

  it('should submit the username', async () => {
    const sut = sutFactory();
    sut.find('input[data-test-id="usernameInput"]').simulate('change', { target: { value: 'Sonic' } });
    sut.find('form[data-test-id="usernameForm"]').simulate('submit');
    await asyncFlush(sut);
    expect(props.onHandleSubmitUsername).toHaveBeenCalledWith('Sonic');
  });

  it('should show username in use when it is', () => {
    props.error = true;
    const sut = sutFactory();
    expect(sut.find('div[data-test-id="usernameInUseMessage"]').exists()).toBeTruthy();
  });

  it('should not show username in use when it is not', () => {
    props.error = false;
    const sut = sutFactory();
    expect(sut.find('div[data-test-id="usernameInUseMessage"]').exists()).toBeFalsy();
  });
});
