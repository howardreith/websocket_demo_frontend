import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

export const AppContext = React.createContext(null, null);

export function buildState(_this) {
  return {
    username: null,

    setUsername: (username, cb) => {
      _this.setState((state) => ({ ...state, username }), cb);
    },
  };
}

export default class ContextProvider extends Component {
  constructor(props) {
    super(props);

    this.state = buildState(this);
  }

  render() {
    const { children } = this.props;
    return (
      <AppContext.Provider value={this.state}>
        {children}
      </AppContext.Provider>
    );
  }
}

ContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
