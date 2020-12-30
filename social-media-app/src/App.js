import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import axios from 'axios';
import './App.css';

//components
import Navbar from './components/layout/navbar';
import themeObject from './util/theme';

// pages
import Home from './pages/home';
import Friends from './pages/friends';
import Login from './pages/loginSignupTabs';
import User from './pages/user';

// mui
import { ThemeProvider } from '@material-ui/core/styles/';
import CreateMuiTheme from '@material-ui/core/styles/createMuiTheme';

// redux
import store from './redux/store';
import { connect } from 'react-redux'
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './redux/types';
import { getUserData } from './redux/actions/userActions';

// import { MuiThemeProvider from '@material-ui/core';
// import teal from '@material-ui/core/colors/teal';

axios.defaults.baseURL = 'http://localhost:5000/socialmedia-76e8b/us-central1/api';

let theme = CreateMuiTheme(themeObject)

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 > Date.now()) {
    store.dispatch({ type: SET_AUTHENTICATED });
    store.dispatch(getUserData())
  } else {
    // logout()
    store.dispatch({ type: SET_UNAUTHENTICATED });
  }
} else {
  // logout()
  store.dispatch({ type: SET_UNAUTHENTICATED });
}

let App = (props) => {
  const authenticated = props.user.authenticated;
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          {authenticated && <Navbar authenticated={authenticated} credentials={props.user.credentials} logout={() => { store.dispatch({ type: SET_UNAUTHENTICATED }) }} />}
          <div className="container">
            <Switch>
              {/* <Route exact path="/" render={() => !props.user.authenticated ? < Redirect to='/auth/login' /> : <Home />} />
              <Route path="/auth/:page?" render={props => <Login {...props} />} />
              <Route path="/friends" render={() => !props.user.authenticated ? < Redirect to='/auth/login' /> : <Friends />} /> */}
              {authenticated ?
                <>
                  {<Route exact path='/' component={Home} />}
                  {props.user.credentials && <Route path='/friends' component={Friends} />}
                  {props.user.credentials && <Route exact path='/user/:handle' component={User} authenticated={authenticated} />}
                </> :
                <>
                  <Route exact path='/' component={Login} />
                  <Route exact path='/user/:handle' component={User} authenticated={authenticated} />
                </>
              }
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
  // logout,
  getUserData
}
export default connect(mapStateToProps, mapActionsToProps)(App);
