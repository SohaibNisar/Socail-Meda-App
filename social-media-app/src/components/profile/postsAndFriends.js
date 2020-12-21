import React from 'react';

// components
import SwipeableViews from 'react-swipeable-views';
import FriendsList from '../friends/friendsList';
import Post from '../post/post';
import About from './about';
import AddFriend from '../friends/addFriend';
import EditProfile from './editProfile';

// mui
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto 8px auto',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        '@media (max-width: 600px)': {
            borderRadius: '0 0 4px 4px',
        }
    },
    about: {
        '@media (min-width: 600px)': {
            display: 'none',
        }
    },
    paper: {
        padding: 20,
    },
    tabs: {
        width: '50%',
    },
}));

let FullWidthTabs = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    let { user, user: { authenticated }, credentials: { friends }, posts, credentials } = props;

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
                            No Friends Available
                        </Typography>
                    </Paper>
                )
            }
        } else {
            return (
                <Paper>
                    <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                        No Friends
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
                    return (
                        <AddFriend friendUsesrHandle={credentials.userHandle} />
                    )
                } else {
                    return null
                }
            }
        } else {
            return null
        }
    };

    return (
        <>
            <AppBar position="static" color="default" className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs"
                    className={classes.tabs}
                    centered
                >
                    <Tab label="Posts" />
                    <Tab label="About" className={classes.about} />
                    <Tab label="Friends" />
                </Tabs>
                {toShowButton()}
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
    credentials: state.staticUser.credentials,
    posts: state.staticUser.posts,
    user: state.user,
})

export default connect(mapStateToProps)(FullWidthTabs);