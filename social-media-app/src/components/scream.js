import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { Link } from '@material-ui/core';
import './scream.css';

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
    card: {
        marginBottom: 40,
    },
}

class Scream extends Component {
    render() {
        let { classes } = this.props;
        let scream = this.props.scream;
        // console.log(scream)
        return (
            <Card classes={{ root: classes.card }}>
                <CardHeader
                    avatar={
                        <Avatar alt={scream.userHandle} src={scream.profilePicture} />
                    }
                    action={
                        <IconButton aria-label="settings">
                            <DeleteIcon />
                        </IconButton>
                    }
                    title={
                        <Link
                            to={`/user/${scream.userHandle}`}
                            style={{fontWeight:'bold',color:'#009688'}}
                        >
                            {scream.userHandle}
                        </Link>
                    }
                    subheader={scream.createdAt}
                />
                <CardMedia
                    className={classes.media}
                    image="/static/images/cards/paella.jpg"
                    title="Paella dish"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {scream.body}
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

export default withStyles(styles)(Scream);
