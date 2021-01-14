import React, { Component } from 'react';

// components
import Profile from '../components/profile/profile';

// redux
import { connect } from 'react-redux';
import { getStaticUserData } from '../redux/actions/staticUserActions';

// components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class User extends Component {
    state = {
        handle: null,
    }

    // componentDidMount() {
    //     let handle = this.props.match.params.handle;
    //     this.setState({ handle });
    //     this.props.getStaticUserData(handle);
    // }

    componentWillReceiveProps(nextProps) {
        let handle = nextProps.match.params.handle;
        if (handle !== this.state.handle) {
            this.setState({ handle });
            this.props.getStaticUserData(handle);
        }
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
    getStaticUserData
}
export default connect(mapStateToProps, mapActionsToProps)(User);
