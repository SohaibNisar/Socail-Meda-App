import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import axios from 'axios';
import './App.css';

//components
import Navbar from './components/layout/navbar';
import themeObject from './util/theme';
import NoMatch from './components/auth/noMatch';

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

axios.defaults.baseURL = "https://us-central1-socialmedia-76e8b.cloudfunctions.net/api";

let theme = CreateMuiTheme(themeObject)

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 > Date.now()) {
    store.dispatch({ type: SET_AUTHENTICATED });
    store.dispatch(getUserData())
  } else {
    store.dispatch({ type: SET_UNAUTHENTICATED });
  }
} else {
  store.dispatch({ type: SET_UNAUTHENTICATED });
}

let App = (props) => {
  const authenticated = props.user.authenticated;
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          {props.user.authenticated && <Navbar authenticated={authenticated} credentials={props.user.credentials} logout={() => { store.dispatch({ type: SET_UNAUTHENTICATED }) }} />}
          <div className="container">
            {authenticated ?
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/friends' component={Friends} />
                <Route path='/user/:handle' component={User} />
                <Route component={NoMatch} />
              </Switch> :
              <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/user/:handle' component={User} />
                <Route path="*">
                  <Redirect to='/' />
                </Route>
              </Switch>
            }
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
  getUserData
}
export default connect(mapStateToProps, mapActionsToProps)(App);
