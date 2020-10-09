import React, { Component } from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import './home.css';
import Scream from '../components/scream';

class Home extends Component {
  state = { screams: null }
  componentDidMount() {
    axios.get('/screams').then((res) => {
      this.setState({ screams: res.data })
      console.log(this.state.screams)
    })
  }
  render() {
    return (
      <Grid container justify="space-around" spacing={3}>
        <Grid item sm={7} md={7} xs={11} >
          {this.state.screams ? this.state.screams.map(scream => <Scream scream={scream} />) : 'Loading ...'}
        </Grid>
        <Grid item sm={4} md={4} className='friend-container' >
          Friends
        </Grid>
      </Grid>
    );
  }
}

export default Home;
