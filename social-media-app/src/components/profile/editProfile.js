import React, { Component } from 'react';

// mui
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

// mui icons
import EditIcon from '@material-ui/icons/Edit';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

// redux
import { connect } from 'react-redux';
import { editProfile } from '../../redux/actions/userActions';

const styles = {
    mainButton: {
        minWidth: 157,
    },
    avatar: {
        width: 150,
        height: 150,
        margin: '20px auto',
    },
    editImage: {
        position: 'relative',
        left: '55px',
        top: '-60px',
        backgroundColor: '#efefef',
        opacity: .8,
        '&:hover': {
            backgroundColor: '#efefef',
            opacity: .9,
        }
    },
    mediaFile: {
        display: 'none',
    },
};

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            bio: null,
            website: null,
            location: null,
            localFile: null,
            serverFile: null,
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
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

    editProfile = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('bio', this.state.bio)
        formData.append('location', this.state.location)
        formData.append('website', this.state.website)
        formData.append('image', this.state.serverFile)
        this.props.editProfile(formData, this.props.user.credentials.userHandle);
        this.setState({
            open: false,
            localFile: null,
            serverFile: null,
        });
    }

    componentDidMount() {
        let { staticUser: { credentials: { bio, website, location, localFile } } } = this.props;
        this.setState({ bio, website, location, localFile })
    }

    render() {
        let { staticUser: { credentials }, user: { authenticated }, classes } = this.props;
        return (
            <>
                {authenticated ?
                    <>
                        <div onClick={this.handleClickOpen}>
                            <Button color='primary' variant='contained' className={classes.mainButton} startIcon={<EditIcon />}>
                                <Typography variant='caption' >Edit Profile</Typography >
                            </Button>
                        </div>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleClose}
                            fullWidth
                            maxWidth='sm'
                        >
                            <DialogTitle>
                                <Typography style={{ fontWeight: 'bold' }}>Edit Profile</Typography>
                            </DialogTitle>
                            <Divider variant='middle' />
                            <DialogContent>
                                <Typography align='center' component='form' onSubmit={this.editProfile}>
                                    <Avatar alt={credentials.userHandle} className={classes.avatar} src={this.state.localFile ? this.state.localFile : credentials.profilePictureUrl} />
                                    <input
                                        accept="image/*"
                                        className={classes.mediaFile}
                                        id="mediaFile"
                                        name='file'
                                        multiple={false}
                                        type="file"
                                        onChange={this.handleChange}
                                    />
                                    <span>
                                        <label htmlFor="mediaFile">
                                            <IconButton
                                                color='primary'
                                                className={classes.editImage}
                                                size='small'
                                                component="span"
                                            >
                                                <CameraAltIcon />
                                            </IconButton>
                                        </label>
                                    </span>
                                    <TextField
                                        id="bio"
                                        label='Bio'
                                        type='text'
                                        name='bio'
                                        placeholder={`What's on you mind, ${credentials.userHandle} ?`}
                                        multiline
                                        fullWidth
                                        value={this.state.bio ? this.state.bio : ''}
                                        onChange={this.handleChange}
                                        margin='dense'
                                    />
                                    <TextField
                                        id="location"
                                        label='Location'
                                        type='text'
                                        name='location'
                                        placeholder={`What's on you mind, ${credentials.userHandle} ?`}
                                        multiline
                                        fullWidth
                                        value={this.state.location ? this.state.location : ''}
                                        onChange={this.handleChange}
                                        margin='dense'
                                    />
                                    <TextField
                                        id="website"
                                        label='Website'
                                        type='text'
                                        name='website'
                                        placeholder={`What's on you mind, ${credentials.userHandle} ?`}
                                        multiline
                                        fullWidth
                                        value={this.state.website ? this.state.website : ''}
                                        onChange={this.handleChange}
                                        margin='dense'
                                    />
                                    <DialogActions>
                                        <Button onClick={this.handleClose} style={{ fontWeight: 'bold' }}>
                                            CANCEL
                                        </Button>
                                        <Button type='submit' color="primary" style={{ fontWeight: 'bold' }}>
                                            Save
                                        </Button>
                                    </DialogActions>
                                </Typography>
                            </DialogContent>
                        </Dialog>
                    </> : this.props.history.push('/')
                }
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    staticUser: state.user,
    user: state.user,
})

const mapActionsToProps = {
    editProfile,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditProfile));


