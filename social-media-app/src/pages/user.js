import React, { Component } from 'react';
import { withRouter } from "react-router";

// components
import Navbar from '../components/layout/navbar';
import Profile from '../components/profile/authenticatedUser/profile';

// mui
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// redux
import store from '../redux/store';
import { connect } from 'react-redux';
import { getStaticUserData } from '../redux/actions/staticUserActions';
import { UNSET_STATIC_USER } from '../redux/types';

class User extends Component {
    state = {
        handle: null,
    }

    componentDidMount() {
        let handle = this.props.match.params.handle;
        this.setState({ handle });
        this.props.getStaticUserData(handle);
    }

    componentWillReceiveProps(nextProps) {
        let handle = nextProps.match.params.handle;
        if (handle !== this.state.handle) {
            this.setState({ handle });
            this.props.getStaticUserData(handle);
        }
    }

    componentWillUnmount() {
        store.dispatch({ type: UNSET_STATIC_USER });
    }

    toShow = (staticUser) => {
        if (staticUser) {
            if (staticUser.credentials && staticUser.credentials.userHandle) {
                return <Profile key={this.state.handle} />
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
                {authenticated ?
                    <div>
                        {user.loading ? '...Loading' : staticUser.loadingStaticUser ? '...Loading' : this.toShow(staticUser)}
                    </div> :
                    <div>
                        <Navbar/>
                        {staticUser.loadingStaticUser ? '...Loading' : this.toShow(staticUser)}
                    </div>
                }
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
    getStaticUserData,
}

export default connect(mapStateToProps, mapActionsToProps)(withRouter(User));
