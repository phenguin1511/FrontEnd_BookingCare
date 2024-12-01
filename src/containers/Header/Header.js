import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { LANGUAGES, USER_ROLE } from "../../utils"
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
class Header extends Component {
    constructor(props) {
        super(props);
        // Initializing the state for dropdown
        this.state = {
            isDropdownOpen: false,
            menuApp: []
        };
    }
    toggleDropdown = () => {
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    };
    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    componentDidMount() {
        let { userInfo } = this.props
        let menu = []
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu
            }
        }
        this.setState({
            menuApp: menu
        })
    }
    render() {
        const { processLogout, userInfo } = this.props;

        return (
            <div className="header-container">
                <div className="header-left">
                    {/* Thanh navigator */}
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className="header-right">
                    <div className="user-info">
                        <p className='user-name'><FormattedMessage id="home-header.welcome" />, {userInfo.firstName} {userInfo.lastName}</p>
                    </div>
                    <div className='language-selection' onClick={this.toggleDropdown}>
                        <i className="fas fa-flag"></i>
                        <span><FormattedMessage id="home-header.languages" /></span>
                        <div className={`dropdown-menu ${this.state.isDropdownOpen ? 'show' : ''}`}>
                            <div className='dropdown-option'>
                                <div className="flag-icon-usa">

                                </div>
                                <span onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}><FormattedMessage id="home-header.english" /></span>
                            </div>
                            <div className='dropdown-option'>
                                <div className="flag-icon-vn">

                                </div>
                                <span onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}><FormattedMessage id="home-header.vietnamese" /></span>
                            </div>
                        </div>
                    </div>
                    <div className="btn-logout " onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }

}

// Lấy thông tin người dùng từ state
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        lang: state.app.language, // Thêm dòng này để lấy thông tin người dùng
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
