import React, { Component } from 'react';

// commponents
import SideProfile from './sideProfile';
import PostsAndFriends from './postsAndFriends';
import AddFriendSection from './addFriendSection';

// mui 
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    sideSection: {
        height: 'fit-content',
        position: 'sticky',
        '@media (max-width: 600px)': {
            position: 'unset',
        }
    },
})


class Profile extends Component {
    state = {
        height: null,
    };

    componentDidMount() {
        this.setHeight();
    }

    setHeight = () => {
        this.setState({
            height: this.container.offsetHeight,
        });
    }

    render() {
        let { classes } = this.props;
        let { height } = this.state;
        return (
            <Grid container justify='space-evenly' className={classes.root}>
                <Grid item sm={4} md={3} xs={11} className={classes.sideSection} ref={el => (this.container = el)} style={{ top: height ? `calc(100vh - 58px - ${height}px)` : '80px' }}>
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
