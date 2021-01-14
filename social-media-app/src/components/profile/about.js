import React, { Component } from 'react';
import dayjs from 'dayjs';

// mui
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import LinkIcon from '@material-ui/icons/Link';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';

const styles = {
    profileItem: {
        width: '100%',
        overflow: 'hidden',
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        '& a': {
            color: '#009688',
            marginLeft: 5,
        },
        '& span': {
            marginLeft: 5,
        }
    },
}

class About extends Component {
    render() {
        let { credentials, classes } = this.props;
        return (
            <div>
                {credentials.location &&
                    <Typography variant='body2' className={classes.profileItem}>
                        <HomeIcon color='primary' />
                        <span>
                            {'Lives In '}
                            {credentials.location}
                        </span>
                    </Typography>}
                <Typography variant='body2' className={classes.profileItem}>
                    <MailOutlineIcon color='primary' />
                    <span >
                        {credentials.email}
                    </span>
                </Typography>

                {credentials.website &&
                    <Typography variant='body2' className={classes.profileItem}>
                        <LinkIcon color="primary" />
                        <a href={credentials.website} target="_blank" rel="noopener noreferrer">
                            {credentials.website}
                        </a>
                    </Typography>}

                <Typography variant='body2' className={classes.profileItem}>
                    <QueryBuilderIcon color='primary' />
                    <span>
                        {'Joined '}
                        {dayjs(credentials.createdAt).format('MMMM YYYY')}
                    </span>
                </Typography>

                {credentials.friends && <Typography variant='body2' className={classes.profileItem}>
                    <RssFeedIcon color='primary' />
                    <span>
                        {'Freind With '}
                        {credentials.friends.length}
                        {' People'}
                    </span>
                </Typography>}
            </div>
        )
    }
}

export default withStyles(styles)(About);
