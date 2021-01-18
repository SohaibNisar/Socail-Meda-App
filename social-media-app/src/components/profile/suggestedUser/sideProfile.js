import React, { Component } from 'react';
import { Link } from "react-router-dom";
// mui 
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// redux
import { connect } from 'react-redux';

const styles = theme => ({
    profileAvtar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        margin: '0 auto -50px auto',
        display: 'block',
    },
    bolder: {
        fontWeight: 'bolder !important',
    },
    bold: {
        fontWeight: 'bold !important',
    },
    paper: {
        padding: 20,
        boxShadow: '0px 0 1px -1px rgba(0,0,0,0.2), 0px 0 1px 0px rgba(0,0,0,0.14), 0px 0 3px 0px rgba(0,0,0,0.12)',
        paddingTop: 60,
        borderRadius: '4px 4px 0 0 ',
    },
})

class SideProfile extends Component {
    render() {
        let { credentials, classes } = this.props;
        return (
            <div>
                <Avatar alt={credentials.userHandle} src={credentials.profilePictureUrl} className={classes.profileAvtar} />
                <Paper className={classes.paper}>
                    <Link to={`/user/${credentials.userHandle}`} style={{color:'black'}}>
                        <Typography align='center' variant='h6' className={classes.bolder}>
                            {`@${credentials.userHandle}`}
                        </Typography>
                    </Link>
                    {credentials.bio && <Typography align='center' variant='body2' color='textSecondary' gutterBottom>
                        {credentials.bio}
                    </Typography>}
                </Paper>
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
    credentials: state.staticUser.credentials,
})

export default connect(mapStateToProps)(withStyles(styles)(SideProfile));
