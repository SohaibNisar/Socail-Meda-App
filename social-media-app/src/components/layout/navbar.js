import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

// component
import MyButton from '../../util/myButton';
import UploadPost from '../post/uploadPost';

// mui
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import HomeIcon from '@material-ui/icons/HomeRounded';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import NotificationIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

class Navbar extends Component {
    render() {
        return (
            <div>
                <AppBar>
                    <Toolbar variant='dense' className='navbar-container'>
                        {this.props.authenticated ?
                            <>
                                <NavLink exact activeClassName='activeNavLink' className='navLink' to='/'>
                                    <MyButton tip='Home' content={<HomeIcon />} color='inherit' />
                                </NavLink>
                                <NavLink activeClassName='activeNavLink' className='navLink' to='/friends'>
                                    <MyButton tip='Friends' content={<PeopleAltIcon />} color='inherit' />
                                </NavLink>
                                <UploadPost />
                                <MyButton tip='Notifications' content={<NotificationIcon />} color='inherit' />
                                <MyButton tip='Logout' content={<ExitToAppIcon />} onClick={this.props.logout} color='inherit' />
                            </>
                            : <>
                                <NavLink className='navLink' to='/' >
                                    Login
                                </NavLink>
                                <NavLink className='navLink' to='/'>
                                    Signup
                                </NavLink>
                            </>}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default Navbar;