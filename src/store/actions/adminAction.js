import actionTypes from './actionTypes';
import {
    getAllCodeService,
    getAllUsers,
    handleAddUser,
    deleteUserService,
    editUserService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveInfoDoctorService,
    getInfoDetailDoctor,
    getExtraInfoDoctorById
} from '../../services/userService';
import { toast } from 'react-toastify';
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            let res = await getAllCodeService('gender');
            if (res && res.data.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log(error)
        }
    }

}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

// POSITION
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION');
            if (res && res.data.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log(error)
        }
    }

}
export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

// ROLE
export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE');
            if (res && res.data.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log(error)
        }
    }

}
export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})


export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await handleAddUser(data);
            console.log(res);
            if (res && res.data.errCode === 0) {
                toast.success("Create Success!!");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Delete Error!!");
                dispatch(saveUserFailed());
            }
        } catch (error) {
            dispatch(saveUserFailed());
            console.log(error)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})


export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");

            if (res && res.data.errCode === 0) {
                toast.success("Get All User Success!!");
                dispatch(fetchAllUserSuccess(res.data.users.reverse()));
            } else {
                toast.error("Get All User Error!!");
                dispatch(fetchAllUserFailed());
            }
        } catch (error) {
            dispatch(fetchAllUserFailed());
            console.log(error)
        }
    }
}

export const fetchAllUserSuccess = (users) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: users
})

export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

export const deleteUser = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(id);
            console.log(res);
            if (res && res.data.errCode === 0) {
                toast.success("Delete Success!!");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Delete Error!!");
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            dispatch(deleteUserFailed());
            console.log(error)
        }
    }
}

export const deleteUserSuccess = (users) => ({
    type: actionTypes.FETCH_DELETE_USERS_SUCCESS,
    users: users
})

export const deleteUserFailed = () => ({
    type: actionTypes.FETCH_DELETE_USERS_FAILED
})

export const editUserAction = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            // console.log(res);
            if (res && res.data.errCode === 0) {
                toast.success("Edit Success!!");
                dispatch(editUserSuccess(res.data.users));
                dispatch(fetchAllUsersStart());
            } else {
                toast.error("Edit Error!!");
                dispatch(editUserFailed());
            }
        } catch (error) {
            dispatch(editUserFailed());
            console.log(error)
        }
    }
}

export const editUserSuccess = (users) => ({
    type: actionTypes.FETCH_EDIT_USERS_SUCCESS,
    users: users
})

export const editUserFailed = () => ({
    type: actionTypes.FETCH_EDIT_USERS_FAILED
})


export const fetchTopDoctor = (limit) => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService(limit);
            if (res && res.data.errCode === 0) {
                toast.success("Get Top Doctor Success!!");
                dispatch(fetchTopDoctorSuccess(res.data.data));
            } else {
                toast.error("Get Top Doctor Error!!");
                dispatch(fetchTopDoctorFailed());
            }
        } catch (error) {
            dispatch(fetchTopDoctorFailed());
            console.log(error)
        }
    }
}

export const fetchTopDoctorSuccess = (doctors) => ({
    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
    doctors: doctors,

})

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
})

export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.data.errCode === 0) {
                toast.success("Get Top Doctor Success!!");
                dispatch(fetchAllDoctorSuccess(res.data.data));
            } else {
                toast.error("Get Top Doctor Error!!");
                dispatch(fetchAllDoctorFailed());
            }
        } catch (error) {
            dispatch(fetchAllDoctorFailed());
            console.log(error)
        }
    }
}

export const fetchAllDoctorSuccess = (allDoctors) => ({
    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
    dataDoctors: allDoctors,
})

export const fetchAllDoctorFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
})

export const saveInfoDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveInfoDoctorService(data);
            if (res && res.data.errCode === 0) {
                toast.success("Save Doctor Success!!");
                dispatch(saveInfoDoctorSuccess());
            } else {
                toast.error("Save Doctor Error!!");
                dispatch(saveInfoDoctorFailed());
            }
        } catch (error) {
            dispatch(saveInfoDoctorFailed());
            console.log(error)
        }
    }
}

export const saveInfoDoctorSuccess = () => ({
    type: actionTypes.SAVE_INFO_DOCTORS_SUCCESS,
})

export const saveInfoDoctorFailed = () => ({
    type: actionTypes.SAVE_INFO_DOCTORS_FAILED,
})

export const fetchDetailInfoDoctor = (inputId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getInfoDetailDoctor(inputId);
            if (res && res.data.errCode === 0) {
                toast.success("Load Detail Infomation Doctor Success!!");
                dispatch(fetchDetailInfoDoctorSuccess(res.data.data));
            } else {
                toast.error("Load Detail Infomation Doctor Error!!");
                dispatch(fetchDetailInfoDoctorSuccess());
            }
        } catch (error) {
            dispatch(fetchDetailInfoDoctorFailed());
            console.log(error)
        }
    }
}

export const fetchDetailInfoDoctorSuccess = (doctorData) => ({
    type: actionTypes.FETCH_DETAIL_INFO_DOCTORS_SUCCESS,
    doctor: doctorData
})

export const fetchDetailInfoDoctorFailed = () => ({
    type: actionTypes.FETCH_DETAIL_INFO_DOCTORS_FAILED,
})

export const fetchTimeScheduleDocter = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('TIME');
            if (res && res.data.errCode === 0) {
                toast.success("Load Time Doctor Success!!");
                dispatch(fetchTimeScheduleDocterSuccess(res.data.data));
            } else {
                toast.error("Load Time Doctor Error!!");
                dispatch(fetchTimeScheduleDocterSuccess());
            }
        } catch (error) {
            dispatch(fetchTimeScheduleDocterFailed());
            console.log(error)
        }
    }
}

export const fetchTimeScheduleDocterSuccess = (doctorTime) => ({
    type: actionTypes.FETCH_SCHEDULE_TIME_DOCTORS_SUCCESS,
    doctorTime: doctorTime
})

export const fetchTimeScheduleDocterFailed = () => ({
    type: actionTypes.FETCH_SCHEDULE_TIME_DOCTORS_FAILED,
})

export const getRequireDoctorInfo = () => {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START });

        try {
            const [resPrice, resPayment, resProvince] = await Promise.all([
                getAllCodeService('PRICE'),
                getAllCodeService('PAYMENT'),
                getAllCodeService('PROVINCE'),
            ]);

            if (
                resPrice && resPrice.data.errCode === 0 &&
                resPayment && resPayment.data.errCode === 0 &&
                resProvince && resProvince.data.errCode === 0
            ) {
                const data = {
                    priceData: resPrice.data.data,
                    paymentData: resPayment.data.data,
                    provinceData: resProvince.data.data,
                };
                dispatch(getRequireDoctorInfoSuccess(data));
            } else {
                console.error('Error fetching data:', {
                    resPriceError: resPrice?.data?.errCode,
                    resPaymentError: resPayment?.data?.errCode,
                    resProvinceError: resProvince?.data?.errCode,
                });
                dispatch(getRequireDoctorInfoFailed());
            }
        } catch (error) {
            console.error('Error occurred while fetching required doctor info:', error);
            dispatch(getRequireDoctorInfoFailed());
        }
    };
};


export const getRequireDoctorInfoSuccess = (doctorInfo) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    doctorInfo: doctorInfo
})

export const getRequireDoctorInfoFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})


export const fetchExtraInfoDoctor = (inputId) => {
    return async (dispatch, getState) => {
        try {
            let res = await getExtraInfoDoctorById(inputId);
            if (res && res.data.errCode === 0) {
                toast.success("Load Detail Infomation Doctor Success!!");
                dispatch(fetchExtraInfoDoctorSuccess(res.data.data));
            } else {
                toast.error("Load Detail Infomation Doctor Error!!");
                dispatch(fetchExtraInfoDoctorFailed());
            }
        } catch (error) {
            dispatch(fetchExtraInfoDoctorFailed());
            console.log(error)
        }
    }
}

export const fetchExtraInfoDoctorSuccess = (doctorData) => ({
    type: actionTypes.FETCH_EXTRA_INFO_DOCTOR_SUCCESS,
    extraDoctor: doctorData
})

export const fetchExtraInfoDoctorFailed = () => ({
    type: actionTypes.FETCH_EXTRA_INFO_DOCTOR_FAILED,
})
