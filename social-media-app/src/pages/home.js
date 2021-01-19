import React, { Component } from "react";

// components
import Post from '../components/post/post';
import Nothing from '../util/nothing';
import FriendsList from '../components/friends/friendsList';


// mui
import Grid from '@material-ui/core/Grid';
import withStyle from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// redux
import { connect } from 'react-redux'
import { getPosts } from '../redux/actions/dataActions';

let styles = {
  sideFriendList: {
    position: 'sticky',
    top: '70px',
    overflow: 'auto',
    maxHeight: 'calc(100vh - 90px)',
    '@media(max-width: 900px)': {
      display: 'none',
    },
    '&:hover': {
      '&::-webkit-scrollbar': {
        display: 'unset',
      },
      '&::-webkit-scrollbar-thumb': {
        boxShadow: 'inset 0 0 0 10px',
      },
    },
    '&::-webkit-scrollbar': {
      width: '14px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'content-box',
      border: '4px solid transparent',
      borderRadius: '7px',
      boxShadow: 'transparent 0 0 0 10px',
    },
  },
  title: {
    padding: '10px',
    backgroundColor: '#009688',
    color: '#fff',
    fontWeight: 'bold',
    position: 'sticky',
    top: '0px',
    zIndex: '10',
    borderBottom: '5px solid'
  },
  marginBottomLarge: {
    marginBottom: 20,
  },
  marginBottomSmall: {
    marginBottom: 3,
  },
}

class Home extends Component {

  componentDidMount() {
    this.props.getPosts()
  }

  toShowPosts = () => {
    let { data: { posts }, data: { errors }, classes } = this.props;
    if (errors) {
      if (errors.other) {
        if (errors.other.message) {
          return (
            <div>{errors.other.errMessage}</div>
          )
        } else {
          return (
            <div className={classes.marginBottomLarge}>
              <Nothing mainText='No Posts Available' subText='Add more friends to see posts' />
            </div>
          )
        }
      } else {
        return (
          <div className={classes.marginBottomLarge}>
            <Nothing mainText='No Posts Available' subText='Add more friends to see posts' />
          </div>
        )
      }
    } else if (posts) {
      if (posts.other) {
        if (posts.other.code === 'nothing') {
          return (
            <div className={classes.marginBottomLarge}>
              <Nothing mainText='No Posts Available' subText='Add more friends to see posts' />
            </div>
          )
        } else {
          return (
            <div className={classes.marginBottomLarge}>
              <Nothing mainText='No Posts Available' subText='Add more friends to see posts' />
            </div>
          )
        }
      } else if (posts.length > 0) {
        return (
          <>
            {posts.map(post => <Post post={post} key={post.id} />)}
            <div className={classes.marginBottomLarge}>
              <Nothing mainText='No More Posts Available' subText='Add more friends to see more posts' />
            </div>
          </>
        )
      } else {
        return (
          <div className={classes.marginBottomLarge}>
            <Nothing mainText='No Posts Available' subText='Add more friends to see posts' />
          </div>
        )
      }
    } else {
      return (
        <div className={classes.marginBottomLarge}>
          <Nothing mainText='No Posts Available' subText='Add more friends to see posts' />
        </div>
      )
    }
  }

  toShowFriends = () => {
    let { user, classes } = this.props;
    if (user.credentials) {
      if (user.credentials.friends && user.credentials.friends.length > 0) {
        return (
          <>
            <FriendsList friends={user.credentials.friends} />
            <div className={classes.marginBottomSmall}>
              <Nothing mainText='No More Friends' size='small' />
            </div>
          </>
        )
      } else {
        return (
          <div className={classes.marginBottomSmall}>
            <Nothing mainText='No Friends' />
          </div>
        )
      }
    } else {
      return (
        <div className={classes.marginBottomSmall}>
          <Nothing mainText='No Friends' />
        </div>
      )
    }
  }

  toShowRequests = () => {
    let { user, classes } = this.props;
    if (user.credentials) {
      if (user.credentials.friendRequestsRecieved && user.credentials.friendRequestsRecieved.length > 0) {
        return (
          <>
            <FriendsList friends={user.credentials.friendRequestsRecieved} />
          </>
        )
      } else {
        return (
          <div className={classes.marginBottomSmall}>
            <Nothing mainText='No Requests' />
          </div>
        )
      }
    } else {
      return (
        <div className={classes.marginBottomSmall}>
          <Nothing mainText='No Requests' />
        </div>
      )
    }
  }

  render() {
    let { data: { loadingData }, loadingUser, user, classes } = this.props;
    return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={7} xs={11} >
          {!loadingData ?
            this.toShowPosts() :
            '...Loading'
          }
        </Grid>
        <Grid item sm={4} md={4} className={classes.sideFriendList}>
          {!loadingUser ?
            <Paper>
              {user.credentials && user.credentials.friendRequestsRecieved && user.credentials.friendRequestsRecieved.length > 0 &&
                <>
                  <Typography align='center' className={classes.title}>
                    Friend Requests
                  </Typography>
                  {this.toShowRequests()}
                </>
              }
              <Typography align='center' className={classes.title}>
                Friends List
              </Typography>
              {this.toShowFriends()}
            </Paper> : '...Loading'
          }
        </Grid>
      </Grid >
    );
  }
}

const mapStateToProps = (state) => ({
  loadingUser: state.user.loading,
  data: state.data,
  user: state.user,
})

const mapActionsToProps = {
  getPosts,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyle(styles)(Home));
