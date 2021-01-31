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
import { connect } from 'react-redux';
import { getStaticUserData } from '../../redux/actions/staticUserActions';

const styles = {
    list: {
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        boxSizing: 'border-box',
    },
    divider: {
        marginTop: 5,
        marginBottom: 5,
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
        let { user: { credentials }, friendsToList, suggestionList, lastDivider, classes } = this.props;
        let listProps = {};
        if (!suggestionList) {
            listProps.alignItems = "flex-start";
            listProps.component = Link;
        }
        let setLink = (userHandle) => {
            listProps.to = `/user/${userHandle}`;
        }
        let onClickFunction = (userHandle) => {
            listProps.onClick = ()=>this.handleClick(userHandle);
        }
        return (
            <List className={classes.list}>
                {friendsToList.map((friend, index) => {
                    return (
                        <React.Fragment key={friend.userHandle}>
                            {friend.userHandle !== credentials.userHandle &&
                                <>
                                    {!suggestionList ?
                                        setLink(friend.userHandle) :
                                        onClickFunction(friend.userHandle)
                                    }
                                    <ListItem button  {...listProps}>
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
                                    {!lastDivider ?
                                        friendsToList.length - 1 !== index && <Divider variant='middle' component="li" className={classes.divider} /> :
                                        <Divider variant='middle' component="li" className={classes.divider} />
                                    }
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
