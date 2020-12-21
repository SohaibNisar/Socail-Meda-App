import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// components
import MyButton from '../../util/myButton';
import DeletePost from './deletePost';

// mui
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatIcon from '@material-ui/icons/Chat';
import MuiLink from '@material-ui/core/Link/Link';

// redux
import { connect } from "react-redux";
import { likePost, unlikePost } from '../../redux/actions/dataActions';
import { likeStaticUserPost, unlikeStaticUserPost } from '../../redux/actions/staticUserActions';


const styles = {
    card: {
        marginBottom: 40,
    },
    media: {
        // height: 0,
        // paddingTop: '56.25%', 
        // paddingTop: '100%',
        width: 'unset',
        maxWidth: '100%',
        margin: '0 auto 20px auto',
    },
}

class Post extends Component {

    likePost = (postId) => {
        !this.props.staticUser ? this.props.likePost(postId) : this.props.likeStaticUserPost(postId)
    }

    unlikePost = (postId) => {
        !this.props.staticUser ? this.props.unlikePost(postId) : this.props.unlikeStaticUserPost(postId)
    }

    render() {
        dayjs.extend(relativeTime)
        let { classes } = this.props;
        let { post, user: { likes, credentials, authenticated } } = this.props;
        let liked = likes && (likes.some(like => like.postId === post.id));
        let deleteButton = post && credentials ? post.userHandle === credentials.userHandle : false;
        return (
            <Card classes={{ root: classes.card }}>
                <CardHeader
                    avatar={
                        <Avatar alt={post.userHandle} src={post.profilePicture} />
                    }
                    action={
                        authenticated && deleteButton ? <DeletePost postId={post.id} /> : null
                    }
                    title={
                        <Link
                            to={`/user/${post.userHandle}`}
                            style={{ fontWeight: 'bold', color: '#009688' }
                            }
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
                    component="img"
                    className={classes.media}
                    image={post.postMedia}
                    title={post.id}
                />}
                <CardActions disableSpacing>
                    {!authenticated ?
                        <MuiLink component={Link} to='/' >
                            <MyButton
                                tip='Like'
                                content={<FavoriteBorderIcon />}
                                color='primary'
                            />
                        </MuiLink>
                        : liked ?
                            <MyButton
                                tip='Remove Like'
                                content={<FavoriteIcon />}
                                color='primary'
                                onClick={() => this.unlikePost(post.id)}
                            /> :
                            <MyButton
                                tip='Like'
                                content={<FavoriteBorderIcon />}
                                color='primary'
                                onClick={() => this.likePost(post.id)}
                            />
                    }
                    <span>{post.likesCount} Likes</span>
                    <MyButton tip='Comment' content={<ChatIcon />} color='primary' />
                    <span>{post.commentsCount} Comments</span>
                </CardActions>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
})

const mapActionsToProps = {
    // getPosts,
    likePost,
    unlikePost,
    likeStaticUserPost,
    unlikeStaticUserPost,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Post));
