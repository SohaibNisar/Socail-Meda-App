import React, { Component } from 'react'

// commponents
import Sugestions from '../components/friends/sugestions';
import SuggestedUserProfile from '../components/friends/suggestedUserProfile';

// mui
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

// redux
import { connect } from 'react-redux';
import { getSuggestedFriends } from '../redux/actions/friendsActions';

const styles = {
    sugestedFriendList: {
        position: 'sticky',
        top: '70px',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 90px)',
        '&:hover': {
            '&::-webkit-scrollbar': {
                display: 'unset',
            },
            '&::-webkit-scrollbar-thumb': {
                boxShadow: 'inset 0 0 0 10px',
            },
        },
        '&::-webkit-scrollbar': {
            width: 14,
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'content-box',
            border: '4px solid transparent',
            borderRadius: '7px',
            boxShadow: 'transparent 0 0 0 10px',
        },
    },
    sugestedFriendProfile: {
        '@media(max-width: 780px)': {
            display: 'none',
        },
    }
};

class Friends extends Component {

    componentDidMount() {
        this.props.getSuggestedFriends()
    }



    render() {
        let { suggestedFriends, loadingFriends, credentials, classes } = this.props;
        return (

            <Grid container justify="space-around">
                <Grid item sm={6} md={5} xs={11} className={classes.sugestedFriendList}>

                    {suggestedFriends && credentials && !loadingFriends ?
                        <Sugestions suggestedFriends={suggestedFriends} /> : '...Loading'}
                </Grid>
                <Grid item sm={5} md={6} xs={11} className={classes.sugestedFriendProfile}>
                    <SuggestedUserProfile />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    credentials: state.user.credentials,
    suggestedFriends: state.friends.suggestedFriends,
    loadingFriends: state.friends.loadingFriends,
})

const mapActionsToProps = {
    getSuggestedFriends,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Friends));