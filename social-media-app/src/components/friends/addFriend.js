import React, { Component } from 'react';

// mui
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux'
import { addFriend, cancelRequest } from '../../redux/actions/friendsActions';

class AddFriend extends Component {

    handleAddFriend = (userHandle) => {
        this.props.addFriend(userHandle);
    }

    handleCancelRequest = (userHandle) => {
        this.props.cancelRequest(userHandle);
    }

    render() {
        let { user: { credentials: { friendRequests } }, friendUserHandle } = this.props;

        if (!friendRequests) {
            friendRequests = [];
        }

        let requested = friendRequests && (friendRequests.some(request => request.userHandle === friendUserHandle));

        return (
            <>
                {!requested ?
                    <Button variant="contained" color='primary' onClick={() => this.handleAddFriend(friendUserHandle)} >
                        <Typography variant='caption' >
                            Add Friend
                         </Typography >
                    </Button > :
                    <Button variant="contained" color='inherit' onClick={() => this.handleCancelRequest(friendUserHandle)} >
                        <Typography variant='caption'>
                            Cancel Request
                        </Typography>
                    </Button>
                }
            </>

        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapActionsToProps = {
    addFriend,
    cancelRequest,
}

export default connect(mapStateToProps, mapActionsToProps)(AddFriend);

