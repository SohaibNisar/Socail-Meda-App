import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import './navbar.css';

class Navbar extends Component {
    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar variant='dense' className='navbar-container'>
                        <NavLink exact activeClassName='activeNavLink' className='navLink' to='/'>
                            <Button color='inherit'>
                                Home
                        </Button>
                        </NavLink>
                        <NavLink activeClassName='activeNavLink' className='navLink' to='/auth/signup'>
                            <Button color='inherit'>
                                Sign Up
                        </Button>
                        </NavLink>
                        <NavLink activeClassName='activeNavLink' className='navLink' to='/auth/login'>
                            <Button color='inherit'>
                                Login
                        </Button>
                        </NavLink>
                        <NavLink activeClassName='activeNavLink' className='navLink' to='/friends'>
                            <Button color='inherit'>
                                Friends
                        </Button>
                        </NavLink>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default Navbar