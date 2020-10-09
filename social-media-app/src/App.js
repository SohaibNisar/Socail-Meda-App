import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Navbar from './components/navbar';
import {ThemeProvider} from '@material-ui/core/styles/';
import CreateMuiTheme from '@material-ui/core/styles/createMuiTheme';
// import { MuiThemeProvider from '@material-ui/core';
// import teal from '@material-ui/core/colors/teal';

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

let App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Login} />
              <Route path="/friends" component={Login} />
            </Switch>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App;
