import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
        }
    }


    handleOnChangeUserName = (event) => {
        this.setState({
            username: event.target.value
        })
        console.log(event.target.value);
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        })
        console.log(event.target.value);
    }
    togglePasswordVisibility = () => {
        this.setState((prevState) => ({
            showPassword: !prevState.showPassword,
        }));
    };


    handleLogin = (event) => {
        console.log('User Name: ' + this.state.username);
        console.log('Password: ' + this.state.password)
    }
    render() {
        return (
            <div className='login-background'>
                <div className='login-container r'>
                    <div className='login-content row'>
                        <div className='col-12 text-center-login'>LOGIN</div>
                        <div className='col-12 form-group'>
                            <label>User Name</label>

                            <input
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUserName(event)}
                                type='text' className='form-control login-input'
                                placeholder='Enter your username!'>
                            </input>
                        </div>
                        <div className='col-12 form-group'>
                            <label>Password</label>
                            <div className='password-wrapper'>
                                <input
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    className='form-control login-input'
                                    placeholder='Enter your password!'
                                />
                                <span
                                    className='toggle-password-icon'
                                    onClick={this.togglePasswordVisibility}
                                >
                                    {this.state.showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>
                        </div>
                        <div onClick={(event) => { this.handleLogin() }} className='col-12 button-login'>
                            LOGIN
                        </div>
                        <div className='col-12 text-forgot-password'>
                            <span>Forgot Your Password?</span>
                        </div>
                        <div className='col-12 text-center'>
                            <div className='social-login'>
                                <span>Or login with:</span>
                                <div className='social-icons'>
                                    <a target='_blank' href='https://www.facebook.com' className='facebook' aria-label='Login with Facebook'>
                                        <i className='fab fa-facebook-f'></i>
                                    </a>
                                    <a target='_blank' href='https://www.google.com' className='google' aria-label='Login with Google'>
                                        <i className='fab fa-google'></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
