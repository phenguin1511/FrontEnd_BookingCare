import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const userRole = useSelector((state) => state.user.userInfo?.roleId);
    const location = useLocation();

    // Nếu dữ liệu chưa sẵn sàng, hiển thị loading
    if (isLoggedIn === undefined || userRole === undefined) {
        return <Redirect to="/home" />;
    }

    // Nếu chưa đăng nhập, chuyển hướng về trang login
    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    // Nếu đã đăng nhập với role R2 mà không ở đường dẫn dành cho doctor, chuyển hướng
    if (userRole === 'R2' && !location.pathname.startsWith('/doctor')) {
        return <Redirect to="/doctor/schedule-doctor-manage" />;
    }

    // Nếu đã đăng nhập với role R1 mà không ở đường dẫn dành cho hệ thống, chuyển hướng
    if (userRole === 'R1' && !location.pathname.startsWith('/system')) {
        return <Redirect to="/system/list-user-redux" />;
    }

    // Nếu đã đăng nhập và không cần chuyển hướng (đã đúng trang), hiển thị nội dung trang Home
    return <Redirect to="/home" />;
};

export default Home;
