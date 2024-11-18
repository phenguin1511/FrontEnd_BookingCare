import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    position: [],
    isLoadingGender: false,
    users: [],
    doctors: []
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
        default:
            return state;
    }
};

export default adminReducer;
