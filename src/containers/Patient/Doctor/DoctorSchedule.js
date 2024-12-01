import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import Select from 'react-select';
import localization from 'moment/locale/vi'
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import { LiaThListSolid } from 'react-icons/lia';
import { getScheduleDoctorByDate } from '../../../services/userService'
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            timeSchedule: '',
            selectedDate: null,
            info_doctor: [],
            isOpenModalBooking: false,
            dataScheduleModal: {}
        };
    }
    async componentDidMount() {
        let doctorId = this.props.info_doctor
        let { language } = this.props;
        let allDays = this.getArrDays(language);
        if (allDays && allDays.length > 0) {
            let res = await getScheduleDoctorByDate(doctorId, allDays[0].value);
            this.setState({
                allDays: allDays,
                timeSchedule: res.data.data ? res.data.data : []
            })
        }
        if (this.props.doctor) {
            this.setState({
                info_doctor: this.props.doctor
            })
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays
            })
        }
        if (this.state.selectedDate !== prevState.selectedDate) {
            this.handleOnChangeSelect(this.state.selectedDate);  // Trigger schedule load for the selected date
        }

    }

    getArrDays = (language) => {
        let arrDate = [];
        const vietnameseWeekdays = [
            'Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
        ];
        for (let i = 0; i < 7; i++) {
            let object = {};
            const currentDate = moment(new Date()).add(i, 'days');
            const dayOfWeek = currentDate.day();
            if (language === LANGUAGES.VI) {
                if (currentDate.isSame(moment(), 'day')) {
                    object.label = 'Hôm Nay';
                } else {
                    let vietnameseDay = vietnameseWeekdays[dayOfWeek];
                    object.label = `${vietnameseDay} - ${currentDate.format('DD/MM')}`;
                }
            } else {
                if (currentDate.isSame(moment(), 'day')) {
                    object.label = 'Today';
                } else {
                    object.label = currentDate.locale('en').format("ddd - DD/MM");
                }
            }
            object.value = currentDate.startOf('day').valueOf();
            if (currentDate.isSame(moment(), 'day')) {
                this.setState({ selectedDate: object });
            }
            arrDate.push(object);
        }
        return arrDate;
    }

    handleOnChangeSelect = async (selectedOption) => {
        if (this.props.info_doctor && this.props.info_doctor !== -1) {
            let id = this.props.info_doctor;
            let date = selectedOption.value;

            try {
                let res = await getScheduleDoctorByDate(id, date);
                if (res && res.data.errCode === 0) {
                    let time = res.data.data;
                    this.setState({
                        timeSchedule: time ? time : []
                    })
                }
            } catch (error) {
                console.error("Error fetching schedule data:", error);
            }

            // Update selectedDate state
            this.setState({ selectedDate: selectedOption });
        }
    }
    handleClickBookingModal = (data) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleModal: data
        })
    }
    handleCloseModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }
    render() {
        const { allDays, timeSchedule, selectedDate } = this.state;
        const { language } = this.props;
        console.log("Info Doctor", this.props.doctor)
        return (

            <Fragment>
                <div className="schedule-left">
                    <div className="calendar">
                        <h3>Chọn ngày khám</h3>
                        <Select
                            options={allDays}
                            placeholder="Chọn Ngày..."
                            onChange={this.handleOnChangeSelect}  // Truyền đối tượng lựa chọn thay vì sự kiện
                            value={selectedDate}  // Set default value as "Hôm Nay"
                        />
                    </div>
                    <div className="daily-schedule">
                        <h3>Lịch khám trong ngày</h3>
                        <ul>
                            {timeSchedule && timeSchedule.length > 0 ? (
                                timeSchedule.map((item, index) => (
                                    <li key={index} onClick={() => this.handleClickBookingModal(item)}>
                                        {language === LANGUAGES.EN ? item.timeTypeData.valueEn || item.timeTypeData.valueVn || 'N/A' : item.timeTypeData.valueVn || item.timeTypeData.valueEn || 'N/A'}
                                    </li>
                                ))
                            ) : (
                                <li>Không Có Lịch Hẹn</li>
                            )}
                        </ul>
                        <div className="book-free">
                            <i className="fa-regular fa-hand-pointer icon"></i>
                            Chọn và đặt lịch miễn phí
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModalBooking={this.state.isOpenModalBooking}
                    dataScheduleModal={this.state.dataScheduleModal}
                    handleCloseModal={this.handleCloseModal}
                />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        doctor: state.admin.info_doctor
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
