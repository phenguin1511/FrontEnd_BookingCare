import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ListSpecialty from '../containers/System/Specialty/ListSpecialty';
import ListClinic from '../containers/System/Clinic/ListClinic';
import TableManageUser from '../containers/System/Admin/TableManageUser';
import EditSpecialty from '../containers/System/Specialty/EditSpecialty';
import EditClinic from '../containers/System/Clinic/EditClinic';
import ManageHandBook from '../containers/System/HandBook/ManageHandBook';
import ListHandBook from '../containers/System/HandBook/ListHandBook';
import EditHandBook from '../containers/System/HandBook/EditHandBook';
import PrivateRoute from './PrivateRoute';
class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userRole } = this.props;

        if (isLoggedIn && userRole !== 'R1') {
            return <Redirect to="/unauthorized" />;
        }
        return (
            <Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <PrivateRoute path="/system/user-manage" component={UserManage} roles={['R1']} />
                            <PrivateRoute path="/system/user-redux" component={UserRedux} roles={['R1']} />
                            <PrivateRoute path="/system/list-user-redux" component={TableManageUser} roles={['R1']} />
                            <PrivateRoute path="/system/manage-doctor" component={ManageDoctor} roles={['R1']} />
                            <PrivateRoute path="/system/manage-specialty" component={ManageSpecialty} roles={['R1']} />
                            <PrivateRoute path="/system/list-specialty" component={ListSpecialty} roles={['R1']} />
                            <PrivateRoute path="/system/edit-specialty" component={EditSpecialty} roles={['R1']} />
                            <PrivateRoute path="/system/manage-clinic" component={ManageClinic} roles={['R1']} />
                            <PrivateRoute path="/system/list-clinic" component={ListClinic} roles={['R1']} />
                            <PrivateRoute path="/system/edit-clinic" component={EditClinic} roles={['R1']} />
                            <PrivateRoute path="/system/manage-handbook" component={ManageHandBook} roles={['R1']} />
                            <PrivateRoute path="/system/list-handbook" component={ListHandBook} roles={['R1']} />
                            <PrivateRoute path="/system/edit-handbook" component={EditHandBook} roles={['R1']} />

                            <Route component={() => { return (<Redirect to={TableManageUser} />) }} />
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
        isLoggedIn: state.user.isLoggedIn,
        userRole: state.user.userInfo?.roleId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
