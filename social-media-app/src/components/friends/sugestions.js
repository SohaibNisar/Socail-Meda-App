import React, { Component } from 'react';

// components
import SuggestedFriendsList from '../friends/suggestedFriendsList';

// mui
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux';



class Sugestion extends Component {
    toShowFriends = () => {
        const { suggestedFriends: friends, user } = this.props;
        if (friends) {
            let index = friends.findIndex(request => request.userHandle === user.credentials.userHandle)
            if (index >= 0) {
                friends.splice(index, 1)
            }
            if (friends.length > 0) {
                return (
                    <Paper>
                        <SuggestedFriendsList friends={friends} />
                    </Paper>
                )
            } else {
                return (
                    <Paper>
                        <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                            No Friends For Suggestion
                        </Typography>
                    </Paper>
                )
            }
        } else {
            return (
                <Paper>
                    <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                        No Friends For Suggestion
                    </Typography>
                </Paper>
            )
        }
    };
    render() {
        return (
            <div>
                {this.toShowFriends()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    suggestedFriends: state.friends.suggestedFriends,
})

const mapActionsToProps = {}

export default connect(mapStateToProps, mapActionsToProps)(Sugestion);
