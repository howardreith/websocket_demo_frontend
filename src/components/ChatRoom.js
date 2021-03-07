/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import { getLast50Messages } from './backend';
import withAppContext from '../withAppContext';
import { AppContextPropType } from '../helpers/PropTypeConstants';

export const StyledChatRoom = styled.div`
  margin: 3px;
  width: 99%;
  border: 1px solid black;
  height: 85vh;
  overflow-y: scroll;
`;

export const StyledMessageTextBox = styled.textarea`
  margin: 3px;
  width: 100%;
  display: flex;
  height: 30px;
`;

export const StyledSendButton = styled.input`
  width: 70px;
  height: 35px;
  margin: 3px;
`;

export const StyledMessageTextForm = styled.form`
  display: flex;
`;

export const StyledHeaderWrapper = styled.div`
  height: 60px;
  text-align: center;
`;

export class ChatRoomWithoutContext extends Component {
  constructor(props) {
    super(props);
    this.handleMessageTextChange = this.handleMessageTextChange.bind(this);
    this.handleSubmitAsync = this.handleSubmitAsync.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = { messageText: '', messages: [] };
    this.messagesEndRef = React.createRef();
  }

  async componentDidMount() {
    const { socket } = this.props;
    const initialMessages = await getLast50Messages();
    this.setState({ messages: initialMessages.messages.reverse() });

    socket.on('receiveMessage', (data) => {
      const { username, message } = data;
      const { messages } = this.state;
      messages.push({ messageSender: username, message });
      this.setState({ messages });
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleMessageTextChange(event) {
    const { value } = event.target;
    this.setState((state) => ({ ...state, messageText: value }));
  }

  async handleSubmitAsync(event) {
    const { socket } = this.props;
    event.preventDefault();
    const { messageText } = this.state;
    const { appContext } = this.props;
    const data = { username: appContext.username, message: messageText };
    socket.emit('message', data);
    this.setState({ messageText: '' });
  }

  async onKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      await this.handleSubmitAsync(event);
    }
  }

  scrollToBottom() {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const { messageText, messages } = this.state;
    return (
      <div>
        <StyledHeaderWrapper>
          <h1>Howie Chat</h1>
        </StyledHeaderWrapper>
        <StyledChatRoom id="mainChatWindow" data-test-id="mainChatWindow">
          {messages.map((message, i) => message && message.message && message.messageSender && (
            <div key={`${i}wrapper${message.message.replace(/\s/, '')}`}>
              <span key={`${i}sender${message.message.replace(/\s/, '')}`}>
                {`${message.messageSender}: `}
              </span>
              <span key={`${i}message${message.message.replace(/\s/, '')}`}>{message.message}</span>
            </div>
          ))}
          <div ref={this.messagesEndRef} />
        </StyledChatRoom>
        <StyledMessageTextForm id="chatTextForm" data-test-id="chatTextForm" onSubmit={this.handleSubmitAsync}>
          <StyledMessageTextBox
            onKeyDown={this.onKeyDown}
            value={messageText}
            onChange={this.handleMessageTextChange}
            id="messageTextBox"
            data-test-id="messageTextBox"
          />
          <StyledSendButton type="submit" value="send" id="sendMessageButton" />
        </StyledMessageTextForm>
      </div>
    );
  }
}

export default withAppContext(ChatRoomWithoutContext);

ChatRoomWithoutContext.propTypes = {
  appContext: AppContextPropType.isRequired,
  socket: PropTypes.shape(
    {
      on: PropTypes.func.isRequired,
      emit: PropTypes.func.isRequired,
    },
  ).isRequired,
};
