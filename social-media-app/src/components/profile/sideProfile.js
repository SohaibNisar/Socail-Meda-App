import React, { Component } from 'react';
import dayjs from 'dayjs';

// mui 
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import LinkIcon from '@material-ui/icons/Link';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';

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
        }
    },
    paper: {
        padding: 20,
        boxShadow: '0px 0 1px -1px rgba(0,0,0,0.2), 0px 0 1px 0px rgba(0,0,0,0.14), 0px 0 3px 0px rgba(0,0,0,0.12)',
    },
    bolder: {
        fontWeight: 'bolder !important',
    },
    bold: {
        fontWeight: 'bold !important',
    },
    profileItem: {
        width: '100%',
        overflow: 'hidden',
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        '& a': {
            color: '#009688'
        }
    },
})


class SideProfile extends Component {
    render() {
        let { credentials ,classes} = this.props;
        return (
            <div>
                <Avatar variant='square' alt="profile image" src={credentials.profilePictureUrl} className={classes.profileAvtar1} />
                <Avatar alt="profile image" src={credentials.profilePictureUrl} className={classes.profileAvtar2} />
                <Paper className={classes.paper}>
                    <Typography align='center' variant='h6' className={classes.bolder}>
                        {`@${credentials.userHandle}`}
                    </Typography>
                    {credentials.bio && <Typography align='center' variant='body2' color='textSecondary' gutterBottom>
                        {credentials.bio}
                    </Typography>}
                    <div>
                        <Typography variant='body1' color='primary' className={classes.bold}>
                            Details
                            </Typography>
                        <Divider />
                    </div>
                    {credentials.location &&
                        <Typography variant='body2' className={classes.profileItem}>
                            <HomeIcon color='primary' />
                            <span>
                                {'\xa0' + 'Lives In' + '\xa0'}
                            </span>
                            <span >
                                {credentials.location}
                            </span>
                        </Typography>}
                    <Typography variant='body2' className={classes.profileItem}>
                        <MailOutlineIcon color='primary' />
                        {'\xa0'}
                        <span >
                            {credentials.email}
                        </span>
                    </Typography>

                    {credentials.website &&
                        <Typography variant='body2' className={classes.profileItem}>
                            <LinkIcon color="primary" />
                            {'\xa0'}
                            <a href={credentials.website} target="_blank" rel="noopener noreferrer">
                                {credentials.website}
                            </a>
                        </Typography>}

                    <Typography variant='body2' className={classes.profileItem}>
                        <QueryBuilderIcon color='primary' />
                        <span>
                            {'\xa0' + 'Joined' + '\xa0'}
                        </span>
                        <span >
                            {dayjs(credentials.createdAt).format('MMMM YYYY')}
                        </span>
                    </Typography>

                    {credentials.friends && <Typography variant='body2' className={classes.profileItem}>
                        <RssFeedIcon color='primary' />
                        <span> Followed By </span>
                        <span>
                            {'\xa0'}
                            {credentials.friends.length}
                            {' People'}
                        </span>
                    </Typography>}
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(SideProfile);
