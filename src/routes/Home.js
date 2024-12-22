import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, Redirect } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const userRole = useSelector((state) => state.user.userInfo?.roleId);
    const history = useHistory();
    const location = useLocation();
    const [redirected, setRedirected] = useState(false);

    useEffect(() => {
        if (isLoggedIn === undefined || userRole === undefined) {
            return;
        }

        if (isLoggedIn && !redirected) {
            if (userRole === 'R2' && !location.pathname.startsWith('/doctor')) {
                history.push('/doctor/schedule-doctor-manage');
                setRedirected(true);
            } else if (userRole === 'R1' && !location.pathname.startsWith('/system')) {
                history.push('/system/list-user-redux');
                setRedirected(true);
            }
        } else if (!isLoggedIn && !redirected) {
            history.push('/login');
            setRedirected(true);
        }
    }, [isLoggedIn, userRole, location.pathname, history, redirected]);

    if (isLoggedIn === undefined || userRole === undefined) {
        history.push('/home');
    }

    return (
        <Redirect to="/unauthorized" />
    );
};

export default Home;
