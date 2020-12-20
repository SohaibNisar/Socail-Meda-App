import React, { Component } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

// components
import Unfriend from './unfriend';

// mui
import withStyle from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

const style = {

    list: {
        width: '100%',
        // maxWidth: 360,
        // backgroundColor: theme.palette.background.paper,
    },
}

class friendsList extends Component {
    render() {
        let { classes, friends } = this.props;

        return (
            <Paper elevation={2} >
                <List className={classes.list}>
                    {friends.map((friend, index) => {
                        return (
                            <span key={friend.userHandle}>
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
                                        <Unfriend userHandle={friend.userHandle} />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {friends.length - 1 !== index && <Divider variant='middle' component="li" />}
                            </span>
                        )
                    })}
                </List>
            </Paper>
        )
    }
}

export default withStyle(style)(friendsList);
