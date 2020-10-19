import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
import axios from 'axios';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    root: {
        textAlign: 'center',
        marginTop: 25,
    },
    form: {
        marginTop: 5,
        marginBottom: 20,
    },
    button: {
        marginTop: 15,
        position: 'relative',
        marginBottom: 15,
    },
    errorText: {
        marginTop: 15,
    },
    circularProgress: {
        position: 'absolute',
    },
}

class SignUpForm extends Component {
    constructor() {
        super()
        this.state = {
            email: null,
            password: null,
            confirmPassword: null,
            userHandle: null,
            loading: false,
            errors: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })

        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            userHandle: this.state.userHandle,
        }

        axios.post('/Signup', newUserData)
            .then((res) => {
                localStorage.setItem('FBIdToken',`Bearer ${res.data.token}`);
                this.setState({
                    loading: true
                })
                this.props.history.push('/')
            })
            .catch(error => {
                this.setState({
                    errors: error.response.data,
                    loading: false
                })
            })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        let { classes } = this.props;
        return (
            <div className={classes.root}>
                <Typography variant='h5'>Signup</Typography>
                <Grid container justify="center" alignItems="center">
                    <Grid item sm={8} md={7} xs={11} >
                        <form className={classes.form} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <TextField
                                id="email"
                                label="Email"
                                type='email'
                                name='email'
                                placeholder="Enter your email"
                                multiline
                                fullWidth
                                onChange={this.handleChange}
                                margin="dense"
                                helperText={this.state.errors.email}
                                error={this.state.errors.email ? true : false}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type='password'
                                name='password'
                                placeholder="Enter your password"
                                multiline
                                fullWidth
                                onChange={this.handleChange}
                                margin="normal"
                                helperText={this.state.errors.password}
                                error={this.state.errors.password ? true : false}
                            />
                            <TextField
                                id="confirmPassword"
                                label="Confirm Password"
                                type='password'
                                name='confirmPassword'
                                placeholder="Confirm your password"
                                multiline
                                fullWidth
                                onChange={this.handleChange}
                                margin="normal"
                                helperText={this.state.errors.confirmPassword}
                                error={this.state.errors.confirmPassword ? true : false}
                            />
                            <TextField
                                id="userHandle"
                                label="User Handle"
                                type='text'
                                name='userHandle'
                                placeholder="Enter user handle"
                                multiline
                                fullWidth
                                onChange={this.handleChange}
                                margin="normal"
                                helperText={this.state.errors.userHandle}
                                error={this.state.errors.userHandle ? true : false}
                            />
                            {this.state.errors.other && (
                                <Typography color="error" className={classes.errorText}>
                                    {this.state.errors.other.errMessage}
                                </Typography>
                            )}
                            <Button
                                type='submit'
                                variant='outlined'
                                color='primary'
                                disabled={this.state.loading && true}
                                className={classes.button}
                            >
                                Signup
                                {this.state.loading && (
                                    <CircularProgress className={classes.circularProgress} size={25} />
                                )}
                            </Button>
                            <Typography variant='body2' component={'span'} display='block'>
                                Already have an account ? login <Link to='/auth/login'>
                                    <Typography color='primary' display='inline'>
                                        here
                                    </Typography>
                                </Link>
                            </Typography>
                        </form>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(SignUpForm));
