import axios from 'axios';
import _ from 'lodash';
import config from './config';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để thêm token vào headers của mỗi request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response và lỗi
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Kiểm tra lỗi 401 (Token không hợp lệ hoặc hết hạn)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
            return Promise.reject('Unauthorized - Please log in again');
        }

        // Kiểm tra lỗi 403 (Forbidden)
        if (error.response && error.response.status === 403) {
            return Promise.reject('Forbidden - You do not have permission to access this resource');
        }

        // Kiểm tra lỗi 500 (Internal Server Error)
        if (error.response && error.response.status === 500) {
            return Promise.reject('Server Error - Please try again later');
        }

        // Xử lý các lỗi khác
        if (error.response && error.response.data && error.response.data.message) {
            return Promise.reject(error.response.data.message);
        }

        return Promise.reject(error);
    }
);

export default instance;
