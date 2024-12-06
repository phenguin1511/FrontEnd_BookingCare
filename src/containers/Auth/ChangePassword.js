import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './ChangePassword.scss';
import { handleChangePasswordApi } from '../../services/userService';
import { each } from 'lodash';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            errMessage: '',
            isLoading: false,
            successMessage: '',
            email: ''
        };
    }

    handleOnChangeEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    handleOnChangeCurrentPassword = (event) => {
        this.setState({ currentPassword: event.target.value });
    };

    handleOnChangeNewPassword = (event) => {
        this.setState({ newPassword: event.target.value });
    };

    handleOnChangeConfirmPassword = (event) => {
        this.setState({ confirmPassword: event.target.value });
    };

    handleChangePassword = async () => {
        const { email, currentPassword, newPassword, confirmPassword } = this.state;

        if (!email || !currentPassword || !newPassword || !confirmPassword) {
            this.setState({ errMessage: 'Please fill in all fields.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            this.setState({ errMessage: 'New password and confirmation do not match.' });
            return;
        }

        this.setState({ isLoading: true, errMessage: '' });

        try {
            let data = {
                email: email,
                currentPassword: currentPassword,
                newPassword: newPassword,
            };
            const response = await handleChangePasswordApi(data);
            if (response.data.errCode === 0) {
                this.setState({ successMessage: 'Your password has been successfully changed.' });
            } else {
                this.setState({ errMessage: response.data.errMessage });
            }
        } catch (error) {
            console.error('Error while changing password:', error);
            this.setState({ errMessage: 'An error occurred. Please try again later.' });
        } finally {
            this.setState({ isLoading: false });
        }
    };


    handleBackToLogin = () => {
        this.props.navigate('/login');
    };

    render() {
        const { currentPassword, newPassword, confirmPassword, errMessage, isLoading, successMessage, email } = this.state;

        return (
            <div className='login-background'>
                <div className='login-container r'>
                    <div className='login-content row'>
                        <div className='col-12 text-center-login'>Change Password</div>
                        <div className='col-12 form-group'>
                            <label>Email</label>
                            <input
                                type='email'
                                value={email}
                                onChange={this.handleOnChangeEmail}
                                className='form-control login-input'
                                placeholder='Enter your email'
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label>Current Password</label>
                            <input
                                type='password'
                                value={currentPassword}
                                onChange={this.handleOnChangeCurrentPassword}
                                className='form-control login-input'
                                placeholder='Enter your current password'
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label>New Password</label>
                            <input
                                type='password'
                                value={newPassword}
                                onChange={this.handleOnChangeNewPassword}
                                className='form-control login-input'
                                placeholder='Enter your new password'
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label>Confirm New Password</label>
                            <input
                                type='password'
                                value={confirmPassword}
                                onChange={this.handleOnChangeConfirmPassword}
                                className='form-control login-input'
                                placeholder='Confirm your new password'
                            />
                        </div>

                        {errMessage && (
                            <div style={{ color: 'red' }} className="error-message">{errMessage}</div>
                        )}

                        {successMessage && (
                            <div style={{ color: 'green' }} className="success-message">{successMessage}</div>
                        )}

                        {successMessage ? (
                            <div
                                onClick={this.handleBackToLogin}
                                className='col-12 button-login'
                            >
                                Back To Login
                            </div>
                        ) : (
                            <div
                                onClick={this.handleChangePassword}
                                className={`col-12 button-login ${isLoading ? 'loading' : ''}`}
                            >
                                {isLoading ? 'Changing...' : 'Change Password'}
                            </div>
                        )}

                        <span className='col-12 text-cancel-change-password ' onClick={this.handleBackToLogin}>Cancel</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
