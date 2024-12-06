import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Patient/ManagePatient';
import ManageScheduleDoctor from '../containers/System/Doctor/ManageScheduleDoctor';
class Doctor extends Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>

                            <Route path="/doctor/schedule-manage" component={ManageSchedule} />
                            <Route path="/doctor/patient-manage" component={ManagePatient} />
                            <Route path="/doctor/schedule-doctor-manage" component={ManageScheduleDoctor} />
                        </Switch>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
