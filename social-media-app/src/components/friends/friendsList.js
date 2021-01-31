import React, { Component } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// components
import Unfriend from './unfriend';
import AddFriend from './addFriend';

// mui
import withStyle from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import MuiLink from '@material-ui/core/Link/Link'
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

// redux
import { connect } from 'react-redux'

const styles = theme => ({
    // item: {
    //     '&:hover': {
    //         backgroundColor: 'unset',
    //     }
    // },
    // itemLink: {
    //     '&:hover': {
    //         backgroundColor: 'unset',
    //     }
    // },
    list: {
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        boxSizing: 'border-box',
    },
    inline: {
        display: 'inline',
    },
    towButtons: {
        paddingLeft: theme.spacing(4),
        marginBotom: 5,
    },
    divider: {
        margin: '15px 16px 6px 16px',
    },
})

class FriendsList extends Component {
    render() {
        let { user, user: { credentials: { friends } }, friendsToList, classes } = this.props;
        if (user && user.authenticated && user.credentials) {
            if (!friendsToList) {
                friendsToList = [];
            }
            if (!friends) {
                friends = [];
            }
            friendsToList = friendsToList.filter(friend => friend.userHandle !== user.credentials.userHandle);
        }
        return (
            <>
                <List className={classes.list} >
                    {friendsToList.map(friend => {
                        return (
                            <React.Fragment key={friend.userHandle} >
                                {<React.Fragment>
                                    <ListItem alignItems="flex-start" button component={Link} to={`/user/${friend.userHandle}`}>
                                        <ListItemAvatar>
                                            <Avatar alt={friend.userHandle} src={friend.profilePictureUrl} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography color='primary' >
                                                    {`@${friend.userHandle}`}
                                                </Typography>
                                            }
                                            secondary={
                                                dayjs(friend.createdAt).format('MMM DD, YYYY')
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            {friends.some(friend2 => friend2.userHandle === friend.userHandle) ?
                                                <Unfriend friendUserHandle={friend.userHandle} /> :
                                                !friends.some(friend2 => friend2.userHandle === friend.userHandle) &&
                                                <div className={classes.towButtons}>
                                                    <Typography
                                                        component="div"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        <AddFriend friendUserHandle={friend.userHandle} />
                                                    </Typography>
                                                </div>
                                            }
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider variant='middle' component="li" className={classes.divider} />
                                </React.Fragment>}
                            </React.Fragment>
                        )
                    })}
                </List >
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

export default connect(mapStateToProps)(withStyle(styles)(FriendsList));
