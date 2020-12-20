import React, { Component } from 'react';

// components
import Profile from '../components/profile/profile';
import Navbar from '../components/layout/navbar';

// redux
import { connect } from 'react-redux';
import { getStaticUserData } from '../redux/actions/staticUserActions';

class User extends Component {

    componentDidMount() {
        let handle = this.props.match.params.handle;
        this.props.getStaticUserData(handle)
    }

    toShow = (staticUser, authenticated) => {
        if (staticUser) {
            if (staticUser.credentials) {
                return <Profile staticUser={staticUser} authenticated={authenticated} />
            } else {
                return 'Loading...'
            }
        } else {
            return 'Loading...'
        }
    }

    render() {
        let { staticUser, authenticated } = this.props;
        return (
            <div>
                {!authenticated && <Navbar />}
                {staticUser.loadingStaticUser ? '...Loading' : this.toShow(staticUser, authenticated)}
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    staticUser: state.staticUser,
    authenticated: state.user.authenticated
})

const mapActionsToProps = {
    // logout,
    getStaticUserData
}
export default connect(mapStateToProps, mapActionsToProps)(User);
