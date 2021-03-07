import React from 'react';
import { configure, mount } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import { io } from 'socket.io-client';
import TestContext from '../../src/helpers/testHelpers/TestContext';
import ChatRoom from '../../src/components/ChatRoom';
import * as backend from '../../src/components/backend';
import { getLast50Messages } from '../../src/components/backend';
import { asyncFlush } from '../../src/helpers/testHelpers/testHelpers';

configure({ adapter: new Adaptor() });
describe('ChatRoom', () => {
  let props;
  let setUsername;
  let username;
  function sutFactory() {
    return mount(
      <TestContext initContextState={{ setUsername, username }}>
        <ChatRoom {...props} />
      </TestContext>,
    );
  }

  beforeEach(() => {
    Element.prototype.scrollIntoView = jest.fn();
    backend.signInWithUsername = jest.fn();
    backend.getLast50Messages = jest.fn().mockResolvedValue({ messages: [] });
    props = {
      socket: {
        on: jest.fn(),
        emit: jest.fn(),
      },
    };
    setUsername = jest.fn();
    username = 'DavidTheGnome';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should populate the chatroom with initial messages', async () => {
    getLast50Messages.mockResolvedValue({
      status: 'ok',
      messages: [
        { message: 'hi', messageSender: 'Lisa' },
        { message: 'hello', messageSender: 'David' },
      ],
    });
    const sut = sutFactory();
    await asyncFlush(sut);
    expect(sut.find('div[data-test-id="mainChatWindow"]').find('span').length).toEqual(4);
    expect(sut.find('div[data-test-id="mainChatWindow"]').find('span').at(0).text()).toEqual('David: ');
    expect(sut.find('div[data-test-id="mainChatWindow"]').find('span').at(1).text()).toEqual('hello');
    expect(sut.find('div[data-test-id="mainChatWindow"]').find('span').at(2).text()).toEqual('Lisa: ');
    expect(sut.find('div[data-test-id="mainChatWindow"]').find('span').at(3).text()).toEqual('hi');
  });

  it('should scroll to the bottom of the chat on mount', async () => {
    const sut = sutFactory();
    await asyncFlush(sut);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('should send a message to the websocket on submit', async () => {
    const sut = sutFactory();
    await asyncFlush(sut);
    sut.find('textarea[data-test-id="messageTextBox"]').simulate('change', { target: { value: 'how are you' } });
    sut.find('form[data-test-id="chatTextForm"]').simulate('submit');
    await asyncFlush(sut);
    expect(props.socket.emit).toHaveBeenCalledWith('message', { message: 'how are you', username: 'DavidTheGnome' });
  });
});
