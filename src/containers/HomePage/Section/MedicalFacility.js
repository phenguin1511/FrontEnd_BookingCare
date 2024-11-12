import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import "./MedicalFacility.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow next" onClick={onClick}>
            <i class="fa-regular fa-circle-right"></i>
        </div>
    );
};

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="arrow prev" onClick={onClick}>
            <i class="fa-regular fa-circle-left"></i>
        </div>
    );
};

class MedicalFacility extends Component {
    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 2,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };

        return (
            <React.Fragment>
                <div className='section-medicalfacility'>
                    <div className='medicalfacility-title'>
                        <h2>Cơ Sở Y Tế Nổi Bật</h2>
                        <div className='btn-viewmore'>Xem Thêm</div>
                    </div>

                    <Slider className='slider' {...settings}>
                        <div className='medicalfacility-item'>
                            <img src='https://cdn.tuoitre.vn/zoom/700_390/471584752817336320/2024/11/6/inter-milan-arsenal-champions-league-17308607930561569631197-44-0-672-1200-crop-17308608464511473001591.jpg' alt='medicalfacility 1' className='medicalfacility-image' />
                            <p>medicalfacility 1</p>
                        </div>

                        <div className='medicalfacility-item'>
                            <img src='https://cdn.tuoitre.vn/zoom/700_390/471584752817336320/2024/11/6/inter-milan-arsenal-champions-league-17308607930561569631197-44-0-672-1200-crop-17308608464511473001591.jpg' alt='medicalfacility 1' className='medicalfacility-image' />
                            <p>medicalfacility 1</p>
                        </div>

                        <div className='medicalfacility-item'>
                            <img src='https://cdn.tuoitre.vn/zoom/700_390/471584752817336320/2024/11/6/inter-milan-arsenal-champions-league-17308607930561569631197-44-0-672-1200-crop-17308608464511473001591.jpg' alt='medicalfacility 1' className='medicalfacility-image' />
                            <p>medicalfacility 1</p>
                        </div>
                        <div className='medicalfacility-item'>
                            <img src='https://cdn.tuoitre.vn/zoom/700_390/471584752817336320/2024/11/6/inter-milan-arsenal-champions-league-17308607930561569631197-44-0-672-1200-crop-17308608464511473001591.jpg' alt='medicalfacility 1' className='medicalfacility-image' />
                            <p>medicalfacility 1</p>
                        </div>
                    </Slider>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
