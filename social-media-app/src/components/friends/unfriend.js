import React, { Component } from 'react'

// mui
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

class Unfriend extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    unFriend = () => {
        // this.props.deletePost(this.props.postId)
        // this.setState({ open: false })
    }

    render() {
        return (
            <>
                <div onClick={this.handleClickOpen}>
                    <Button variant="contained" color='primary' component="span" size='small'>
                        <Typography variant='caption'>
                            Unfriend
                        </Typography>
                    </Button>
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <DialogTitle>
                        <Typography style={{ fontWeight: 'bold' }}>
                            Unfriend {`${this.props.userHandle}`}
                        </Typography>
                    </DialogTitle>
                    <Divider variant='middle' />
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove {`@${this.props.userHandle}`} as your friend?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" style={{ fontWeight: 'bold' }}>
                            CANCEL
                        </Button>
                        <Button onClick={this.unFriend} color="secondary" style={{ fontWeight: 'bold' }}>
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

export default Unfriend
