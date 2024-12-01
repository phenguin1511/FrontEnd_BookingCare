import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { handleLoginApi } from '../../services/userService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            errMessage: ''
        };
    }

    handleOnChangeUserName = (event) => {
        this.setState({
            username: event.target.value
        });
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    }

    togglePasswordVisibility = () => {
        this.setState((prevState) => ({
            showPassword: !prevState.showPassword,
        }));
    };

    handleLogin = async () => {
        this.setState({ errMessage: '' });
        const { username, password } = this.state;

        if (!username || !password) {
            this.setState({ errMessage: 'Vui lòng nhập tên đăng nhập và mật khẩu!' });
            return;
        }

        try {
            const response = await handleLoginApi(username, password);

            // Kiểm tra errCode trong phản hồi
            if (response.data.errCode !== 0) {
                this.setState({ errMessage: response.data.errMessage });
            } else {
                // Nếu đăng nhập thành công
                this.props.userLoginSuccess(response.data.user); // Đảm bảo rằng response.data.user chứa thông tin người dùng hợp lệ
            }
        } catch (error) {
            console.log(error);
            this.setState({ errMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại!' });
        }

    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin(); // Gọi hàm đăng nhập
        }
    };

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
                                onChange={this.handleOnChangeUserName}
                                type='text' className='form-control login-input'
                                placeholder='Enter your username!'
                                onKeyDown={this.handleKeyDown}
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label>Password</label>
                            <div className='password-wrapper'>
                                <input
                                    value={this.state.password}
                                    onChange={this.handleOnChangePassword}
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    className='form-control login-input'
                                    placeholder='Enter your password!'
                                    onKeyDown={this.handleKeyDown}
                                />
                                <span className='toggle-password-icon' onClick={this.togglePasswordVisibility}>
                                    {this.state.showPassword ? '🙈' : '👁️'}
                                </span>
                            </div>
                        </div>

                        {this.state.errMessage && (
                            <div style={{ color: 'red' }} className="error-message">{this.state.errMessage}</div>
                        )}
                        <div onClick={this.handleLogin} className='col-12 button-login'>
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

const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    userLoginFail: () => dispatch(actions.userLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
