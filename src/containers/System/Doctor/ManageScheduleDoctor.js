import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import * as action from "../../../store/actions";
import Select from 'react-select';
import { LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';
import { isEmpty } from 'lodash';
import { createScheduleDoctor } from '../../../services/userService';
import { toast } from "react-toastify";

class ManageScheduleDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTime: false,
            selectedDoctor: '',
            currentDate: new Date(new Date().setDate(new Date().getTime())),
            rangeTime: []
        };
    }

    componentDidMount() {
        this.props.fetchTimeScheduleDocter();

        // Set thông tin bác sĩ hiện tại từ Redux vào `selectedDoctor`
        const { user, language } = this.props;
        if (user) {
            const doctorInfo = {
                label: language === LANGUAGES.VI
                    ? `${user.firstName} ${user.lastName}`
                    : `${user.lastName} ${user.firstName}`,
                value: user.id
            };
            this.setState({
                selectedDoctor: doctorInfo
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allTime !== this.props.allTime) {
            let data = this.props.allTime;
            if (data && data.length > 0) {
                data = data.map(item => ({
                    ...item,
                    selectedTime: false
                }))
            }
            this.setState({
                rangeTime: data
            });
        }
    }

    handleChangeDate = (date) => {
        this.setState({
            currentDate: date[0]
        });
    }

    handleTimeSelect = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) {
                    item.selectedTime = !item.selectedTime;
                }
                return item;
            });
            this.setState({ rangeTime });
        }
    };

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = []
        if (!currentDate) {
            toast.error('Invalid date!');
            return;
        }
        if (!selectedDoctor || isEmpty(selectedDoctor)) {
            toast.error("Invalid Doctor!");
            return;
        }

        let formattedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.selectedTime === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((time) => {
                    let object = {
                        doctorId: selectedDoctor.value,
                        date: formattedDate,
                        timeType: time.keyMap
                    };
                    result.push(object);
                });
            } else {
                toast.error("Invalid Selected Item!");
                return;
            }
        }
        let res = await createScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate: formattedDate
        });
        if (res && res.data.errCode === 0) {
            toast.success("Save Info Success!");
        } else {
            toast.error("Save Info Fail!");
        }
    }

    render() {
        const { rangeTime, currentDate, selectedDoctor } = this.state;
        return (
            <Fragment>
                <div className='manage-schedule-container'>
                    <div className='manage-schedule-title text-center'>
                        QUẢN LÝ KẾ HOẠCH LÀM VIỆC CỦA BÁC SĨ
                    </div>
                    <div className="container mt-4 p-4 bg-white shadow rounded">
                        <div className="row justify-content-center">
                            <div className="col-md-6 mb-4">
                                <label htmlFor="doctorSelect" className="form-label">
                                    Bác sĩ hiện tại
                                </label>
                                <Select
                                    value={selectedDoctor}
                                    isDisabled
                                    className="select-doctor"
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-6 mb-4">
                                <label htmlFor="datePicker" className="form-label">
                                    Chọn ngày khám
                                </label>
                                <DatePicker
                                    onChange={this.handleChangeDate}
                                    className="form-control"
                                    placeholder="Chọn Ngày Khám..."
                                    value={currentDate}
                                    minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Chọn giờ khám</label>
                                <div className="time-picker-container">
                                    {rangeTime && rangeTime.length > 0 &&
                                        rangeTime.map((time, index) => {
                                            const displayTime = this.props.language === LANGUAGES.VI ? time.valueVn : time.valueEn;
                                            return (
                                                <button
                                                    key={index}
                                                    className={`btn btn-outline-primary time-slot ${time.selectedTime ? "active" : ""}`}
                                                    onClick={() => this.handleTimeSelect(time)}
                                                >
                                                    {displayTime}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-4 text-center">
                                <button className="btn btn-primary btn-schedule-save" onClick={this.handleSaveSchedule}>
                                    Lưu Kế Hoạch
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allTime: state.admin.allScheduleTime,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchTimeScheduleDocter: () => dispatch(action.fetchTimeScheduleDocter())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageScheduleDoctor);
