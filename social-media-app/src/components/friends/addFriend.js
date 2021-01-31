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
        marginLeft: 10,
        backgroundColor: '#fff',
    },
    addBtn: {
        minWidth: 98,
    },
    cancelBtn: {
        minWidth: 136,
        backgroundColor: theme.palette.tertiary.main,
    },
    multiButton: {
        dispaly: 'block',
        maxWidth: 275,
    },
})

class AddFriend extends Component {

    handleAddFriend = (e, userHandle) => {
        e.preventDefault();
        this.props.addFriend(userHandle);
    }

    handleCancelRequest = (e, userHandle) => {
        this.props.cancelRequest(userHandle);
        e.preventDefault();
    }

    handleConfirmRequest = (e, userHandle) => {
        e.preventDefault();
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
                    <>
                        <span className={classes.multiButton}>
                            <Button variant="contained" size='small' color='primary' component='span' className={classes.confirmBtn} onClick={(e) => this.handleConfirmRequest(e, friendUserHandle)} >
                                <Typography variant='caption' >Confirm</Typography >
                            </Button >
                            <Button variant="outlined" color='secondary' size='small' component='span' className={classes.deleteBtn} onClick={(e) => this.handleCancelRequest(e, friendUserHandle)} >
                                <Typography variant='caption'>Delete</Typography>
                            </Button>
                        </span>
                    </> : !requested ?
                        <Button variant="contained" size='small' color='primary' component='span' className={classes.addBtn} onClick={(e) => this.handleAddFriend(e, friendUserHandle)} >
                            <Typography variant='caption' >Add Friend</Typography >
                        </Button > :
                        <Button variant="contained" size='small' component='span' className={classes.cancelBtn} onClick={(e) => this.handleCancelRequest(e, friendUserHandle)} >
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

