import React, { Component } from 'react';

// mui
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// redux
import { connect } from 'react-redux';
import { addFriend, cancelRequest, confirmRequest } from '../../redux/actions/friendsActions';

let styles = theme => ({
    confirmBtn: {
        minWidth: 80,
    },
    deleteBtn: {
        minWidth: 80,
    },
    deleteBtnVerticle: {
        marginLeft: 10,
    },
    addBtn: {
        minWidth: 98,
    },
    cancelBtn: {
        minWidth: 136,
        backgroundColor: theme.palette.tertiary.main,
    },
    multiButton: {
        maxWidth: 275,
        display: 'flex',
        justifyContent: 'space-evenly',
    },
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
        let { verticle, user: { credentials: { friendRequestsSent, friendRequestsRecieved }, authenticated }, friendUserHandle, classes } = this.props;

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
                    <>
                        <div className={!verticle ? classes.multiButton : undefined}>
                            <Button variant="contained" size='small' color='primary' className={classes.confirmBtn} onClick={() => this.handleConfirmRequest(friendUserHandle)} >
                                <Typography variant='caption' >Confirm</Typography >
                            </Button >
                            <Button variant="outlined" color='secondary' size='small' className={verticle ? classes.deleteBtnVerticle : classes.deleteBtn} onClick={() => this.handleCancelRequest(friendUserHandle)} >
                                <Typography variant='caption'>Delete</Typography>
                            </Button>
                        </div>
                    </> : !requested ?
                        <Button variant="contained" size='small' color='primary' className={classes.addBtn} onClick={() => this.handleAddFriend(friendUserHandle)} >
                            <Typography variant='caption' >Add Friend</Typography >
                        </Button > :
                        <Button variant="contained" size='small' className={classes.cancelBtn} onClick={() => this.handleCancelRequest(friendUserHandle)} >
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

