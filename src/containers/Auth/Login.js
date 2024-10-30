import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';



class Login extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        return (
            <div className='login-background'>
                <div className='login-container r'>
                    <div className='login-content row'>
                        <div className='col-12 text-center-login'>LOGIN</div>
                        <div className='col-12 form-group'>
                            <label>User Name</label>
                            <input type='text' className='form-control login-input' placeholder='Enter your username!'></input>
                        </div>
                        <div className='col-12 form-group'>
                            <label>Password</label>
                            <input type='password' className='form-control login-input' placeholder='Enter your password!'></input>
                        </div>
                        <div className='col-12 button-login'>
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
