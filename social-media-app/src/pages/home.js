import React, { Component } from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Post from '../components/post';
import './home.css';

class Home extends Component {
  constructor(props) {
    super()
    this.state = {
      posts: null,
    }
  }

  componentDidMount() {
    axios.get('/posts').then((res) => {
      this.setState({ posts: res.data })
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <Grid container justify="space-around">
        <Grid item sm={7} md={7} xs={11} >
          {this.state.posts ? this.state.posts.map(post => <Post post={post} key={post.id} />) : 'Loading ...'}
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          Friends
        </Grid>
      </Grid>
    );
  }
}

export default Home;
