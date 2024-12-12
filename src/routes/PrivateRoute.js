import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Unauthorized from './Unauthorized';
const PrivateRoute = ({ component: Component, allowedRoles, ...props }) => {
    const { userInfo, isLoggedIn } = props;

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userInfo.roleId)) {
        return <Unauthorized />;
    }

    return <Route {...props} component={Component} />;
};


const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(PrivateRoute);
