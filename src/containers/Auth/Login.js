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
    componentDidMount() {
        const token = localStorage.getItem('token');
        if (!token || !this.props.isLoggedIn) {
            this.props.history.push('/login');
        }
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
        this.setState({ errMessage: '' }); // Reset thông báo lỗi
        const { username, password } = this.state;

        // Kiểm tra input
        if (!username || !password) {
            this.setState({ errMessage: 'Vui lòng nhập tên đăng nhập và mật khẩu!' });
            return;
        }

        try {
            // Gọi API để xác thực thông tin
            const response = await handleLoginApi(username, password);

            if (response && response.data) {
                if (response.data.errCode !== 0) {
                    // Lỗi từ server (ví dụ sai mật khẩu)
                    this.setState({ errMessage: response.data.message });
                } else {
                    // Đăng nhập thành công
                    const { token, user } = response.data;

                    // Lưu token vào localStorage để dùng cho các request tiếp theo
                    if (token) {
                        localStorage.setItem('token', token);
                    }

                    // Lưu thông tin user vào Redux store
                    this.props.userLoginSuccess(user);
                }
            } else {
                this.setState({ errMessage: 'Phản hồi không hợp lệ từ server!' });
            }
        } catch (error) {
            console.error('Login error:', error);

            // Kiểm tra lỗi network hoặc phản hồi từ server
            if (error.response) {
                this.setState({ errMessage: error.response.data.message || 'Lỗi từ server!' });
            } else if (error.request) {
                this.setState({ errMessage: 'Không thể kết nối tới server. Vui lòng thử lại!' });
            } else {
                this.setState({ errMessage: 'Đã có lỗi xảy ra. Vui lòng thử lại!' });
            }
        }
    };

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
                        <div className='col-12 text-forgot-password' onClick={() => window.location.href = '/forgot-password'}>
                            <span>Forgot Your Password?</span>
                        </div>
                        <div className='col-12 text-change-password' onClick={() => window.location.href = '/change-password'}>
                            <span>Change Password</span>
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
    // navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    userLoginFail: () => dispatch(actions.userLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
