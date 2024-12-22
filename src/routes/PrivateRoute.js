import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, roles, userRole, isLoggedIn, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                !isLoggedIn ? (
                    <Redirect to="/login" />
                ) : roles.includes(userRole) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/unauthorized" />
                )
            }
        />
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userRole: state.user.userInfo?.roleId,
});

export default connect(mapStateToProps)(PrivateRoute);
