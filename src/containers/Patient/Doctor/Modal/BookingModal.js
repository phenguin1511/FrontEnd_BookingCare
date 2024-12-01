import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Modal } from 'reactstrap';
import { LANGUAGES } from '../../../../utils';
import ProfileDoctor from '../ProfileDoctor';
import * as actions from "../../../../store/actions";
import Select from 'react-select'

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
            genderData: []
        };
    }
    async componentDidMount() {
        this.props.fetchGenderStart()

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
        if (prevProps.language !== this.props.language) {
            if (this.props.genders.length > 0) {
                this.setState({
                    genders: this.builDataGender(this.props.genders)
                })
            }
        }
        if (prevProps.genders !== this.props.genders) {
            if (this.props.genders.length > 0) {
                this.setState({
                    genders: this.builDataGender(this.props.genders)
                })
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

    handleConfirmBooking = () => {
        const errors = this.validateForm();
        if (Object.keys(errors).length > 0) {
            this.setState({ errors }); // Cập nhật trạng thái lỗi
            return;
        }
        alert("Dữ liệu hợp lệ. Tiến hành đặt lịch.");
    };


    validateForm = () => {
        const errors = {};
        const {
            patientName,
            patientPhone,
            patientEmail,
            patientYearOfBirth,
            patientCity,
            patientDistrict,
            patientReason,
            patientGender,
        } = this.state;
        if (!patientName.trim()) {
            errors.patientName = "Họ và tên không được để trống.";
        }
        if (!patientPhone.trim()) {
            errors.patientPhone = "Số điện thoại không được để trống.";
        } else if (!/^\d{10}$/.test(patientPhone)) {
            errors.patientPhone = "Số điện thoại không hợp lệ. Phải là 10 chữ số.";
        }
        if (!patientEmail.trim()) {
            errors.patientEmail = "Email không được để trống.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail)) {
            errors.patientEmail = "Email không hợp lệ.";
        }
        if (!patientYearOfBirth) {
            errors.patientYearOfBirth = "Năm sinh không được để trống.";
        }
        if (!patientCity.trim()) {
            errors.patientCity = "Thành phố không được để trống.";
        }
        if (!patientDistrict.trim()) {
            errors.patientDistrict = "Quận/Huyện không được để trống.";
        }
        if (!patientReason.trim()) {
            errors.patientReason = "Lý do khám không được để trống.";
        }
        if (!patientGender) {
            errors.patientGender = "Vui lòng chọn giới tính.";
        }
        return errors;
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
            errors
        } = this.state;

        console.log(this.state)
        const { dataScheduleModal, language } = this.props;
        const { doctorId } = this.props.dataScheduleModal
        const { date, timeTypeData } = dataScheduleModal || {};
        let time = '';
        if (timeTypeData) {
            time = language === LANGUAGES.VI ? timeTypeData.valueVn : timeTypeData.valueEn;
        } else {
            console.warn('timeTypeData is undefined');
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
                                    {errors?.patientName && <span className="error-text">{errors.patientName}</span>}
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
                                    {errors?.patientPhone && <span className="error-text">{errors.patientPhone}</span>}
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
                                    {errors?.patientEmail && <span className="error-text">{errors.patientEmail}</span>}
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
                                    {errors?.patientYearOfBirth && <span className="error-text">{errors.patientYearOfBirth}</span>}
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
                                    {errors?.patientCity && <span className="error-text">{errors.patientCity}</span>}
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
                                    {errors?.patientDistrict && <span className="error-text">{errors.patientDistrict}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Lý do khám</label>
                                    <textarea
                                        className="form-control"
                                        name="patientReason"
                                        value={patientReason}
                                        onChange={this.handleInputChange}
                                    ></textarea>
                                    {errors?.patientReason && <span className="error-text">{errors.patientReason}</span>}
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
