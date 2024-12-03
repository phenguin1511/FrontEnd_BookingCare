import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import "./DoctorExtraInfo.scss"
import * as actions from "../../../store/actions";
import { LANGUAGES } from '../../../utils';


class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPriceDetail: '',
            extraInfo: []
        }
    }



    async componentDidMount() {
        await this.props.fetchExtraInfoDoctor(this.props.info_doctor)
        let doctorInfo = this.props.extraInfoDoctor
        if (doctorInfo) {
            this.setState({
                extraInfo: doctorInfo
            })
        }
    }
    togglePriceDetail = () => {
        this.setState({ showPriceDetail: !this.state.showPriceDetail });
    };
    async componentDidUpdate(prevProps) {
        if (this.props.info_doctor !== prevProps.info_doctor) {
            await this.props.fetchExtraInfoDoctor(this.props.info_doctor)
            let doctorInfo = this.props.extraInfoDoctor
            if (doctorInfo) {
                this.setState({
                    extraInfo: doctorInfo
                })
            }
        }
    }
    render() {
        const { extraInfo } = this.state; // Dữ liệu được lấy từ state
        const { language } = this.props;

        // Định dạng giá trị tiền tệ
        const formatCurrency = (value, lang) => {
            if (!value) return 'Không có giá';
            const numericValue = parseFloat(value.replace(/,/g, '')); // Loại bỏ dấu ',' nếu có
            if (isNaN(numericValue)) return value; // Nếu không phải số, trả về giá trị gốc

            // Xử lý định dạng dựa trên ngôn ngữ
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
                <div className="schedule-right">
                    {/* Thông tin phòng khám */}
                    <div className="clinic-info">
                        <p>Địa chỉ khám: {extraInfo.adressClinic || 'Không có thông tin'}</p>
                        <p>Tên phòng khám: {extraInfo.nameClinic || 'Không có thông tin'}</p>
                        <p>Thành Phố: {extraInfo.provinceTypeData?.valueVn || 'Không có thông tin'}</p>
                    </div>

                    {/* Thông tin giá khám */}
                    <div className="price-info">
                        <h5>Giá khám</h5>
                        <p className="price" onClick={this.togglePriceDetail}>
                            {language === LANGUAGES.VI
                                ? formatCurrency(extraInfo.priceTypeData?.valueVn, LANGUAGES.VI)
                                : formatCurrency(extraInfo.priceTypeData?.valueEn, LANGUAGES.EN)}{' '}
                            <span className="price-detail">(Chi tiết)</span>
                        </p>
                    </div>

                    {this.state.showPriceDetail && (
                        <Fragment>
                            <div className="price-modal-overlay" onClick={this.togglePriceDetail}></div>
                            <div className="price-modal">
                                <h5>Chi tiết giá khám</h5>
                                <p>
                                    Giá cơ bản: <span>
                                        {language === LANGUAGES.VI
                                            ? formatCurrency(extraInfo.priceTypeData?.valueVn, LANGUAGES.VI)
                                            : formatCurrency(extraInfo.priceTypeData?.valueEn, LANGUAGES.EN)}
                                    </span>
                                </p>
                                <p>
                                    Phương thức thanh toán: <span>
                                        {language === LANGUAGES.VI
                                            ? extraInfo.paymentTypeData?.valueVn || 'Không rõ phương thức'
                                            : extraInfo.paymentTypeData?.valueEn || 'No payment method'}
                                    </span>
                                </p>
                                <p>Ghi chú: <span>{extraInfo.note || 'Không có ghi chú'}</span></p>
                                <button onClick={this.togglePriceDetail}>Đóng</button>
                            </div>
                        </Fragment>
                    )}
                </div>
            </Fragment>

        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        extraInfoDoctor: state.admin.extraInfoDoctor,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchExtraInfoDoctor: (id) => dispatch(actions.fetchExtraInfoDoctor(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
