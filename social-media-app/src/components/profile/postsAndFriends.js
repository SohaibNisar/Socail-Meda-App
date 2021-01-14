import React from 'react';
import SwipeableViews from 'react-swipeable-views';

// components
import FriendsList from '../friends/friendsList';
import Post from '../post/post';
import About from './about';
import AddFriend from '../friends/addFriend';
import Unfriend from '../friends/unfriend';
import EditProfile from './editProfile';

// mui
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

// redux
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto 8px auto',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        '@media (max-width: 600px)': {
            borderRadius: '0 0 4px 4px',
        },
        '& .MuiTabScrollButton-root': {
            display: 'none',
            width: 25,
            '@media (max-width: 785px)': {
                display: 'inline-flex',
            },
            '@media (max-width: 600px)': {
                display: 'none',
            },
            '@media (max-width: 430px)': {
                display: 'inline-flex',
            },
        },
        // '& .MuiTabScrollButton-root:nth-child(1)': {
        //     width: 25,
        // },
    },
    about: {
        '@media (min-width: 600px)': {
            display: 'none',
        },
    },
    paper: {
        padding: 20,
    },
    button: {
        marginLeft: 'auto',
        marginRight: 10,
        marginBottom: 2,
        '@media (max-width: 600px)': {
            marginRight: 4,
        },
    },
}));

let FullWidthTabs = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    let { user, user: { authenticated }, staticUser: { credentials: { friends }, posts, credentials } } = props;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const toShowPosts = () => {
        if (posts.length > 0) {
            return posts.map(post => <Post post={post} key={post.id} staticUser={true} />)
        } else {
            return (
                <Paper>
                    <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                        No Posts Available
                    </Typography>
                </Paper>
            )
        }
    };

    const toShowFriends = () => {
        if (friends) {
            let index = friends.findIndex(request => request.userHandle === user.credentials.userHandle)
            if (index >= 0) {
                friends.splice(index, 1)
            }
            if (friends.length > 0) {
                return (
                    <Paper>
                        <FriendsList friends={friends} />
                    </Paper>
                )
            } else {
                return (
                    <Paper>
                        <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                            No Friends
                        </Typography>
                    </Paper>
                )
            }
        } else {
            return (
                <Paper>
                    <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                        No Friends Available
                    </Typography>
                </Paper>
            )
        }
    };

    const toShowButton = () => {
        if (authenticated && user) {
            if (user.credentials.userHandle === credentials.userHandle) {
                return <EditProfile />
            } else {
                if (!user.credentials.friends.some(friend => friend.userHandle === credentials.userHandle)) {
                    return <AddFriend friendUserHandle={credentials.userHandle} />
                } else {
                    return <Unfriend friendUserHandle={credentials.userHandle} />
                }
            }
        } else {
            return null
        }
    };

    const tabs = () => {
        return (
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant={!authenticated ? "fullWidth" : "scrollable"}
                aria-label="tabs"
                centered={!authenticated ? true : false}
                scrollButtons='on'
            >
                <Tab label="Posts" />
                <Tab label="About" className={classes.about} />
                <Tab label="Friends" />
            </Tabs>
        )
    }

    return (
        <>
            <AppBar position="static" color="default" className={classes.root}>
                {authenticated ?
                    <Toolbar className={classes.toolBar} variant='dense' disableGutters>
                        {tabs()}
                        <div className={classes.button}>
                            {toShowButton()}
                        </div>
                    </Toolbar> :
                    tabs()
                }
            </AppBar>
            <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex} >
                <>
                    {value === 0 && toShowPosts()}
                </>
                <>
                    {value === 1 &&
                        <Paper className={classes.paper}>
                            <About credentials={credentials} />
                        </Paper>
                    }
                </>
                <>
                    {value === 2 && toShowFriends()}
                </>
            </SwipeableViews>
        </>
    );
}

const mapStateToProps = (state) => ({
    staticUser: state.staticUser,
    user: state.user,
})

export default connect(mapStateToProps)(FullWidthTabs);