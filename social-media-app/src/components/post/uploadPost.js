import React, { Component } from 'react';

// component
import MyButton from '../../util/myButton';

// mui
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

// redux
import store from '../../redux/store';
import { connect } from 'react-redux';
import { uploadPost } from '../../redux/actions/dataActions';
import { CLEAR_ERRORS, CLEAR_DATA_ERRORS } from '../../redux/types';

const style = (theme) => ({
    dialogTitle: {
        paddingBottom: '0px'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: '4px',
        color: theme.palette.grey[500],
    },
    submitButton: {
        marginBottom: '20px'
    },
    uploadPhoto: {
        margin: '20px 0'
    },
    form: {
        textAlign: 'center',
    },
    mediaFile: {
        display: 'none',
    },
    showImage: {
        position: 'relative',
        display: 'inline-block',
    },
    showImageTag: {
        border: '1px solid gray',
        borderRadius: '10px',
        marginTop: '20px',
        maxWidth: '100%',
    },
    cancleImage: {
        position: 'absolute',
        right: '8px',
        top: '28px',
        color: theme.palette.grey[500],
    },
    circularProgress: {
        position: 'absolute',
    },
})

class UploadPost extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            body: null,
            localFile: null,
            serverFile: null,
            errors: {},
        }
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.UI.errors && nextprops.UI.errors !== this.state.errors) {
            this.setState({
                errors: nextprops.UI.errors,
            })
        }
        if (!nextprops.UI.errors && !nextprops.UI.loading) {
            this.setState({
                open: false,
                body: null,
                localFile: null,
                serverFile: null,
                errors: {},
            });
        }
    }

    handleChange = (e) => {
        if (e.target.name === 'file' && e.target.files.length > 0) {
            this.setState({
                localFile: URL.createObjectURL(e.target.files[0]),
                serverFile: e.target.files[0],
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({
            open: false,
            body: null,
            localFile: null,
            serverFile: null,
            errors: {}
        });
        store.dispatch({ type: CLEAR_ERRORS });
        store.dispatch({ type: CLEAR_DATA_ERRORS });
    }

    cancleImage = () => {
        this.setState({
            localFile: null,
            serverFile: null,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('body', this.state.body)
        formData.append('image', this.state.serverFile)
        this.props.uploadPost(formData)
    }

    render() {
        const { classes, UI: { loading }, userHandle } = this.props;
        return (
            <>
                <div onClick={this.handleClickOpen}>
                    {this.props.button}
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth='sm'
                >
                    <DialogTitle className={classes.dialogTitle} >
                        <Typography color='primary' style={{ fontWeight: 'bold' }}>
                            Create a Post
                        </Typography>
                    </DialogTitle>
                    <div onClick={this.handleClose}>
                        <MyButton tip='Close' content={<CloseIcon />} className={classes.closeButton} />
                    </div>
                    <DialogContent>
                        <form className={classes.form} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <TextField
                                id="body"
                                label={this.state.errors.postBody ? 'Enter Text' : null}
                                type='text'
                                name='body'
                                placeholder={`What's on you mind, ${userHandle} ?`}
                                multiline
                                fullWidth
                                onChange={this.handleChange}
                                helperText={this.state.errors.postBody}
                                focused={this.state.errors.postBody ? true : false}
                                error={this.state.errors.postBody ? true : false}
                            />
                            <input
                                accept="image/*"
                                className={classes.mediaFile}
                                id="mediaFile"
                                name='file'
                                multiple={false}
                                type="file"
                                onChange={this.handleChange}
                            />
                            {this.state.localFile &&
                                <span className={classes.showImage}>
                                    <img src={this.state.localFile} alt='media' className={classes.showImageTag} />
                                    <span>
                                        <IconButton
                                            color='inherit'
                                            className={classes.cancleImage}
                                            size='small'
                                            style={{ backgroundColor: 'white' }}
                                            onClick={this.cancleImage}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </span>
                                </span>
                            }
                            <Typography component='span' display='block' className={classes.uploadPhoto}>
                                <label htmlFor="mediaFile">
                                    <Button variant="contained" color="primary" component="span">
                                        Add a photo
                                    </Button>
                                </label>
                            </Typography>
                            {this.state.errors.uploadPost && (
                                <Typography color="error" className={classes.errorText}>
                                    {this.state.errors.other.uploadPost}
                                </Typography>
                            )}
                            <Button
                                type='submit'
                                variant='outlined'
                                color='primary'
                                disabled={loading && true}
                                className={classes.submitButton}
                            >
                                Post
                                {loading && (
                                    <CircularProgress className={classes.circularProgress} size={25} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    UI: state.UI,
    userHandle: state.user.credentials.userHandle
})

const mapActionsToProps = {
    uploadPost,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(style)(UploadPost));