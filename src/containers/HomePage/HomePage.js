import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutstanDoctor from './Section/OutstanDoctor';
import HandBook from './Section/HandBook';
class HomePage extends Component {

    render() {
        return (

            <div>
                <HomeHeader />
                <Specialty />
                <MedicalFacility />
                <OutstanDoctor />
                <HandBook />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
