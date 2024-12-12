import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ClinicDetail.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import HomeFooter from '../../HomePage/HomeFooter';
import { getDetailClinicById } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';

class ClinicDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            detailDoctor: [],
            isExpanded: false,
        };
    }

    toggleDescription = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    };

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({ id });
            console.log("Check res", res)
            if (res && res.data.errCode === 0) {
                let arr = res.data.data.clinicTypeData;
                let arrDoctorId = arr ? arr.map(item => item.doctorId) : [];

                this.setState({
                    detailDoctor: res.data.data,
                    arrDoctorId: arrDoctorId,
                });
            } else {
                this.setState({
                    detailDoctor: [],
                    arrDoctorId: [],
                });
            }
        }
    }


    componentDidUpdate(prevProps) {

    }



    handleOnChangeSelect = async (event) => {


        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailClinicById({ id });

            if (res && res.data.errCode === 0) {
                let arr = res.data.data.clinicTypeData;
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
        const { detailDoctor, arrDoctorId } = this.state;

        return (
            <Fragment>
                <HomeHeader />
                <div className='detail-clinic-container'>
                    <div className="back-button">
                        <button onClick={() => this.props.history.goBack()}>⬅ Quay lại</button>
                    </div>

                    <div className="description-detail-clinic">
                        {detailDoctor && detailDoctor.descriptionHTML ? (
                            <>
                                <div
                                    className='image-title-clinic-detail'
                                    style={{
                                        backgroundImage: `url(${detailDoctor.image})`
                                    }}
                                ></div>
                                <div
                                    className={`description-clinic-content ${this.state.isExpanded ? "expanded" : "collapsed"}`}
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
                            <p className="no-description">
                                <i className="fas fa-info-circle" style={{ marginRight: '5px', color: '#888' }}></i>
                                Chưa có mô tả
                            </p>
                        )}
                    </div>
                </div>
                <div className='line'></div>
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

export default connect(mapStateToProps)(ClinicDetail);
