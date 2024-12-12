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
class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/list-user-redux" component={TableManageUser} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/list-specialty" component={ListSpecialty} />
                            <Route path="/system/edit-specialty" component={EditSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/list-clinic" component={ListClinic} />
                            <Route path="/system/edit-clinic" component={EditClinic} />
                            <Route path="/system/manage-handbook" component={ManageHandBook} />
                            <Route path="/system/list-handbook" component={ListHandBook} />
                            <Route path="/system/edit-handbook" component={EditHandBook} />

                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(System);
