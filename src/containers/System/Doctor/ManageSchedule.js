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
class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTime: false,
            list_doctors: [],
            selectedDoctor: '',
            currentDate: new Date(new Date().setDate(new Date().getTime())),
            rangeTime: []
        };
    }

    handleTimeSelect = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                // Kiểm tra nếu là item được nhấn thì đảo ngược trạng thái selectedTime
                if (item.id === time.id) {
                    item.selectedTime = !item.selectedTime;
                }
                return item;
            });
            this.setState({ rangeTime });
        }
    };


    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.fetchTimeScheduleDocter();

    }

    componentDidUpdate(prevProps) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let object = this.builDataSelect(this.props.allDoctors)
            this.setState({
                list_doctors: object
            })
        }
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
            })
        }
    }
    builDataSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVn = `${item.firstName} ${item.lastName}`;
                let labelEn = `${item.lastName} ${item.firstName}`;
                object.label = language === LANGUAGES.VI ? labelVn : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleChange = async (selectedDoctor) => {
        this.setState({
            selectedDoctor
        })

    }
    handleChangeDate = (date) => {
        let dateTime = date[0]
        this.setState({
            currentDate: dateTime
        })
        console.log(date[0])
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = []
        if (!currentDate) {
            toast.error('Invalid date! ')
        }
        if (!selectedDoctor || isEmpty(selectedDoctor)) {
            toast.error("Invalid Doctor!")
        }
        let formattedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.selectedTime === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((time, index) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = time.keyMap;
                    result.push(object)
                })
            } else {
                toast.error("Invalid Selected Item!")
            }
        }
        let res = await createScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate: formattedDate

        });
        if (res && res.data.errCode === 0) {
            toast.success("Save Info Success!")
        } else {
            toast.error("Save Info Fail!!")
        }
    }
    render() {
        const { selectedTime } = this.state;
        const { rangeTime, currentDate } = this.state;
        console.log(currentDate)
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
                                    Chọn bác sĩ
                                </label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChange}
                                    options={this.state.list_doctors}
                                    className="select-doctor"
                                    placeholder="Chọn Bác Sĩ..."
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
                                    value={this.state.currentDate}
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
                                <button className="btn btn-primary btn-schedule-save" onClick={() => this.handleSaveSchedule()}>
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
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(action.fetchAllDoctor()),
        fetchTimeScheduleDocter: () => dispatch(action.fetchTimeScheduleDocter()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
