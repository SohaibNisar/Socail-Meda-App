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
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

// redux
import { connect } from 'react-redux'

const styles = {
    list: {
        width: '100%',
        paddingLeft: 8,
        paddingRight: 8,
        boxSizing: 'border-box',
    },
    inline: {
        display: 'inline',
    },
    towButtons: {
        display: 'block',
        marginTop: 8,
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
    },
}

class RequestList extends Component {
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
                    {friendsToList.map((friend,index) => {
                        return (
                            <React.Fragment key={friend.userHandle} >
                                {<>
                                    <ListItem alignItems="flex-start" button component={Link} to={`/user/${friend.userHandle}`} className={classes.list}>
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
                                                <>
                                                    {dayjs(friend.createdAt).format('MMM DD, YYYY')}
                                                    {!friends.some(friend2 => friend2.userHandle === friend.userHandle) &&
                                                        <span className={classes.towButtons}>
                                                            <AddFriend friendUserHandle={friend.userHandle} />
                                                        </span>
                                                    }
                                                </>

                                            }
                                        />
                                        {friends.some(friend2 => friend2.userHandle === friend.userHandle) &&
                                            <ListItemSecondaryAction>
                                                <Unfriend friendUserHandle={friend.userHandle} />
                                            </ListItemSecondaryAction>
                                        }
                                    </ListItem>
                                    {friendsToList.length - 1 !== index && <Divider variant='middle' component="li" className={classes.divider} />}
                                </>}
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

export default connect(mapStateToProps)(withStyle(styles)(RequestList));
