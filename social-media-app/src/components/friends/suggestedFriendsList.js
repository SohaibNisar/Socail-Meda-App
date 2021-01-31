import React, { Component } from 'react';
import dayjs from 'dayjs';

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
import { connect } from 'react-redux';
import { getStaticUserData } from '../../redux/actions/staticUserActions';

const styles = {
    list: {
        width: '100%',
        paddingLeft:5,
        paddingRight:5,
        boxSizing:'border-box',
    },
}

class SuggestedFriendsList extends Component {

    toShowButton = (friendUserHandle) => {
        let { user, user: { credentials, authenticated } } = this.props;
        if (friendUserHandle && authenticated && user && credentials) {
            let friends = user.credentials.friends;
            if (!friends) {
                friends = []
            }
            if (!friends.some(friend => friend.userHandle === friendUserHandle)) {
                return <AddFriend friendUserHandle={friendUserHandle} />
            } else {
                return <Unfriend friendUserHandle={friendUserHandle} />
            }

        } else {
            return null
        }
    };

    handleClick = (userHandle) => {
        this.props.getStaticUserData(userHandle);
    }

    render() {
        let { user: { credentials }, friends, classes } = this.props;
        return (
            <List className={classes.list}>
                {friends.map(friend => {
                    return (
                        <React.Fragment key={friend.userHandle}>
                            {friend.userHandle !== credentials.userHandle &&
                                <>
                                    <ListItem button onClick={() => this.handleClick(friend.userHandle)}>
                                        <ListItemAvatar>
                                            <Avatar alt={friend.userHandle} src={friend.profilePictureUrl} />
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
                                            {this.toShowButton(friend.userHandle)}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider variant='middle' component="li" />
                                </>
                            }
                        </React.Fragment>
                    )
                })}
            </List>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapActionsToProps = {
    getStaticUserData
}

export default connect(mapStateToProps, mapActionsToProps)(withStyle(styles)(SuggestedFriendsList));
