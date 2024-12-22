import actionTypes from './actionTypes';
import { push } from "connected-react-router"; // Thêm dòng này

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => {
    return (dispatch) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        dispatch({
            type: actionTypes.PROCESS_LOGOUT
        });

        dispatch(push('/login')); // Hoặc điều hướng về một route khác nếu cần
    };
}


export const setUserToEdit = (user) => ({
    type: 'SET_USER_TO_EDIT',
    payload: user
});