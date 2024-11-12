const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    //admin
    // ADMIN_LOGIN_SUCCESS: 'ADMIN_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',
    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',

    //Admin
    FETCH_GENDER_START: "FETCH_GENDER_START",
    FETCH_GENDER_SUCCESS: "FETCH_GENDER_SUCCESS",
    FETCH_GENDER_FAILED: "FETCH_GENDER_FAILED",

    FETCH_POSITION_SUCCESS: "FETCH_POSITION_SUCCESS",
    FETCH_POSITION_FAILD: "FETCH_POSITION_FAILED",

    FETCH_ROLE_SUCCESS: "FETCH_ROLE_SUCCESS",
    FETCH_ROLE_FAILD: "FETCH_ROLE_FAILED",

    CREATE_USER_SUCCESS: "CREATE_USER_SUCCESS",
    CREATE_USER_FAILED: "CREATE_USER_FAILED",

    FETCH_ALL_USERS_SUCCESS: "FETCH_ALL_USERS_SUCCESS",
    FETCH_ALL_USERS_FAILED: "FETCH_ALL_USERS_FAILED",

    FETCH_DELETE_USERS_SUCCESS: "FETCH_DELETE_USERS_SUCCESS",
    FETCH_DELETE_USERS_FAILED: "FETCH_DELETE_USERS_FAILED",
})

export default actionTypes;