import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import "./OutstanDoctor.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as action from '../../../store/actions';
import { LANGUAGES } from '../../../utils';

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow next" onClick={onClick}>
            <i className="fa-regular fa-circle-right"></i>
        </div>
    );
};

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow prev" onClick={onClick}>
            <i className="fa-regular fa-circle-left"></i>
        </div>
    );
};

class OutstanDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctors: [],
            language: ''
        };
    }

    componentDidMount() {
        this.props.loadTopDoctors(10); // Load top 10 doctors từ Redux
    }

    componentDidUpdate(prevProps) {
        if (prevProps.doctors !== this.props.doctors || prevProps.language !== this.props.language) {
            this.setState({
                doctors: this.props.doctors,
                language: this.props.language,
            });
        }
    }


    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 2,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };

        const { doctors } = this.state;
        const { language } = this.state;

        return (
            <React.Fragment>
                <div className='section-outstanDoctor'>
                    <div className='outstanDoctor-title'>
                        <h2>Bác Sĩ Nổi Bật Trong Tuần</h2>
                        <div className='btn-viewmore'>Xem Thêm</div>
                    </div>

                    <Slider className='slider' {...settings}>
                        {doctors && doctors.length > 0 ? (
                            doctors.map((doctor, index) => {
                                let imageBase64 = '';
                                if (doctor.image.data) {
                                    imageBase64 = new Buffer(doctor.image.data, 'base64').toString('binary')
                                }

                                return (
                                    <div className='outstanDoctor-item' key={index}>
                                        <div
                                            className='outstanDoctor-image'
                                            style={{
                                                backgroundImage: `url(${imageBase64})`,
                                            }}
                                        ></div>
                                        {language === LANGUAGES.EN ? (
                                            <p>{`${doctor.positionData.valueEn}: ${doctor.firstName} ${doctor.lastName}`}</p>
                                        ) : (
                                            <p>{`${doctor.positionData.valueVn}: ${doctor.firstName} ${doctor.lastName}`}</p>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-data">
                                <p>Không có dữ liệu bác sĩ nổi bật</p>
                            </div>
                        )}
                    </Slider>

                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        doctors: state.admin.doctors // Lấy danh sách doctors từ Redux
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: (limit) => dispatch(action.fetchTopDoctor(limit)) // Gọi action fetchTopDoctor
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutstanDoctor);
