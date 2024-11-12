import React, { Component } from 'react';
import { connect } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./About.scss"


class About extends Component {
    render() {
        return (
            <div className="section-about">
                <h2>Truyền Thông Nói Gì Về Chúng Tôi</h2>
                <div className="about-content">
                    <div className="about-video">
                        <iframe
                            width="100%"
                            height="515"
                            src="https://www.youtube.com/embed/U-IWpIYH6eQ" // Thay thế với ID video mới
                            title="BookingCare Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Logos Section */}
                    <div className="about-logos">
                        <a href="https://vnexpress.net" target="_blank" rel="noopener noreferrer">
                            <img className='image-logo' src="https://s1.vnecdn.net/vnexpress/restruct/i/v9519/v2_2019/pc/graphics/logo.svg" alt="VN Express" />
                        </a>
                        <a href="https://suckhoedoisong.vn" target="_blank" rel="noopener noreferrer">
                            <img className='image-logo' src="https://static.mediacdn.vn/suckhoedoisong/image/logo.svg" alt="Sức Khỏe Đời Sống" />
                        </a>
                        <a href="https://vietnamnet.vn" target="_blank" rel="noopener noreferrer">
                            <img className='image-logo' src="https://static.vnncdn.net/v1/logo/logoVietnamNet.svg" alt="Vietnam Net" />
                        </a>
                        <a href="https://vtv.vn" target="_blank" rel="noopener noreferrer">
                            <img className='image-logo' src="https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-vtv-inklythuatso-01-22-10-26-12.jpg" alt="VTV1" />
                        </a>
                        <a href="https://vtc.vn" target="_blank" rel="noopener noreferrer">
                            <img className='image-logo' src="https://cdn.bookingcare.vn/fo/w256/2023/11/01/165432-vtcnewslogosvg.png" alt="VTC News" />
                        </a>
                        <a href="https://dantri.com.vn" target="_blank" rel="noopener noreferrer">
                            <img className='image-logo' src="https://cdn.bookingcare.vn/fo/w256/2023/11/02/110757-dantrilogo.png" alt="Dân Trí" />
                        </a>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
