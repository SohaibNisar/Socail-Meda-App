import React, { Component } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// components
import Unfriend from './unfriend';

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
    },
}

class FriendsList extends Component {
    render() {
        let { user: { credentials: { userHandle } }, friends, classes } = this.props;

        return (
            <List className={classes.list}>
                {friends.map(friend => {
                    return (
                        <span key={friend.userHandle}>
                            {friend.userHandle !== userHandle &&
                                <>
                                    <ListItem button component={Link} to={`/user/${friend.userHandle}`}>
                                        <ListItemAvatar>
                                            <Avatar alt='profile' src={friend.profilePicture} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography color='primary' >
                                                    {`@${friend.userHandle}`}
                                                </Typography>
                                            }
                                            secondary={dayjs(friend.createdAt).format('MMM DD, YYYY')}
                                        />
                                        <ListItemSecondaryAction>
                                            <Unfriend friendUserHandle={friend.userHandle} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider variant='middle' component="li" />
                                </>
                            }
                        </span>
                    )
                })}
            </List>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    friends: state.user.credentials.friends,
})

export default connect(mapStateToProps)(withStyle(styles)(FriendsList));
