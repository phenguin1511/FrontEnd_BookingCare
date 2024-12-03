import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from 'reactstrap';
import { LANGUAGES } from '../../../../utils';
import ProfileDoctor from '../ProfileDoctor';
import * as actions from "../../../../store/actions";
import Select from 'react-select'
import { toast } from 'react-toastify';
import _ from 'lodash'
import { postPatientBookingAppointment } from '../../../../services/userService';
class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientName: '',
            patientPhone: '',
            patientEmail: '',
            patientYearOfBirth: '',
            patientCity: '',
            patientDistrict: '',
            patientReason: '',
            patientGender: '',
            genderData: [],
        };
    }

    async componentDidMount() {
        this.props.fetchGenderStart()
        let doctorId = this.props.dataScheduleModal.doctorId
        this.setState({
            doctorId: doctorId,
            date: this.props.dataScheduleModal.date,
            timeType: this.props.dataScheduleModal.timeType
        })
    }
    builDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVn : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
            return result
        }
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language || prevProps.genders !== this.props.genders) {
            if (this.props.genders && this.props.genders.length > 0) {
                this.setState({
                    genders: this.builDataGender(this.props.genders)
                });
            }
        }
        if (prevProps.dataScheduleModal !== this.props.dataScheduleModal) {
            if (this.props.dataScheduleModal && !_.isEmpty(this.props.dataScheduleModal)) {
                const { doctorId, timeType, date } = this.props.dataScheduleModal;
                this.setState({
                    doctorId,
                    timeType,
                    date
                });
            }
        }
    }
    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };
    handleInputChangeGenders = (selectedOption) => {
        this.setState({
            patientGender: selectedOption
        })
    }
    handleToggle = () => {
        this.props.handleCloseModal(); // Gọi hàm từ props để thay đổi trạng thái isOpen
    };

    formatDate = (timestamp, time) => {
        const date = new Date(parseInt(timestamp));
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const dayOfWeek = date.toLocaleDateString(
            this.props.language === LANGUAGES.VI ? 'vi-VN' : 'en-US',
            { weekday: 'long' }
        );

        if (this.props.language === LANGUAGES.VI) {
            return `${time} ${day}/${month}/${year} ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`;
        } else {
            return `${time} ${month}/${day}/${year} ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`;
        }
    };

    builDoctorName = () => {
        const { dataScheduleModal, language } = this.props;
        if (dataScheduleModal && !_.isEmpty(dataScheduleModal)) {
            let name = language === LANGUAGES.VI ? `${dataScheduleModal.doctorData.lastName} ${dataScheduleModal.doctorData.firstName}` : `${dataScheduleModal.doctorData.lastName} ${dataScheduleModal.doctorData.firstName}`
            return name;
        }
    }

    builDateString = (dateInput) => {
        const date = new Date(parseInt(dateInput));
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const dayOfWeek = date.toLocaleDateString(
            this.props.language === LANGUAGES.VI ? 'vi-VN' : 'en-US',
            { weekday: 'long' }
        );

        if (this.props.language === LANGUAGES.VI) {
            return `${day}/${month}/${year} ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`;
        } else {
            return `${month}/${day}/${year} ${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}`;
        }
    }
    // Bổ sung xử lý trong hàm handleConfirmBooking
    handleConfirmBooking = async () => {
        try {
            const {
                patientYearOfBirth, patientName, patientPhone,
                patientEmail, patientCity, patientDistrict,
                patientReason, patientGender, doctorId, date, timeType
            } = this.state;
            let doctorName = this.builDoctorName();
            let dateString = this.builDateString(date);
            const { dataScheduleModal, language } = this.props;
            const { timeTypeData } = dataScheduleModal || {};
            let timeString = '';

            if (timeTypeData) {
                const time = language === LANGUAGES.VI ? timeTypeData.valueVn : timeTypeData.valueEn;
                timeString = this.formatDate(date, time);
            } else {
                console.warn('timeTypeData is undefined');
                toast.error('Error: Unable to retrieve appointment time.');
                return;
            }

            if (!patientYearOfBirth || !patientName || !patientPhone || !patientEmail || !patientGender) {
                toast.error('Please fill in all required fields!');
                return;
            }

            const res = await postPatientBookingAppointment({
                fullName: patientName,
                phoneNumber: patientPhone,
                email: patientEmail,
                date: date,
                address: patientCity,
                addressDistrict: patientDistrict,
                reason: patientReason,
                gender: patientGender.value,
                doctorId: doctorId,
                language: this.props.language,
                timeString: timeString,
                doctorName: doctorName,
                dateString: dateString,
                timeType: timeType
            });

            if (res && res.data.errCode === 0) {
                toast.error(`Booking failed: ${res.data.errMessage}`);
            } else if (res && res.data.errCode === 1) {
                toast.success(`Booking: ${res.data.errMessage}`);
                this.setState({
                    patientYearOfBirth: '',
                    patientName: '',
                    patientPhone: '',
                    patientEmail: '',
                    patientCity: '',
                    patientDistrict: '',
                    patientReason: '',
                    patientGender: null,
                });
                this.props.handleCloseModal();
            } else {
                toast.error('Booking failed: Unknown error occurred.');
            }
        } catch (error) {
            console.error('Error during booking:', error);
            toast.error('Booking failed: Unable to connect to the server.');
        }
    };




    render() {
        const {
            patientName,
            patientPhone,
            patientEmail,
            patientYearOfBirth,
            patientCity,
            patientDistrict,
            patientReason,
            patientGender,
            genders,
            errors,
            doctorId, timeType, date
        } = this.state;
        const { dataScheduleModal, language } = this.props;
        const { timeTypeData } = dataScheduleModal || {};
        let time = '';
        if (timeTypeData) {
            time = language === LANGUAGES.VI ? timeTypeData.valueVn : timeTypeData.valueEn;
        }
        const formattedDate = this.formatDate(date, time);
        return (
            <Fragment>
                <Modal
                    isOpen={this.props.isOpenModalBooking}
                    toggle={this.handleToggle} // Đóng Modal khi nhấn ra ngoài
                    backdrop={true} // Hiển thị lớp nền và cho phép đóng Modal
                    className="booking-modal-container"
                    size="lg"
                    centered={true}
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <h2>ĐẶT LỊCH KHÁM</h2>
                        </div>
                        <div className="booking-modal-body">
                            <div className="doctor-info">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowPrice={true}
                                />
                                <h5>{formattedDate}</h5>
                            </div>

                            <div className="patient-info">
                                <div className="form-group">
                                    <label>Họ và tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="patientName"
                                        value={patientName}
                                        onChange={this.handleInputChange}
                                    />

                                </div>
                                <div className="form-group">
                                    <label>Giới tính</label>
                                    <Select
                                        value={patientGender}
                                        onChange={this.handleInputChangeGenders}
                                        options={genders}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="patientPhone"
                                        value={patientPhone}
                                        onChange={this.handleInputChange}
                                    />

                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="patientEmail"
                                        value={patientEmail}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Năm sinh</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="patientYearOfBirth"
                                        value={patientYearOfBirth}
                                        onChange={this.handleInputChange}
                                    />

                                </div>
                                <div className="form-group">
                                    <label>Thành phố</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="patientCity"
                                        value={patientCity}
                                        onChange={this.handleInputChange}
                                    />

                                </div>
                                <div className="form-group">
                                    <label>Quận / Huyện</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="patientDistrict"
                                        value={patientDistrict}
                                        onChange={this.handleInputChange}
                                    />

                                    <label>Lý do khám</label>
                                    <textarea
                                        className="form-control"
                                        name="patientReason"
                                        value={patientReason}
                                        onChange={this.handleInputChange}
                                    ></textarea>

                                </div>
                                <div className="form-group">
                                    <label>Hình thức thanh toán</label>
                                    <select className="form-control">
                                        <option value="pay-later">Thanh toán sau tại cơ sở y tế</option>
                                    </select>
                                </div>
                            </div>
                            <div className="note-section">
                                <h4>LƯU Ý</h4>
                                <ul>
                                    <li>Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ khám bệnh, khi điền thông tin anh/chị vui lòng:</li>
                                    <li>Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên, ví dụ: Trần Văn Phú</li>
                                    <li>Điền đầy đủ, đúng và vui lòng kiểm tra lại thông tin trước khi ấn "Xác nhận"</li>
                                </ul>
                            </div>
                        </div>

                        <div className="booking-modal-footer">
                            <button onClick={() => this.handleConfirmBooking()} className="btn btn-primary">Xác nhận đặt khám</button>
                            <button onClick={this.props.handleCloseModal} className="btn btn-danger">Hủy</button>
                            <p className="note">Bằng việc xác nhận đặt khám, bạn đã hoàn toàn đồng ý với Điều khoản sử dụng của chúng tôi.</p>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
