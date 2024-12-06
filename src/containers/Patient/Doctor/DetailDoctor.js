import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import "./DetailDoctor.scss"
import HomeFooter from '../../HomePage/HomeFooter';
import * as actions from "../../../store/actions";
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from '../SocialPlugin/Comment';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPriceDetail: false,
            info_doctor: [],
            currentDoctorId: -1
        }
    }



    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id
            })
            await this.props.fetchDetailInfoDoctor(id);
        }
        if (this.props.doctor) {
            this.setState({
                info_doctor: this.props.doctor
            });
        }
    }

    componentDidUpdate(prevProps) {

    }
    render() {
        console.log(this.state.info_doctor);
        const { info_doctor } = this.state;
        let { language } = this.props;
        // Kiểm tra nếu info_doctor không có dữ liệu hoặc image không tồn tại
        const doctorImage = info_doctor && info_doctor.image ? info_doctor.image : 'https://via.placeholder.com/150'; // Ảnh mặc định
        let nameVn, nameEn, specialty, fullName = '';
        if (info_doctor && info_doctor.positionData) {
            nameVn = `${info_doctor.firstName} ${info_doctor.lastName}`;
            nameEn = `${info_doctor.lastName} ${info_doctor.firstName}`;
            fullName = language === LANGUAGES.VI ? nameVn : nameEn;
            let valueEn = `${info_doctor.positionData.valueEn}`;
            let valueVn = `${info_doctor.positionData.valueVn}`;
            specialty = language === LANGUAGES.VI ? valueVn : valueEn
        }

        const currentURL = 'https://developers.facebook.com/docs/plugins/'





        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div className="content-left">
                            <div
                                className="doctor-image"
                                style={{
                                    backgroundImage: `url(${doctorImage})`
                                }}
                            >
                            </div>
                        </div>
                        <div className="content-right">
                            <h1 className="doctor-name">{fullName}</h1>
                            <p className="doctor-specialty">Specialty: {specialty}</p>
                            <p className="doctor-description">
                                {info_doctor.Markdown && info_doctor.Markdown.description ?
                                    <span>{info_doctor.Markdown.description}</span>
                                    : 'Chưa có mô tả'
                                }
                            </p>
                            <div className="like-share-plugin">
                                <LikeAndShare dataHref={currentURL} />
                            </div>
                        </div>

                    </div>
                    <div className="schedule-doctor">
                        <div className="schedule-content">
                            <DoctorSchedule
                                info_doctor={this.state.currentDoctorId}
                            />
                            <DoctorExtraInfo
                                info_doctor={this.state.currentDoctorId}
                            />
                        </div>
                    </div>
                    <div className="detail-infor-doctor">
                        <h2>About the Doctor</h2>
                        <div>
                            {info_doctor.Markdown && info_doctor.Markdown.contentHTML ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: info_doctor.Markdown.contentHTML }}
                                />
                            ) : (
                                'Chưa có mô tả'
                            )}
                        </div>
                    </div>


                    <div className="comment-doctor">
                        <h2>Patient Reviews</h2>
                        <Comment
                            width={"100%"}
                            dataHref={currentURL}
                        />
                    </div>
                </div>
                <HomeFooter />
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        doctor: state.admin.info_doctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDetailInfoDoctor: (id) => dispatch(actions.fetchDetailInfoDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
