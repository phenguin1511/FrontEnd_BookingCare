import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import "./HomeHeader.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils"
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
class HomeHeader extends Component {
    constructor(props) {
        super(props);
        // Initializing the state for dropdown
        this.state = {
            isDropdownOpen: false
        };
    }

    // Method to toggle dropdown visibility
    toggleDropdown = () => {
        this.setState(prevState => ({
            isDropdownOpen: !prevState.isDropdownOpen
        }));
    };
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }
    handleViewHistory = () => {
        this.props.history.push('/history-booking');
    };

    render() {
        return (

            < React.Fragment >
                <div className="homeHeader-container">
                    <div className='home-header-content'>
                        <div className='header-content-left'>
                            <i className="fas fa-bars bars-header"></i>
                            <div className='logo-image' onClick={() => this.returnToHome()}></div>
                        </div>
                        <div className='header-content-center'>
                            <div className='child-content'>
                                <div className='main-title'><b><FormattedMessage id="home-header.specialty" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='main-title'><b><FormattedMessage id="home-header.medicalfacility" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.choosemedicalfacility" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='main-title'><b><FormattedMessage id="home-header.doctor" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.choosegreatdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div className='main-title'><b><FormattedMessage id="home-header.medicalpackage" /></b></div>
                                <div className='sub-title'><FormattedMessage id="home-header.generalhealthcheck" /></div>
                            </div>
                        </div>
                        <div className='header-content-right'>
                            <div className='language-selection' onClick={this.toggleDropdown}>
                                <i className="fas fa-flag"></i>
                                <span><FormattedMessage id="home-header.languages" /></span>
                                <div className={`dropdown-menu ${this.state.isDropdownOpen ? 'show' : ''}`}>
                                    <div className='dropdown-option'>
                                        <div className="flag-icon-usa">

                                        </div>
                                        <span onClick={() => this.changeLanguage(LANGUAGES.EN)}><FormattedMessage id="home-header.english" /></span>
                                    </div>
                                    <div className='dropdown-option'>
                                        <div className="flag-icon-vn">

                                        </div>
                                        <span onClick={() => this.changeLanguage(LANGUAGES.VI)}><FormattedMessage id="home-header.vietnamese" /></span>
                                    </div>
                                </div>
                            </div>
                            <div className='history-section' onClick={this.handleViewHistory}>
                                <i class="fa-solid fa-rotate"></i>
                                <span>Lịch Sử</span>
                            </div>
                            <div className='help-section'>
                                <i className="fas fa-question-circle"></i>
                                <span><FormattedMessage id="home-header.help" /></span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isShowBanner === true && <div className='homeHeader-banner' >
                        <div className='banner-overlay'>
                            <div className='banner-content'>
                                <h1 className='title-banner'><FormattedMessage id="home-header.takecareofyourhealth" /></h1>
                                <p className='title2-banner'><FormattedMessage id="home-header.findthebestdoctorsandmedicalservices" /></p>
                                <div className='search-banner'>
                                    <FormattedMessage id="home-header.searchmedicalservices">
                                        {(placeholder) => (
                                            <input
                                                type="text"
                                                placeholder={placeholder}
                                                className="search-input"
                                            />
                                        )}
                                    </FormattedMessage>
                                    <button className='search-button'><FormattedMessage id="home-header.search" /></button>
                                </div>
                                <div className="options-banner">
                                    <button className="option-button">
                                        <i className="fas fa-stethoscope"></i> <FormattedMessage id="home-header.specialistexamination" />
                                    </button>
                                    <button className="option-button">
                                        <i className="fas fa-video"></i> <FormattedMessage id="home-header.remoteexamination" />
                                    </button>
                                    <button className="option-button">
                                        <i className="fas fa-heart"></i> <FormattedMessage id="home-header.generalhealthcheck" />
                                    </button>
                                    <button className="option-button">
                                        <i className="fas fa-flask"></i> <FormattedMessage id="home-header.medicaltest" />
                                    </button>
                                    <button className="option-button">
                                        <i className=" fas fa-solid fa-brain"></i> <FormattedMessage id="home-header.mentalhealth" />
                                    </button>
                                    <button className="option-button">
                                        <i className="fas fa-solid fa-tooth"></i> <FormattedMessage id="home-header.dentalexamination" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }


            </React.Fragment >
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        lang: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
