import React, { Component } from 'react';

// components
import Profile from '../components/profile/profile';
import Navbar from '../components/layout/navbar';

// redux
import { connect } from 'react-redux';
import { getStaticUserData } from '../redux/actions/staticUserActions';

// components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class User extends Component {

    componentDidMount() {
        let handle = this.props.match.params.handle;
        this.props.getStaticUserData(handle)
    }

    toShow = (staticUser) => {
        if (staticUser) {
            if (staticUser.credentials) {
                return <Profile />
            } else {
                return (
                    <Paper>
                        <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                            No Such User Found
                        </Typography>
                    </Paper>
                )
            }
        } else {
            return (
                <Paper>
                    <Typography align='center' style={{ fontWeight: 'bold', padding: '20px' }}>
                        No Such User Found
                    </Typography>
                </Paper>
            )
        }
    }

    render() {
        let { staticUser, authenticated, user } = this.props;
        return (
            <div>
                {!authenticated && <Navbar />}
                {staticUser.loadingStaticUser ? '...Loading' : this.toShow(staticUser, authenticated, user)}
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    staticUser: state.staticUser,
    authenticated: state.user.authenticated,
    user: state.user,
})

const mapActionsToProps = {
    // logout,
    getStaticUserData
}
export default connect(mapStateToProps, mapActionsToProps)(User);
