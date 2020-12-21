import React from 'react';

// components
import SwipeableViews from 'react-swipeable-views';
import FriendsList from '../friends/friendsList';
import Post from '../post/post';
import Nothing from '../../util/nothing';

// mui
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


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
    let { posts, friends, user } = props;
    return (
        <>
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
                        posts.length > 0 ?
                        posts.map(post => <Post post={post} user={user} key={post.id} staticUser={true} />) :
                        <Nothing mainText='No Posts' subText='Add more friends to see posts' />
                    }

                </>
                <>
                    {value === 1 && <FriendsList friends={friends} />}
                </>
            </SwipeableViews>
        </>
    );
}


export default FullWidthTabs;