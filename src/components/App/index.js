import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../../theme';

import Navigation from '../Navigation';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import Applicants from '../Applicants';
import MapScreen from '../MapScreen';

import * as ROUTES from '../../constants/routes';

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navigation />
        <Route
          exact
          path={ROUTES.LANDING}
          render={() => {
            return <Redirect to={ROUTES.HOME} />;
          }}
        />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PATIENTS} component={Applicants} />
        <Route path={ROUTES.MAP_SCREEN} component={MapScreen} />
      </div>
    </ThemeProvider>
  </Router>
);

export default App;
