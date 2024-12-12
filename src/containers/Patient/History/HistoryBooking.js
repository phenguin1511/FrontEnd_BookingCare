import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './HistoryBooking.scss';
import HomeFooter from '../../HomePage/HomeFooter';
import * as action from "../../../store/actions";
import { getBookingHistoryByEmail } from '../../../services/userService';
class HistoryBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            bookingHistory: [],
            error: '',
            showGif: false
        };
    }

    handleInputChange = (event) => {
        this.setState({
            email: event.target.value,
            error: '',
        });
    };
    async componentDidMount() {

    }
    handleSearch = async () => {
        const { email } = this.state;
        if (!email) {
            this.setState({ error: 'Vui lòng nhập email!' });
            return;
        }

        let data = { email };
        try {
            let response = await getBookingHistoryByEmail(data);

            console.log("API Response:", response); // Log toàn bộ phản hồi để kiểm tra
            if (response && response.data.errCode === 0) {

                let patientData = response.data.data[0]?.patientData || []; // Đảm bảo luôn có một mảng
                console.log("Patient Data:", patientData); // Log dữ liệu để kiểm tra
                this.setState({
                    bookingHistory: { patientData }, // Cập nhật state
                    error: '',
                    showGif: true
                });
            } else {
                this.setState({
                    bookingHistory: { patientData: [] },
                    error: 'Không tìm thấy lịch khám bệnh nào!',
                    showGif: false
                });
            }
        } catch (err) {
            console.error("API Error:", err); // Log lỗi
            this.setState({
                bookingHistory: { patientData: [] },
                error: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
            });
        }
    };

    handleBack = () => {
        this.props.history.goBack();
    };

    render() {
        const { email, bookingHistory, error, showGif } = this.state;
        console.log(this.state)
        return (
            <div>
                <HomeHeader isShowBanner={false} />
                <div className='history-booking-container'>
                    <div className='history-booking-content'>
                        <h2 className='title'>Lịch Sử Đặt Lịch Khám Bệnh</h2>
                        <div className='input-email-booking'>
                            <input
                                type='email'
                                placeholder='Nhập email của bạn'
                                value={email}
                                onChange={this.handleInputChange}
                            />
                            <button className='btn-confirm' onClick={this.handleSearch}>
                                Xác nhận
                            </button>
                            <button className='btn-back' onClick={this.handleBack}>
                                Quay lại
                            </button>
                        </div>
                        {!showGif && (
                            <div className='gif-container'>
                                <div className="iframe-overlay"></div>
                                <iframe
                                    src="https://giphy.com/embed/xdH0MjQ83lGFVv7gjR"
                                    width="480"
                                    height="480"
                                    frameBorder="0"
                                    className="giphy-embed"
                                    allowFullScreen
                                    title="waiting-gif"
                                    disable
                                ></iframe>
                            </div>
                        )}
                        {error && <p className='error-message'>{error}</p>}
                        {bookingHistory.patientData && bookingHistory.patientData.length > 0 && (
                            <div className='booking-history'>
                                <h3>Kết Quả Lịch Khám:</h3>
                                <table className='table-booking-history'>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Ngày</th>
                                            <th>Giờ</th>
                                            <th>Bác Sĩ</th>
                                            <th>Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookingHistory.patientData.map((booking, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{new Date(parseInt(booking.date)).toLocaleDateString()}</td>
                                                <td>{booking.timeTypeDataPatient?.valueVn || 'N/A'}</td>
                                                <td>{booking.doctorDataBooking?.firstName || 'N/A'} {booking.doctorDataBooking?.lastName || ''}</td>
                                                <td>{booking.statusTypeDataPatient?.valueVn || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className='note-booking-history'>
                            Nếu lịch hẹn của bạn chưa được xác nhận, hãy vui lòng kiểm tra lại email của mình và xác nhận nó để hoàn tất thủ tục đặt lịch khám bệnh!
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchHistoryBooking: (data) => dispatch(action.fetchHistoryBooking(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryBooking);
