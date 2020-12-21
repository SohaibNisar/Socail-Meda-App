import React, { Component } from "react";
import './home.css';

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
    position: 'fixed',
    top: '70px',
    overflow: 'auto',
    maxHeight: 'calc(100% - 90px)',
    // width: '33.333%',
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
    zIndex: '10',
  },
}

class Home extends Component {

  state = {
    width: null,
  };

  componentDidMount() {
    this.props.getPosts()
    this.setWidth();
  }

  setWidth = () => {
    this.setState({
      width: this.container.offsetWidth,
    });
  }

  toShowPosts = () => {
    let { data: { posts }, data: { errors } } = this.props;
    if (errors) {
      if (errors.other) {
        if (errors.other.message) {
          return (
            <div>{errors.other.errMessage}</div>
          )
        } else {
          return (
            <Nothing mainText='No Posts' subText='Add more friends to see posts' />
          )
        }
      } else {
        return (
          <Nothing mainText='No Posts' subText='Add more friends to see posts' />

        )
      }
    } else if (posts) {
      if (posts.other) {
        if (posts.other.code === 'nothing') {
          return (
            <Nothing mainText='No Posts' subText='Add more friends to see posts' />
          )
        } else {
          return (
            <Nothing mainText='No Posts' subText='Add more friends to see posts' />

          )
        }
      } else if (posts.length > 0) {
        return (
          <>
            {posts.map(post => <Post post={post} key={post.id} />)}
            <Nothing mainText='No More Posts' subText='Add more friends to see more posts' />
          </>
        )
      } else {
        return (
          <Nothing mainText='No Posts' subText='Add more friends to see posts' />
        )
      }
    } else {
      return (
        <Nothing mainText='No Posts' subText='Add more friends to see posts' />
      )
    }
  }

  toShowFriends = () => {
    let { friends } = this.props;
    if (friends) {
      if (friends.length >= 0) {
        return (
          <>
            <FriendsList friends={friends} />
            <Nothing mainText='No More Friends' />
          </>
        )
      } else {
        return (
          <Nothing mainText='No Friends' />
        )
      }
    } else {
      return (
        <Nothing mainText='No Friends' />
      )
    }
  }

  render() {
    let { data: { loadingData }, classes } = this.props;
    let { width } = this.state;
    return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={7} xs={11} >
          {!loadingData ?
            this.toShowPosts() :
            '...Loading'
          }
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' ref={el => (this.container = el)}  >

          {width &&
            <div style={{ width: width }} className={classes.sideFriendList}>
              <Typography align='center' className={classes.title}>
                Friends List
              </Typography>
              <Paper>
                {this.toShowFriends()}
              </Paper>
            </div>
          }
        </Grid>
      </Grid >
    );
  }
}

const mapStateToProps = (state) => ({
  // UI: state.UI,
  data: state.data,
  friends: state.user.credentials.friends,
})

const mapActionsToProps = {
  getPosts,
}

export default connect(mapStateToProps, mapActionsToProps)(withStyle(styles)(Home));
