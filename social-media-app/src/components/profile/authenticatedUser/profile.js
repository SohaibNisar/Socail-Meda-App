import React, { Component } from 'react';

// commponents
import SideProfile from './sideProfile';
import PostsAndFriends from './postsAndFriends';

// mui 
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    sideSection: {
        position: 'sticky',
        top: '70px',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 90px)',
        '&:hover': {
            '&::-webkit-scrollbar': {
                display: 'unset',
            }
        },
        '&::-webkit-scrollbar': {
            width: '14px',
            display: 'none',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'content-box',
            border: '4px solid transparent',
            borderRadius: '7px',
            boxShadow: 'inset 0 0 0 10px'
        },
        '@media (max-width: 600px)': {
            position: 'unset',
            maxHeight: 'unset',
            overflow: 'unset',
        }
    },
})


class Profile extends Component {
    render() {
        let { classes } = this.props;
        return (
            <Grid container justify='space-evenly' className={classes.root}>
                <Grid item sm={4} md={3} xs={11} className={classes.sideSection}>
                    <SideProfile />
                </Grid>
                <Grid item sm={7} md={8} xs={11} >
                    <PostsAndFriends />
                </Grid>
            </Grid >
        )
    }
}

export default withStyles(styles)(Profile);
