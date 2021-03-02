import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import ContextProvider, { AppContext } from './ContextProvider';
import LandingPage from './components/LandingPage';

function renderApplication() {
  return (
    <>
      <BrowserRouter>
        <Route exact path="/">
          <Redirect to="/websocket_demo_frontend" />
        </Route>
        <Route
          exact
          path="/websocket_demo_frontend"
          render={(landingPageProps) => (<LandingPage {...landingPageProps} />)}
        />
      </BrowserRouter>
    </>
  );
}

class App extends Component {
  render() {
    return (
      <ContextProvider>
        <AppContext.Consumer>
          {
            (appContext) => {
              if (appContext) {
                return renderApplication();
              }
              return <></>;
            }
          }
        </AppContext.Consumer>
      </ContextProvider>
    );
  }
}

export default App;
