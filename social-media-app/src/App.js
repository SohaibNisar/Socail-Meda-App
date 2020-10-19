import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Home from './pages/home';
import Login from './pages/loginSignupTabs';
import Navbar from './components/navbar';

import { ThemeProvider } from '@material-ui/core/styles/';
import CreateMuiTheme from '@material-ui/core/styles/createMuiTheme';

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

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 > Date.now()) {
    authenticated = true;
  } else {
    authenticated = false;
  }
} else {
  authenticated = false;
}

let App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              {/* <Redirect from='/auth' to='/auth/login' /> */}
              <Route exact path="/" render={props => !authenticated ? < Redirect to='/auth/login' /> : <Home />} />
              <Route path="/auth/:page?" render={props => <Login {...props} authenticated={authenticated} />} />
              {/* <Route path="/signup" component={Login} /> */}
              {/* <Route path="/friends" component={Login} /> */}
            </Switch>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App;
