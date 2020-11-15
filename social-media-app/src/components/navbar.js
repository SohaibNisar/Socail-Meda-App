import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import './navbar.css';

const styles = {
    logoutButton: {
        color: '#ddd !important',
        borderColor: '#ddd !important',
    },
}

class Navbar extends Component {
    render() {
        let { classes } = this.props;
        return (
            <div>
                <AppBar>
                    <Toolbar variant='dense' className='navbar-container'>
                        <NavLink exact activeClassName='activeNavLink' className='navLink' to='/'>
                            <Button color='inherit'>
                                Home
                            </Button>
                        </NavLink>
                        <NavLink activeClassName='activeNavLink' className='navLink' to='/auth/login'>
                            <Button color='inherit'>
                                Login
                            </Button>
                        </NavLink>
                        <NavLink activeClassName='activeNavLink' className='navLink' to='/auth/signup'>
                            <Button color='inherit'>
                                Sign Up
                            </Button>
                        </NavLink>
                        <NavLink activeClassName='activeNavLink' className='navLink' to='/friends'>
                            <Button color='inherit'>
                                Friends
                            </Button>
                        </NavLink>
                        <Button className={!this.props.authenticated ? classes.logoutButton : null} color='inherit' variant="outlined" disabled={!this.props.authenticated} onClick={this.props.logout}>
                            logout
                        </Button>

                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(Navbar);