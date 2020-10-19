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
        marginBottom: 15,
        position: 'relative',
    },
    errorText: {
        marginTop: 15,
    },
    circularProgress: {
        position: 'absolute',
    },

}

class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            email: null,
            password: null,
            loading: false,
            errors: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })

        const userData = {
            email: this.state.email,
            password: this.state.password,
        }

        axios.post('/login', userData)
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
                <Typography variant='h5'>Login</Typography>
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
                            {this.state.errors.general ? (
                                <Typography color="error" className={classes.errorText}>
                                    Wrong credentials please try again
                                </Typography>
                            ) : this.state.errors.other && (
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
                                Login
                                {this.state.loading && (
                                    <CircularProgress className={classes.circularProgress} size={25} />
                                )}
                            </Button>
                            <Typography variant='body2' component={'span'} display='block'>
                                Dont have an account ? sign up <Link to='/auth/signup'>
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

export default withStyles(styles)(withRouter(LoginForm));
