import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './ForgotPassword.scss';
import { handleForgotPasswordApi } from '../../services/userService';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errMessage: '',
            isLoading: false,
            successMessage: ''
        };
    }

    handleOnChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    handleForgotPassword = async () => {
        const { email } = this.state;
        if (!email) {
            this.setState({ errMessage: 'Please enter your email address.' });
            return;
        }

        this.setState({ isLoading: true, errMessage: '' });

        try {
            const response = await handleForgotPasswordApi(email);
            if (response.data.errCode === 0) {
                this.setState({ successMessage: 'A password reset link has been sent to your email.' });
            } else {
                this.setState({ errMessage: response.data.errMessage });
            }
        } catch (error) {
            console.error('Error while resetting password:', error);
            this.setState({ errMessage: 'An error occurred. Please try again later.' });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { email, errMessage, isLoading, successMessage } = this.state;

        return (
            <div className='login-background'>
                <div className='login-container r'>
                    <div className='login-content row'>
                        <div className='col-12 text-center-login'>Forgot Password</div>
                        <div className='col-12 form-group'>
                            <label>Email</label>
                            <input
                                value={email}
                                onChange={this.handleOnChangeEmail}
                                type='email'
                                className='form-control login-input'
                                placeholder='Enter your email!'
                            />
                        </div>

                        {errMessage && (
                            <div style={{ color: 'red' }} className="error-message">{errMessage}</div>
                        )}

                        {successMessage && (
                            <div style={{ color: 'green' }} className="success-message">{successMessage}</div>
                        )}

                        <div
                            onClick={this.handleForgotPassword}
                            className={`col-12 button-login ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? 'Sending...' : 'Confirm'}
                        </div>
                        <div className='col-12 text-forgot-password'>
                            <button onClick={() => this.props.navigate('/login')}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    userLoginFail: () => dispatch(actions.userLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
