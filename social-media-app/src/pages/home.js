import React, { Component } from "react";
import Post from '../components/post';
import NoFriends from '../components/noFriends';
import NoPosts from '../components/noPosts';
import './home.css';

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
    let { data: { posts }, UI: { errors } } = this.props;
    if (errors) {
      if (errors.other.message) {
        return (
          <div>{errors.other.errMessage}</div>
        )
      }
    } else if (posts) {
      if (posts.code === 'friends') {
        return (
          <NoFriends />
        )
      } else if (posts.code === 'nothing') {
        return (
          <NoPosts />
        )
      } else if (posts.length > 0) {
        return (
          posts.map(post => <Post post={post} key={post.id} />)
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
    // let { } = this.props
    return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={7} xs={11} >
          {this.toShow()}
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          Friends
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  data: state.data
})

const mapActionsToProps = {
  getPosts,
}

export default connect(mapStateToProps, mapActionsToProps)(Home);
