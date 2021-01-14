import React, { Component } from 'react'
// components
import Profile from '../profile/profile';

// mui
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// mui icons
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

// redux
import { connect } from 'react-redux';

export class SuggestedUserProfile extends Component {

    toShow = (staticUser) => {
        if (staticUser) {
            if (staticUser.credentials && staticUser.credentials.userHandle) {
                return <Profile/>
            } else {
                return (
                    <Paper style={{ minHeight: '85.6vh', position: 'relative' }}>
                        <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}>
                            <Typography align='center' style={{ fontWeight: 'bold' }}>
                                <PeopleAltIcon style={{ fontSize: 50 }} />
                            </Typography>
                            <Typography align='center' style={{ fontWeight: 'bold' }}>
                                Select people's names to preview their profile.
                        </Typography>
                        </div>
                    </Paper>
                )
            }
        } else {
            return (
                <Paper>
                    <Typography align='center' style={{ fontWeight: 'bold', paddingTop: '20px' }}>
                        <PeopleAltIcon style={{ fontSize: 50 }} />
                    </Typography>
                    <Typography align='center' style={{ fontWeight: 'bold', paddingBottom: '20px' }}>
                        Select people's names to preview their profile.
                </Typography>
                </Paper>
            )
        }
    }
    render() {
        let { staticUser, authenticated, user } = this.props;
        return (
            <div>
                {authenticated ?
                    <div>
                        {user.loading ? '...Loading' : staticUser.loadingStaticUser ? '...Loading' : this.toShow(staticUser)}
                    </div> :
                    <div>
                        {staticUser.loadingStaticUser ? '...Loading' : this.toShow(staticUser)}
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    staticUser: state.staticUser,
    user: state.user,
    // credentials: state.user.credentials,
    authenticated: state.user,
    // suggestedFriends: state.friends.suggestedFriends,
    // loadingFriends: state.friends.loadingFriends,
})

const mapActionsToProps = {
    // getSuggestedFriends,
}

export default connect(mapStateToProps, mapActionsToProps)(SuggestedUserProfile);
