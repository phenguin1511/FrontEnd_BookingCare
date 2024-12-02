import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    position: [],
    isLoadingGender: false,
    users: [],
    doctors: [],
    allDoctors: [],
    info_doctor: [],
    allScheduleTime: [],
    allRequiredDoctorInfo: [],
    extraInfoDoctor: [],
    dataSpecialties: []
};

const adminReducer = (state = initialState, action) => {
    // Declare state outside the switch

    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyState = { ...state };
            copyState.isLoadingGender = true;
            return {
                ...copyState
            };

        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;
            return {
                ...state
            };

        case actionTypes.FETCH_GENDER_FAILED:
            state.genders = [];
            state.isLoadingGender = false;
            return {
                ...state
            };
        case actionTypes.FETCH_POSITION_START:
            state.isLoadingGender = true;
            return {
                ...state
            };
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.position = action.data
            return {
                ...state
            };

        case actionTypes.FETCH_POSITION_FAILED:
            state.position = [];

            return {
                ...state
            };
        case actionTypes.FETCH_ROLE_START:
            state.isLoadingGender = true;
            return {
                ...state
            };
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data
            return {
                ...state
            };

        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state
            };
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users
            return {
                ...state
            };

        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state
            };
        case actionTypes.FETCH_EDIT_USERS_SUCCESS:
            state.users = action.users
            return {
                ...state
            };

        case actionTypes.FETCH_EDIT_USERS_FAILED:
            state.users = [];
            return {
                ...state
            };
        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.doctors = action.doctors
            return {
                ...state
            };

        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            state.doctors = [];
            return {
                ...state
            };
        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctors = action.dataDoctors
            return {
                ...state
            };

        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.allDoctors = [];
            return {
                ...state
            };
        case actionTypes.SAVE_INFO_DOCTORS_SUCCESS:
            state.allDoctors = action.dataDoctors
            return {
                ...state
            };
        case actionTypes.FETCH_DETAIL_INFO_DOCTORS_SUCCESS:
            state.info_doctor = action.doctor
            return {
                ...state
            };

        case actionTypes.FETCH_DETAIL_INFO_DOCTORS_FAILED:
            state.info_doctor = [];
            return {
                ...state
            };
        case actionTypes.FETCH_SCHEDULE_TIME_DOCTORS_SUCCESS:
            state.allScheduleTime = action.doctorTime
            return {
                ...state
            };

        case actionTypes.FETCH_SCHEDULE_TIME_DOCTORS_FAILED:
            state.allScheduleTime = [];
            return {
                ...state
            };
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            state.allRequiredDoctorInfo = action.doctorInfo
            return {
                ...state
            };

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
            state.allRequiredDoctorInfo = [];
            return {
                ...state
            };
        case actionTypes.FETCH_EXTRA_INFO_DOCTOR_SUCCESS:
            state.extraInfoDoctor = action.extraDoctor
            return {
                ...state
            };

        case actionTypes.FETCH_EXTRA_INFO_DOCTOR_FAILED:
            state.extraInfoDoctor = [];
            return {
                ...state
            };
        case actionTypes.FETCH_ALL_SPECIALTY_SUCCESS:
            state.dataSpecialties = action.dataSpecialties
            return {
                ...state
            };

        case actionTypes.FETCH_ALL_SPECIALTY_FAILED:
            state.dataSpecialties = [];
            return {
                ...state
            };
        default:
            return state;
    }
};

export default adminReducer;
