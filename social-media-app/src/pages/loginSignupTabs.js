import React from 'react';
import LoginForm from '../components/auth/loginForm';
import SignUpForm from '../components/auth/signupForm';
import SwipeableViews from 'react-swipeable-views';

// mui
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

// redux
import {connect} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    margin: '0 auto'
  },
}));

let FullWidthTabs = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={6} xs={11} >
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                centered
              >
                <Tab label="Login" />
                <Tab label="Signup" />
              </Tabs>
            </AppBar>
            <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex} >
              <>
                {value === 0 && <LoginForm />}
              </>
              <>
                {value === 1 && <SignUpForm />}
              </>
            </SwipeableViews>
          </div>
        </Grid>
      </Grid>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(FullWidthTabs);