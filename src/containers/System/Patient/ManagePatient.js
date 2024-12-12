import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import { getAllPatientForDoctor, postSendRemedy, deleteBookingPatient } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { TbAwardOff } from 'react-icons/tb';
import { toast } from 'react-toastify';
class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            list_patient: [],
            isProcessing: false,
            isOpenRemedyModal: false,
            dataModal: []
        };
    }

    async componentDidMount() {
        let formatedDate = new Date(this.state.currentDate);
        formatedDate.setHours(0, 0, 0, 0);
        let timestamp = formatedDate.getTime();
        this.setState({
            currentDate: timestamp
        })
        await this.handleGetPatientBooking();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleGetPatientBooking = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;

        this.setState({ isLoading: true });

        let formatedDate = new Date(currentDate);
        formatedDate.setHours(0, 0, 0, 0);
        let timestamp = formatedDate.getTime();

        try {
            let res = await getAllPatientForDoctor({
                doctorId: user.id,
                date: timestamp
            });

            if (res && res.data.errCode === 0) {
                this.setState({
                    list_patient: res.data.data,
                    isLoading: false
                });
            } else {
                toast.error(res.data.errMessage || 'Không thể tải danh sách bệnh nhân');
                this.setState({ isLoading: false });
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi!');
            this.setState({ isLoading: false });
        }
    };


    handleConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    handleCloseModal = () => {
        this.setState({
            isOpenRemedyModal: false
        })
    }

    sendRemery = async (data) => {
        this.setState({ isProcessing: true });
        let { dataModal, currentDate } = this.state;
        let formatedDate = new Date(currentDate);
        formatedDate.setHours(0, 0, 0, 0);
        let timestamp = formatedDate.getTime();

        try {
            let res = await postSendRemedy({
                ...data,
                doctorId: dataModal.doctorId,
                patientId: dataModal.patientId,
                timeType: timestamp,
                language: this.props.language
            });

            if (res && res.data.errCode === 0) {
                this.setState({ isProcessing: false });
                toast.success('Gửi đơn thuốc thành công!');
                this.handleCloseModal();
                await this.handleGetPatientBooking();
            } else {
                toast.error(res.data.errMessage || 'Có lỗi xảy ra!');
                this.setState({ isProcessing: false });
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi!');
            this.setState({ isProcessing: false });
        }
    };

    handleDelete = async (item) => {

        let res = await deleteBookingPatient(item);
        console.log(res)
        if (res && res.data.errCode === 0) {
            this.setState({ isProcessing: false });
            toast.success('Xóa Thành Công!');
            this.handleCloseModal();
            await this.handleGetPatientBooking();
        } else {
            toast.error(res.data.errMessage || 'Có lỗi xảy ra!');
            this.setState({ isProcessing: false });
        }
    }
    render() {
        const { currentDate, list_patient, isProcessing } = this.state;
        const { language } = this.props;
        console.log(this.state)
        return (
            <Fragment>
                <div className='patient-manage-container'>
                    <div className='patient-manage-title'>
                        Quản Lý Lịch Hẹn Khám Bệnh
                    </div>
                    <div className='patient-manage-content'>
                        <div className='date-picker'>
                            <label>Chọn Ngày Khám</label>
                            <input
                                className='date-patient-manage'
                                type='date'
                                value={currentDate}
                                name="currentDate"
                                onChange={this.handleInputChange}
                            />
                            <button className='btn-filter' onClick={this.handleGetPatientBooking}>Lọc</button>
                        </div>
                        <div className='appointment-list'>
                            <label className='label-patient-manager'>Danh Sách Lịch Hẹn</label>
                            <table className='table-patient-manage'>

                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Họ Và Tên</th>
                                        <th>Giới Tính</th>
                                        <th>Giờ Khám</th>
                                        <th>Địa Chỉ</th>
                                        <th>Lí Do</th>
                                        <th>Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isProcessing ? (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="loader">
                                                    <div className="spinner"></div>
                                                    Đang tải...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        list_patient && list_patient.length > 0 ? (
                                            list_patient.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.patientData?.lastName || 'Không có thông tin'}</td>
                                                    <td>
                                                        {language === LANGUAGES.VI
                                                            ? item.patientData?.genderData?.valueVn
                                                            : item.patientData?.genderData?.valueEn}
                                                    </td>
                                                    <td>
                                                        {language === LANGUAGES.VI
                                                            ? item.timeTypeDataPatient?.valueVn
                                                            : item.timeTypeDataPatient?.valueEn}
                                                    </td>
                                                    <td>{item.patientData?.address || 'Không có địa chỉ'}</td>
                                                    <td>{item.reason}</td>
                                                    <td>
                                                        <button
                                                            className="btn-send-from-doctor"
                                                            onClick={() => this.handleConfirm(item)}
                                                        >
                                                            Gửi Đơn Thuốc
                                                        </button>
                                                        <button
                                                            className="btn-delete-from-doctor"
                                                            onClick={() => this.handleDelete(item)}
                                                        >
                                                            Hủy
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                                                    Không có lịch hẹn nào trong ngày được chọn.
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
                <RemedyModal
                    isOpenRemedyModal={this.state.isOpenRemedyModal}
                    handleCloseModal={this.handleCloseModal}
                    dataModal={this.state.dataModal}
                    sendRemedy={this.sendRemery} // Đổi sendRemery thành sendRemedy
                />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

export default connect(mapStateToProps)(ManagePatient);