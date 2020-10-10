import React, { Component } from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Post from '../components/post';
import './home.css';

axios.defaults.baseURL = 'https://us-central1-socialmedia-76e8b.cloudfunctions.net/api';

class Home extends Component {
  state = { posts: null }

  componentDidMount() {
    axios.get('/posts').then((res) => {
      this.setState({ posts: res.data })
      console.log(this.state.posts)
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <Grid container justify="space-around" spacing={3}>
        <Grid item sm={7} md={7} xs={11} >
          {this.state.posts ? this.state.posts.map(post => <Post post={post} key={post.postId} />) : 'Loading ...'}
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          Friends
        </Grid>
      </Grid>
    );
  }
}

export default Home;
