import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Patient/ManagePatient';
import ManageScheduleDoctor from '../containers/System/Doctor/ManageScheduleDoctor';
class Doctor extends Component {
    render() {
        const { doctorMenuPath, isLoggedIn, userRole } = this.props;

        if (isLoggedIn && userRole !== 'R2' && userRole !== 'R1') {
            return <Redirect to="/unauthorized" />;
        }

        return (
            <Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <PrivateRoute path="/doctor/schedule-manage" component={ManageSchedule} roles={['R2', 'R1']} />
                            <PrivateRoute path="/doctor/patient-manage" component={ManagePatient} roles={['R2', 'R1']} />
                            <PrivateRoute path="/doctor/schedule-doctor-manage" component={ManageScheduleDoctor} roles={['R2', 'R1']} />
                            <PrivateRoute component={() => { return (<Redirect to={doctorMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        doctorMenuPath: state.app.doctorMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userRole: state.user.userInfo?.roleId,
    };
};


const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
