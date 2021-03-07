import React, { Component } from 'react';
import withAppContext from '../withAppContext';
import { AppContextPropType } from '../helpers/PropTypeConstants';
import { signInWithUsername } from './backend';
import SignupPage from './SignupPage';
import ChatRoom from './ChatRoom';

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
    this.setError = this.setError.bind(this);
    this.state = { error: undefined };
  }

  async handleSubmitUsername(username) {
    const { appContext } = this.props;
    try {
      await signInWithUsername(username);
      this.setError(null);
      appContext.setUsername(username);
    } catch (e) {
      this.setError(true);
    }
  }

  setError(error) {
    this.setState({ error });
  }

  render() {
    const { appContext } = this.props;
    const { error } = this.state;
    return (
      <>
        {!appContext.username && (
        <SignupPage
          onHandleSubmitUsername={this.handleSubmitUsername}
          error={error}
        />
        )}
        {appContext.username && <ChatRoom />}
      </>

    );
  }
}

export default withAppContext(LandingPage);

LandingPage.propTypes = {
  appContext: AppContextPropType.isRequired,
};
