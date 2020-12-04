import React, { Component } from 'react';
import dayjs from 'dayjs';

// mui
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyle from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

const style = {
    root2: {
        position: 'fixed',
        top: '70px',
        overflow: 'auto',
        maxHeight: 'calc(100% - 90px)',
        width: '33.333%',
        '&:hover': {
            '&::-webkit-scrollbar': {
                display: 'unset',
            }
        },
        '&::-webkit-scrollbar': {
            width: '14px',
            display: 'none',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'content-box',
            border: '4px solid transparent',
            borderRadius: '7px',
            boxShadow: 'inset 0 0 0 10px'
        },
    },
    title: {
        padding: '10px',
        backgroundColor: '#009688',
        color: '#fff',
        fontWeight: 'bold',
        position: 'sticky',
        top: '0px',
    },
}

class friendsList extends Component {
    render() {
        let { classes, credentials } = this.props;
        return (
            <div className={classes.root}>
                <Paper elevation={2} className={classes.root2}>
                    <Typography align='center' className={classes.title}>
                        Friends List
                </Typography>
                    <div className={classes.list}>
                        <List className={classes.root}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt='profile' src={credentials.profilePicture} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        `@${credentials.userHandle}`
                                    }
                                    secondary={dayjs(credentials.createdAt).format('MMM,DD YYYY')}
                                />
                                <Divider variant="inset" component="li" />
                            </ListItem>
                        </List>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default withStyle(style)(friendsList);
