import React, { Component } from 'react'

// commponents
import Sugestions from '../components/friends/sugestions';

// mui
import Grid from '@material-ui/core/Grid';

// redux
import { connect } from 'react-redux';
import { getSuggestedFriends } from '../redux/actions/friendsActions';

class Friends extends Component {

    componentDidMount() {
        this.props.getSuggestedFriends()
    }

    render() {
        let { suggestedFriends, loadingFriends } = this.props;
        return (

            <Grid container justify="space-around">
                <Grid item sm={4} md={4} xs={11} >
                    {suggestedFriends && !loadingFriends ?
                        <Sugestions suggestedFriends={suggestedFriends} /> : '...Loading'}
                </Grid>
                <Grid item sm={7} md={7} className='friend-container' >
                    Profile
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    // UI: state.UI,
    // data: state.data,
    userHandle: state.user.credentials.userHandle,
    suggestedFriends: state.friends.suggestedFriends,
    loadingFriends: state.friends.loadingFriends,
})

const mapActionsToProps = {
    getSuggestedFriends,
}

export default connect(mapStateToProps, mapActionsToProps)(Friends);