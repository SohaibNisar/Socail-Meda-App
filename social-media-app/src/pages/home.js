import React, { Component } from "react";
import Post from '../components/post';
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

  render() {
    let { data: { posts } } = this.props
    return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={7} xs={11} >
          {posts ? posts.map(post => <Post post={post} key={post.id} />) : 'Loading ...'}
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          Friends
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  // UI: state.UI,
  data: state.data
})

const mapActionsToProps = {
  getPosts
}

export default connect(mapStateToProps, mapActionsToProps)(Home);
