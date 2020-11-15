import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Home from './pages/home';
import Friends from './pages/friends';
import Login from './pages/loginSignupTabs';
import Navbar from './components/navbar';

import { ThemeProvider } from '@material-ui/core/styles/';
import CreateMuiTheme from '@material-ui/core/styles/createMuiTheme';

import store from './redux/store';
import { connect } from 'react-redux'
import { SET_AUTHENTICATED } from './redux/types';
import { logout } from './redux/actions/userActions';

import './App.css';
// import { MuiThemeProvider from '@material-ui/core';
// import teal from '@material-ui/core/colors/teal';

axios.defaults.baseURL = 'https://us-central1-socialmedia-76e8b.cloudfunctions.net/api';


let theme = CreateMuiTheme({
  palette: {
    // primary: teal,
    primary: {
      main: '#009688',
      light: '#80e8dd',
      dark: '#00857c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#26a69a',
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#fff'
    },
  },
})

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 > Date.now()) {
    store.dispatch({ type: SET_AUTHENTICATED });
  } else {
    logout()
    // store.dispatch({ type: SET_UNAUTHENTICATED });
  }
} else {
  logout()
  // store.dispatch({ type: SET_UNAUTHENTICATED });
}

let App = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          <Navbar authenticated={props.user.authenticated} logout={props.logout} />
          <div className="container">
            <Switch>
              <Route exact path="/" render={() => !props.user.authenticated ? < Redirect to='/auth/login' /> : <Home />} />
              <Route path="/auth/:page?" render={props => <Login {...props} />} />
              <Route path="/friends" render={() => !props.user.authenticated ? < Redirect to='/auth/login' /> : <Friends />} />
            </Switch>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  )
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapActionsToProps = {
  logout
}
export default connect(mapStateToProps, mapActionsToProps)(App);
