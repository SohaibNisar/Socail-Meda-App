import React, { Component } from 'react'

class Sugestion extends Component {
    render() {
        return (
            <div>
                {this.props.suggestedFriends.map(friend => {
                    return (
                        <div key={friend.userHandle}>
                            {friend && friend.userHandle}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Sugestion;
