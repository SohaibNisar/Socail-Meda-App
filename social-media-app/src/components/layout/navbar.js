import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

// component
import MyButton from '../../util/myButton';
import UploadPost from '../post/uploadPost';

// mui
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

// mui icons
import HomeIcon from '@material-ui/icons/HomeRounded';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import NotificationIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

let styles = {
    navbarContainer: {
        margin: 'auto',
        padding: 5,
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        borderRadius: 50,
        textAlign: 'center',
    },
    activeNavLink: {
        background: 'teal',
    },
    marginRight: {
        marginRight: 12,
    },
};

class Navbar extends Component {
    state = {
        anchorEl: null
    }

    handleOpen = (e) => {
        this.setState({
            anchorEl: e.currentTarget,
        })
    }

    handleClose = () => {
        this.setState({ anchorEl: null });
    }

    handleLogout = () => {
        this.setState({ anchorEl: null });
        this.props.logout();
    }

    handleProfile = () => {
        this.setState({ anchorEl: null });
        this.props.history.push(`/user/${this.props.credentials.userHandle}`)
    }

    render() {
        let { classes } = this.props;
        return (
            <div>
                <AppBar>
                    <Toolbar variant='dense' className={classes.navbarContainer}>
                        {this.props.authenticated ?
                            <>
                                <NavLink exact activeClassName={classes.activeNavLink} className={classes.navLink} to='/'>
                                    <MyButton tip='Home' content={<HomeIcon />} color='inherit' />
                                </NavLink>
                                <NavLink activeClassName={classes.activeNavLink} className={classes.navLink} to='/friends'>
                                    <MyButton tip='Friends' content={<PeopleAltIcon />} color='inherit' />
                                </NavLink>
                                {this.props.credentials &&
                                    <UploadPost
                                        button={
                                            <MyButton tip='Create a Post' color='inherit' content={<AddIcon />} />
                                        }
                                    />
                                }
                                <MyButton tip='Notifications' content={<NotificationIcon />} color='inherit' />

                                {this.props.credentials &&
                                    <>
                                        <div onClick={this.handleOpen}>

                                            <MyButton tip='View Profile'
                                                content={
                                                    <Avatar alt={this.props.credentials.userHandle} src={this.props.credentials.profilePictureUrl} />
                                                }
                                                color='inherit'
                                                size='small'
                                                style={{ marginLeft: '12px' }}
                                            />
                                        </div>
                                        <Menu
                                            anchorEl={this.state.anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(this.state.anchorEl)}
                                            onClose={this.handleClose}
                                        >
                                            <MenuItem onClick={this.handleProfile}>
                                                <AccountCircleIcon /> Profile
                                            </MenuItem>
                                            <MenuItem onClick={this.handleLogout} >
                                                <ExitToAppIcon /> Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                }
                            </> :
                            <>
                                <NavLink className={`${classes.marginRight} ${classes.navLink}`} to='/' >
                                    Login
                                </NavLink>
                                <NavLink className={`${classes.navLink}`} to='/'>
                                    Signup
                                </NavLink>
                            </>}
                    </Toolbar>
                </AppBar>
            </div >
        )
    }
}

export default withStyles(styles)(withRouter(Navbar));