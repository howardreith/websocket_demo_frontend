import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { AppContext, buildState } from '../../ContextProvider';

export default class TestContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = buildState(this);
  }

  componentDidMount() {
    const { initContextState } = this.props;
    if (initContextState !== {}) {
      this.setState((state) => ({ ...state, ...initContextState }));
    }
  }

  render() {
    const { children } = this.props;
    return (
      <AppContext.Provider value={this.state}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </AppContext.Provider>
    );
  }
}

TestContext.propTypes = {
  initContextState: PropTypes.shape({}),
  initStoreState: PropTypes.shape({}),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

TestContext.defaultProps = {
  initContextState: {},
  initStoreState: {},
};
