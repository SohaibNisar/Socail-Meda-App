import React, { Component } from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Scream from '../components/scream';
import './home.css';

axios.defaults.baseURL = 'https://us-central1-socialmedia-76e8b.cloudfunctions.net/api';

class Home extends Component {
  state = { screams: null }

  componentDidMount() {
    axios.get('/screams').then((res) => {
      this.setState({ screams: res.data })
      console.log(this.state.screams)
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <Grid container justify="space-around" spacing={3}>
        <Grid item sm={7} md={7} xs={11} >
          {this.state.screams ? this.state.screams.map(scream => <Scream scream={scream} key={scream.screamId} />) : 'Loading ...'}
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          Friends
        </Grid>
      </Grid>
    );
  }
}

export default Home;
