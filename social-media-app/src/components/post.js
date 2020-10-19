import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import './post.css';

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
    card: {
        marginBottom: 40,
    },
    media: {
        // height: 0,
        // paddingTop: '56.25%', 
        paddingTop: '100%',
    },
}

class Post extends Component {
    render() {
        dayjs.extend(relativeTime)
        let { classes } = this.props;
        let { post } = this.props;
        // console.log(post)
        return (
            <Card classes={{ root: classes.card }}>
                <CardHeader
                    avatar={
                        <Avatar alt={post.userHandle} src={post.profilePicture} />
                    }
                    action={
                        <IconButton aria-label="settings">
                            <DeleteIcon />
                        </IconButton>
                    }
                    title={
                        <Link
                            to={`/user/${post.userHandle}`}
                            style={{ fontWeight: 'bold', color: '#009688' }}
                        >
                            {post.userHandle}
                        </Link>
                    }
                    subheader={dayjs(post.createdAt).fromNow()}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {post.body}
                    </Typography>
                </CardContent>
                {post.postMedia && <CardMedia
                    className={classes.media}
                    image={post.postMedia}
                    title={post.userHandle}
                />}
            </Card>
        )
    }
}

export default withStyles(styles)(Post);
