import React, { Component } from "react";
import Post from '../components/post/post';
import NoPosts from '../components/post/noPosts';
import './home.css';

// components
import FriendsList from '../components/friends/friendsList';


// mui
import Grid from '@material-ui/core/Grid';

// redux
import { connect } from 'react-redux'
import { getPosts } from '../redux/actions/dataActions';

class Home extends Component {
  componentDidMount() {
    this.props.getPosts()
  }

  toShow = () => {
    let { data: { posts }, data: { errors } } = this.props;
    if (errors) {
      if (errors.other) {
        if (errors.other.message) {
          return (
            <div>{errors.other.errMessage}</div>
          )
        } else {
          return (
            <div>
              Loading ...
            </div>
          )
        }
      } else {
        return (
          <div>
            Loading ...
          </div>
        )
      }
    } else if (posts) {
      if (posts.other) {
        if (posts.other.code === 'nothing') {
          return (
            <NoPosts mainText='No Posts' subText='Add more friends to see posts' />
          )
        } else {
          return (
            <div>
              Loading ...
            </div>
          )
        }
      } else if (posts.length > 0) {
        return (
          <>
            {posts.map(post => <Post post={post} key={post.id} />)}
            <NoPosts mainText='No More Posts' subText='Add more friends to see more posts' />
          </>
        )
      } else {
        return (
          <div>
            Loading ...
          </div>
        )
      }
    } else {
      return (
        <div>
          Loading ...
        </div>
      )
    }
  }

  render() {
    let { data: { loadingData }, credentials } = this.props;
    return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={7} xs={11} >
          {!loadingData ?
            this.toShow() :
            '...Loading'
          }
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          {/* <SideProfile /> */}
          <FriendsList credentials={credentials} />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  // UI: state.UI,
  data: state.data,
  credentials: state.user.credentials,
})

const mapActionsToProps = {
  getPosts,
}

export default connect(mapStateToProps, mapActionsToProps)(Home);
