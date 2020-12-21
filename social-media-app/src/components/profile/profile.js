import React, { Component } from 'react';

// commponents
import SideProfile from './sideProfile';
import PostsAndFriends from './postsAndFriends';

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
        let { staticUser: { credentials }, staticUser: { posts }, classes } = this.props;
        let { height } = this.state;
        return (
            <Grid container justify='space-evenly' className={classes.root}>
                <Grid item sm={4} md={3} xs={11} className={classes.sideSection} ref={el => (this.container = el)} style={{ top: height ? `calc(100vh - 80px - ${height}px)` : '80px' }}>
                    <SideProfile credentials={credentials} />
                </Grid>
                <Grid item sm={7} md={8} xs={11} >
                    <PostsAndFriends posts={posts} friends={credentials.friends} />
                </Grid>
            </Grid >
        )
    }
}

export default withStyles(styles)(Profile);
