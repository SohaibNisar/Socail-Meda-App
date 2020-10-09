import React, { Component } from 'react';
import './scream.css';

class Scream extends Component {
    render() {

        let scream = this.props.scream;
        console.log(scream)
        return (
            <div >
                {/* {scream.screamid} */}
            </div>
        )
    }
}

export default Scream;
