import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { verifyBookingAppointment } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        };
    }



    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let doctorId = urlParams.get('doctorId');
            let token = urlParams.get('token');
            let res = await verifyBookingAppointment({
                token: token,
                doctorId: doctorId
            })
            console.log(res)
            if (res && res.data.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.data.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.data.errCode ? res.data.errCode : -1
                })
            }
        }



    }

    async componentDidUpdate(prevProps) {

    }
    navigateToHome = () => {
        this.props.history.push('/home'); // Điều hướng về HomePage
    };

    render() {
        const { statusVerify, errCode } = this.state
        console.log(this.state)
        return (
            <Fragment>
                <HomeHeader />
                {statusVerify === false ?
                    <div>
                        Loading Data....
                    </div> : <div>
                        {+errCode === 0 ?
                            <div className='success-verify'>
                                <div className='success-title-verify'>
                                    <div className='img-verify' style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/2024/11/27/094153-404.png)` }}></div>
                                    <h3 className='title-verify-success'>Xác nhận thành công</h3>
                                    <p>Bạn có thể: </p>
                                    <ul className='notifications'>
                                        <li>Quay lại Trang chủ để khám phá thêm.</li>
                                        <li>Tìm kiếm thông tin đặt lịch mới.</li>
                                    </ul>
                                    <button
                                        className="btn-home-verify"
                                        onClick={this.navigateToHome}
                                    >
                                        Về Trang chủ
                                    </button>
                                    <p>Cảm ơn bạn đã ghé thăm!</p>
                                </div>
                            </div>
                            : <div className='failed-verify'>
                                <div className='failed-title-verify'>
                                    <div className='img-verify' style={{ backgroundImage: `url(https://cdn.bookingcare.vn/fo/2024/11/27/094153-404.png)` }}></div>
                                    <h3 className='title-verify-failed'> Rất tiếc, lịch hẹn đã được đặt hoặc đã tồn tại</h3>
                                    <p>Bạn có thể: </p>
                                    <ul className='notifications'>
                                        <li>Quay lại Trang chủ để khám phá thêm.</li>
                                        <li>Tìm kiếm thông tin đặt lịch mới.</li>
                                    </ul>
                                    <button
                                        className="btn-home-verify"
                                        onClick={this.navigateToHome}
                                    >
                                        Về Trang chủ
                                    </button>
                                    <p>Cảm ơn bạn đã ghé thăm!</p>
                                </div>
                            </div>
                        }
                    </div>
                }

            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(VerifyEmail);
