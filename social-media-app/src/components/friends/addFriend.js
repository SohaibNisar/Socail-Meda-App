import React, { Component } from 'react';

// mui
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// redux
import { connect } from 'react-redux';
import { addFriend, cancelRequest, confirmRequest } from '../../redux/actions/friendsActions';

let styles = theme => ({
    grayButton: {
        backgroundColor: theme.palette.tertiary.main,
    }
})

class AddFriend extends Component {

    handleAddFriend = (userHandle) => {
        this.props.addFriend(userHandle);
    }

    handleCancelRequest = (userHandle) => {
        this.props.cancelRequest(userHandle);
    }

    handleConfirmRequest = (userHandle) => {
        this.props.confirmRequest(userHandle);
    }

    render() {
        let { user: { credentials: { friendRequestsSent, friendRequestsRecieved }, authenticated }, friendUserHandle, classes } = this.props;

        if (!friendRequestsSent) {
            friendRequestsSent = [];
        }
        if (!friendRequestsRecieved) {
            friendRequestsRecieved = [];
        }

        let requested = friendRequestsSent && (friendRequestsSent.some(request => request.userHandle === friendUserHandle));
        let recieved = friendRequestsRecieved && (friendRequestsRecieved.some(request => request.userHandle === friendUserHandle));

        return (
            <>
                {authenticated && (recieved ?
                    <Button variant="contained" size='small' color='primary' style={{ minWidth: 98, }} onClick={() => this.handleConfirmRequest(friendUserHandle)} >
                        <Typography variant='caption' >Confirm</Typography >
                    </Button > : !requested ?
                        <Button variant="contained" size='small' color='primary' style={{ minWidth: 98, }} onClick={() => this.handleAddFriend(friendUserHandle)} >
                            <Typography variant='caption' >Add Friend</Typography >
                        </Button > :
                        <Button variant="contained" size='small' className={classes.grayButton} style={{ minWidth: 136, }} onClick={() => this.handleCancelRequest(friendUserHandle)} >
                            <Typography variant='caption'>Cancel Request</Typography>
                        </Button>
                )}
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
    confirmRequest,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(AddFriend));

