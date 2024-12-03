import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './SpecialtyDetail.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import HomeFooter from '../../HomePage/HomeFooter';
import { getDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';

class SpecialtyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            detailDoctor: [],
            isExpanded: false,
            listProvince: [],
            selectedProvince: ''
        };
    }

    toggleDescription = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById({ id, location: 'ALL' });
            let resProvince = await getAllCodeService('PROVINCE');

            if (res && res.data.errCode === 0 && resProvince && resProvince.data.errCode === 0) {
                let arr = res.data.data.specialtyTypeData;
                let arrDoctorId = arr ? arr.map(item => item.doctorId) : [];
                let listProvince = resProvince.data.data.map(item => ({
                    ...item,
                    value: this.props.language === LANGUAGES.VI ? item.valueVn : item.valueEn
                }));

                // Thêm một mục mặc định "ALL"
                listProvince.push({
                    createdAt: null,
                    keyMap: 'ALL',
                    type: 'PROVINCE',
                    value: this.props.language === LANGUAGES.VI ? "Toàn Quốc" : "ALL",
                    valueEn: "ALL",
                    valueVn: "Toàn Quốc"
                });

                this.setState({
                    detailDoctor: res.data.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: listProvince,
                    selectedProvince: 'ALL'
                });
            } else {
                this.setState({
                    detailDoctor: [],
                    arrDoctorId: [],
                    listProvince: [],
                    selectedProvince: ''
                });
            }
        }
    }


    componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            const updatedListProvince = this.state.listProvince.map(item => ({
                ...item,
                value: this.props.language === LANGUAGES.VI ? item.valueVn : item.valueEn
            }));
            this.setState({ listProvince: updatedListProvince });
        }
    }



    handleOnChangeSelect = async (event) => {
        const selectedProvince = event.target.value;
        if (selectedProvince === this.state.selectedProvince) {
            return;
        }

        this.setState({ selectedProvince });

        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailSpecialtyById({ id, location: selectedProvince });

            if (res && res.data.errCode === 0) {
                let arr = res.data.data.specialtyTypeData;
                let arrDoctorId = arr ? arr.map(item => item.doctorId) : [];
                this.setState({
                    detailDoctor: res.data.data,
                    arrDoctorId: arrDoctorId,
                });
            } else {
                this.setState({
                    arrDoctorId: [],
                });
            }
        }
    };


    render() {
        const { detailDoctor, arrDoctorId, listProvince, selectedProvince } = this.state;
        console.log(this.state);

        return (
            <Fragment>
                <HomeHeader />
                <div className='detail-specialty-container'>
                    <div className="description-detail-specialty">
                        {detailDoctor && detailDoctor.descriptionHTML ? (
                            <>
                                <div
                                    className={`description-content ${this.state.isExpanded ? "expanded" : "collapsed"}`}
                                    dangerouslySetInnerHTML={{ __html: detailDoctor.descriptionHTML }}
                                />
                                <button
                                    className="toggle-description-btn"
                                    onClick={this.toggleDescription}
                                >
                                    {this.state.isExpanded ? "Thu gọn" : "Xem thêm"}
                                </button>
                            </>
                        ) : (
                            <p className="no-description">Chưa có mô tả</p>
                        )}
                    </div>
                </div>
                <div className='line'></div>
                <div className='search-sp-doctor'>
                    <select
                        id="province-select"
                        className='select-province'
                        value={selectedProvince} // Đặt giá trị mặc định là 'ALL'
                        onChange={this.handleOnChangeSelect}
                    >
                        {listProvince && listProvince.length > 0 &&
                            listProvince.map((item) => (
                                <option key={item.keyMap} value={item.keyMap}>
                                    {item.value}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className='title-schedule-doctor'>
                    <h2>Các Bác Sĩ Phụ Trách</h2>
                </div>
                <div className="schedule-doctor">
                    <div className="schedule-content">
                        {arrDoctorId && arrDoctorId.length > 0 ? (
                            arrDoctorId.map((item, index) => {
                                return (
                                    <div className='schedule-content-detail' key={item}>
                                        <div className="schedule-content-right">
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                        <div className="schedule-content-left">
                                            <DoctorSchedule info_doctor={item} />
                                            <DoctorExtraInfo info_doctor={item} />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có bác sĩ hỗ trợ ở khu vực này.</p>
                        )}
                    </div>
                </div>

                <HomeFooter />
            </Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(SpecialtyDetail);
