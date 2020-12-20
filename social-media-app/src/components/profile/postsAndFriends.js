import React from 'react';
import LoginForm from '../auth/loginForm';

// components
import FriendsList from '../friends/friendsList';
import Post from '../post/post';
import SwipeableViews from 'react-swipeable-views';

// mui
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';

// redux
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: '0 auto 8px auto',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
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
    let { posts, friends } = props;
    return (
        // <Grid container justify="space-around">
            // <Grid item sm={7} md={6} xs={11} >
                <div>
                    <AppBar position="static" color="default" className={classes.root}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            centered
                        >
                            <Tab label="Posts" />
                            <Tab label="Friends" />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex} >
                        <>
                            {value === 0 &&
                                posts.map(post => <Post post={post} key={post.postId} />)
                            }
                        </>
                        <>
                            {value === 1 && <FriendsList friends={friends} />}
                        </>
                    </SwipeableViews>
                </div>
            // </Grid>
        // </Grid>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
})

export default connect(mapStateToProps)(FullWidthTabs);