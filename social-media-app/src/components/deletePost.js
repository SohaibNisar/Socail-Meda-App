import React, { Component } from 'react';

// component
import MyButton from '../util/myButton';

// mui
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux';
import { deletePost } from '../redux/actions/dataActions'

class DeletePost extends Component {
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

    deletePost = () => {
        this.props.deletePost(this.props.postId)
        this.setState({ open: false })
    }
    render() {
        return (
            <>
                <div onClick={this.handleClickOpen}>
                    <MyButton tip='Delete Post' color='secondary' content={<DeleteOutlineIcon />} />
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <Typography color='secondary' style={{ fontWeight: 'bold' }}>
                        <DialogTitle>
                            Delete Post
                        </DialogTitle>
                    </Typography>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this post ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" style={{ fontWeight: 'bold' }}>
                            CANCEL
                        </Button>
                        <Button onClick={this.deletePost} color="secondary" style={{ fontWeight: 'bold' }}>
                            DELETE
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapActionsToProps = {
    deletePost,
}

export default connect(mapStateToProps, mapActionsToProps)(DeletePost);