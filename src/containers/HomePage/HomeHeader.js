import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import "./HomeHeader.scss";

class HomeHeader extends Component {
    render() {
        return (
            <div className="homeHeader-container">
                <div className='home-header-content'>
                    <div className='header-content-left'>
                        <i className="fas fa-bars bars-header"></i>
                        <div className='logo-image'></div>
                    </div>
                    <div className='header-content-center'>
                        <div className='child-content'>
                            <div><b>Chuyên Khoa</b></div>
                            <div className='sub-title'>Tìm Bác Sĩ Theo Chuyên Khoa</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Cơ Sở Y Tế</b></div>
                            <div className='sub-title'>Chọn Bệnh Viện Phòng Khám</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Bác Sĩ</b></div>
                            <div className='sub-title'>Chọn Bác Sĩ Giỏi</div>
                        </div>
                        <div className='child-content'>
                            <div><b>Gói Khám</b></div>
                            <div className='sub-title'>Khám Sức Khỏe Tổng Quát</div>
                        </div>
                    </div>
                    <div className='header-content-right'>
                        <div className='language-selection'>
                            <i className="fas fa-flag"></i>
                            <span>Languages</span>
                        </div>
                        <div className='help-section'>
                            <i className="fas fa-question-circle"></i>
                            <span>Hỗ Trợ</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
