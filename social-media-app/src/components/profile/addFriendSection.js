import React, { Component } from 'react';

// components
import AddFriend from '../friends/addFriend';

// mui 
import Paper from '@material-ui/core/Paper/Paper';

class AddFriendSection extends Component {
    render() {
        return (
            <AddFriend friendUserHandle={this.props.friendUserHandle}/>
        )
    }
}

export default AddFriendSection;
