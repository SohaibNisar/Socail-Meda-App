import React, { Component } from 'react';

// components
import About from '../about';

// mui 
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux';

const styles = theme => ({
    profileAvtar1: {
        width: '100%',
        height: '200px',
        margin: '0 auto',
        '@media (max-width: 600px)': {
            display: 'none',
        }
    },
    profileAvtar2: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        margin: '0 auto -50px auto',
        display: 'none',
        '@media (max-width: 600px)': {
            display: 'block',
        },
    },
    bolder: {
        fontWeight: 'bolder !important',
    },
    bold: {
        fontWeight: 'bold !important',
    },
    details: {
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
    paper: {
        padding: 20,
        borderRadius: '0 4px 4px ',
        boxShadow: '0px 0 1px -1px rgba(0,0,0,0.2), 0px 0 1px 0px rgba(0,0,0,0.14), 0px 0 3px 0px rgba(0,0,0,0.12)',
        '@media (max-width: 600px)': {
            paddingTop: 60,
            borderRadius: '4px 4px 0 0 ',
        },
    },
})

class SideProfile extends Component {
    render() {
        let { credentials, classes } = this.props;
        return (
            <div>
                <Avatar variant='square' alt={credentials.userHandle} src={credentials.profilePictureUrl} className={classes.profileAvtar1} />
                <Avatar alt={credentials.userHandle} src={credentials.profilePictureUrl} className={classes.profileAvtar2} />
                <Paper className={classes.paper}>
                    <Typography align='center' variant='h6' className={classes.bolder}>
                        {`@${credentials.userHandle}`}
                    </Typography>
                    {credentials.bio && <Typography align='center' variant='body2' color='textSecondary' gutterBottom>
                        {credentials.bio}
                    </Typography>}
                    <div className={classes.details}>
                        <Typography variant='body1' color='primary' className={classes.bold}>
                            Details
                        </Typography>
                        <Divider />
                        <About credentials={credentials} />
                    </div>
                </Paper>
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
    credentials: state.staticUser.credentials,
})

export default connect(mapStateToProps)(withStyles(styles)(SideProfile));
