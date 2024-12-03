import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { LANGUAGES } from '../../../utils';
import { getInfoDetailDoctor } from '../../../services/userService';
import { Link } from 'react-router-dom';
class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: []
        };
    }

    getInfoDoctor = async (id) => {
        let result = [];
        if (id) {
            let res = await getInfoDetailDoctor(id);
            if (res && res.data && res.data.errCode === 0) {
                result = res.data.data;
            }
        }
        return result;
    };

    async componentDidMount() {
        let id = this.props.doctorId;
        let data = await this.getInfoDoctor(id);
        this.setState({
            dataProfile: data
        });
    }

    async componentDidUpdate(prevProps) {
        if (this.props.doctorId !== prevProps.doctorId) {
            let id = this.props.doctorId;
            let data = await this.getInfoDoctor(id);
            this.setState({
                dataProfile: data
            });
        }
    }

    render() {
        const { language, isShowPrice, isShowLinkDetail } = this.props;
        const { dataProfile } = this.state;

        const doctorImage = dataProfile?.image || 'https://via.placeholder.com/150';
        const positionData = dataProfile?.positionData || {};
        const markdown = dataProfile?.Markdown || {};
        const doctorInfo = dataProfile?.Doctor_Infor || {};
        const priceData = doctorInfo?.priceTypeData || {};
        const doctorId = this.props.doctorId
        const formatCurrency = (value, lang) => {
            if (!value) return 'Không có giá';
            const numericValue = parseFloat(value.replace(/,/g, ''));
            if (isNaN(numericValue)) return value;

            if (lang === LANGUAGES.VI) {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0,
                }).format(numericValue);
            } else {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                }).format(numericValue);
            }
        };

        return (
            <Fragment>
                <div className='intro-doctor-profile'>
                    <div className='img-doctor-profile' style={{ backgroundImage: `url(${doctorImage})` }}></div>
                    <h3>
                        {language === LANGUAGES.VI ? positionData.valueVn : positionData.valueEn} || {dataProfile?.firstName || ''}  {dataProfile?.lastName || ''}
                    </h3>
                    <p className="doctor-profile-description">
                        {markdown.description ? (
                            <span>{markdown.description}</span>
                        ) : 'Chưa có mô tả'}
                    </p>
                    <p className="doctor-profile-nameClinic">
                        {doctorInfo.nameClinic ? (
                            <span>Tên Phòng Khám: {doctorInfo.nameClinic}</span>
                        ) : 'Chưa có mô tả'}
                    </p>
                    <p className="doctor-profile-adressClinic">
                        {doctorInfo.adressClinic ? (
                            <span>Địa Chỉ Phòng Khám: {doctorInfo.adressClinic}</span>
                        ) : 'Chưa có mô tả'}
                    </p>
                    {isShowLinkDetail === true &&
                        <div className="view-more">
                            <Link to={`/detail-doctor/${doctorId}`}>Xem Thêm</Link>
                        </div>
                    }
                    {isShowPrice === true &&
                        <div className="price-info">
                            <p>
                                Giá cơ bản: <span>
                                    {language === LANGUAGES.VI
                                        ? formatCurrency(priceData.valueVn, LANGUAGES.VI)
                                        : formatCurrency(priceData.valueEn, LANGUAGES.EN)}
                                </span>
                            </p>
                        </div>
                    }

                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DoctorExtraInfo);
