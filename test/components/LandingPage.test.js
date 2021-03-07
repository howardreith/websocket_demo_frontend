import React from 'react';
import { configure, mount } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import LandingPage from '../../src/components/LandingPage';
import TestContext from '../../src/helpers/testHelpers/TestContext';
import * as backend from '../../src/components/backend';
import { asyncFlush } from '../../src/helpers/testHelpers/testHelpers';
import SignupPage from '../../src/components/SignupPage';
import ChatRoom from '../../src/components/ChatRoom';

configure({ adapter: new Adaptor() });
describe('LandingPage', () => {
  let props;
  let username;
  let setUsername;
  function sutFactory() {
    return mount(
      <TestContext initContextState={{ setUsername, username }}>
        <LandingPage {...props} />
      </TestContext>,
    );
  }

  beforeEach(() => {
    setUsername = jest.fn();
    username = undefined;
    backend.signInWithUsername = jest.fn();
    backend.getLast50Messages = jest.fn().mockResolvedValue({ messages: [] });
    Element.prototype.scrollIntoView = () => {};
    props = {};
  });
  describe('without the username set', () => {
    it('should render the signup page and not the chat room', () => {
      const sut = sutFactory();
      expect(sut.find(SignupPage).exists()).toBeTruthy();
    });

    it('should set the username when input and submitted', async () => {
      const sut = sutFactory();
      sut.find('input[data-test-id="usernameInput"]').simulate('change', { target: { value: 'Sonic' } });
      sut.find('form[data-test-id="usernameForm"]').simulate('submit');
      await asyncFlush(sut);
      expect(backend.signInWithUsername).toHaveBeenCalledWith('Sonic');
      expect(setUsername).toHaveBeenCalledWith('Sonic');
    });

    it('should set an error when the username request throws and error', async () => {
      backend.signInWithUsername.mockRejectedValue('ewwww');
      const sut = sutFactory();
      sut.find('input[data-test-id="usernameInput"]').simulate('change', { target: { value: 'Sonic' } });
      sut.find('form[data-test-id="usernameForm"]').simulate('submit');
      await asyncFlush(sut);
      expect(sut.find('div[data-test-id="usernameInUseMessage"]').exists()).toBeTruthy();
      expect(sut.find(ChatRoom).exists()).toBeFalsy();
    });
  });

  describe('with a username set', () => {
    it('should render the chat room and not the signup form', () => {
      username = 'knuckles';
      const sut = sutFactory();
      expect(sut.find(ChatRoom).exists()).toBeTruthy();
    });
  });
});
