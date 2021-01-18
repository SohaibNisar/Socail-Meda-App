import React, { Component } from 'react'

// components
import SideProfile from './sideProfile';
import PostsAndFriends from './postsAndFriends';

// mui
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// mui icons
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

// redux
import { connect } from 'react-redux';

export class SuggestedUserProfile extends Component {

    toShow = () => {
        let { staticUser } = this.props;
        const noProfile =
            <Paper style={{ minHeight: '85.6vh', position: 'relative' }}>
                <div style={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}>
                    <Typography align='center' style={{ fontWeight: 'bold' }}>
                        <PeopleAltIcon style={{ fontSize: 50 }} />
                    </Typography>
                    <Typography align='center' style={{ fontWeight: 'bold' }}>
                        Select People's Names To Preview Their Profile.
                        </Typography>
                </div>
            </Paper>

        if (staticUser) {
            if (staticUser.credentials && staticUser.credentials.userHandle) {
                return (
                    <div>
                        <SideProfile />
                        <PostsAndFriends />
                    </div>
                )
            } else {
                return noProfile;
            }
        } else {
            return noProfile;
        }
    }

    render() {
        let { staticUser, authenticated, user } = this.props;
        return (
            <div>
                {authenticated &&
                    <div>
                        {user.loading ? '...Loading' : staticUser.loadingStaticUser ? '...Loading' : this.toShow()}
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    staticUser: state.staticUser,
    user: state.user,
    authenticated: state.user,
});

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(SuggestedUserProfile);
