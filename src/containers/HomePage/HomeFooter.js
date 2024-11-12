import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./HomeFooter.scss"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


class HomeFooter extends Component {
    render() {
        return (
            <div className='home-footer'>
                <div className='footer-content'>
                    <div className='footer-section about'>
                        <h3>About Us</h3>
                        <p>Chúng tôi tự hào mang đến dịch vụ y tế chất lượng với đội ngũ bác sĩ tận tâm và trang thiết bị hiện đại. Chúng tôi cung cấp dịch vụ khám chữa bệnh đa khoa toàn diện, từ khám tổng quát đến các chuyên khoa sâu, đáp ứng mọi nhu cầu chăm sóc sức khỏe của bạn và gia đình. Với tầm nhìn trở thành cơ sở y tế đáng tin cậy, chúng tôi luôn nỗ lực vì sức khỏe và sự an tâm của cộng đồng.</p>
                    </div>

                    <div className='footer-section links'>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href='#'>Home</a></li>
                            <li><a href='#'>Services</a></li>
                            <li><a href='#'>Contact</a></li>
                            <li><a href='#'>About</a></li>
                        </ul>
                    </div>

                    <div className='footer-section contact'>
                        <h3>Contact Us</h3>
                        <p>Email: lehoainguyenphuc@gmail.com</p>
                        <p>Phone: 0337 732 045</p>
                        <div className='social-icons'>
                            <i className="fab fa-facebook"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-linkedin"></i>
                        </div>

                    </div>
                </div>
                <div className='footer-bottom'>
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
