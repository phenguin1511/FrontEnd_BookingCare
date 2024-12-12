import axios from "../axios";



const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const handleForgotPasswordApi = (userEmail) => {
    return axios.post('/api/forgot-password', { email: userEmail });
};

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const handleAddUser = (data) => {
    return axios.post(`/api/create-new-user`, data);
}

const deleteUserService = (userId) => {
    return axios.delete(`/api/delete-user`, { data: { id: userId } });
}

const editUserService = (inputData) => {
    return axios.put(`/api/edit-user`, inputData)
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctor`)
}

const saveInfoDoctorService = (data) => {
    return axios.post(`/api/save-info-doctor`, data)
}

const getInfoDetailDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor?id=${inputId}`);
}

const createScheduleDoctor = (data) => {
    return axios.post('/api/create-schedule-doctor', data)
}
const getScheduleDoctorByDate = (inputId, inputDate) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${inputId}&date=${inputDate}`);
}
const getExtraInfoDoctorById = (inputId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${inputId}`);
}
const postPatientBookingAppointment = (data) => {
    return axios.post('/api/patient-book-appoitment', data)
}
const verifyBookingAppointment = (data) => {
    return axios.post('/api/verify-book-appoitment', data)
}

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}


const getAllSpecialty = () => {
    return axios.get('/api/get-all-specialty')
}

const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data)
}


const getAllClinic = () => {
    return axios.get('/api/get-all-clinic')
}

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}}`);
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}}&date=${data.date}`);
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data)
}

const handleChangePasswordApi = (data) => {
    return axios.post('/api/change-password', data)
}

const deleteSpecialty = (data) => {
    return axios.post(`/api/delete-specialty?id=${data.id}}`)
}

const deleteClinic = (data) => {
    return axios.post(`/api/delete-clinic?id=${data.id}}`)
}

const deleteBookingPatient = (data) => {
    return axios.post(`/api/delete-booking-patient?id=${data.id}`)
}

const getInfoSpecialtyById = (data) => {
    return axios.get(`/api/get-info-specialty-by-id?id=${data}`)
}

const updateSpecialty = (data) => {
    return axios.post(`/api/save-info-specialty`, data)
}

const getInfoClinicById = (data) => {
    return axios.get(`/api/get-info-clinic-by-id?id=${data}`)
}

const updateClinic = (data) => {
    return axios.post(`/api/save-info-clinic`, data)
}

const createNewHandBook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}

const getAllHandBook = () => {
    return axios.get(`/api/get-all-handbook`)
}
const getInfoHandBookById = (data) => {
    return axios.get(`/api/get-info-handbook-by-id?id=${data}`)
}
const updateHandBook = (data) => {
    return axios.post(`/api/save-info-handbook`, data)
}

const getDetailHandBookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data}`)
}


const getBookingHistoryByEmail = (data) => {
    return axios.get(`/api/get-list-booking-for-patient?email=${data.email}`)
}
export {
    handleLoginApi,
    getAllUsers,
    handleAddUser,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveInfoDoctorService,
    getInfoDetailDoctor,
    createScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInfoDoctorById,
    postPatientBookingAppointment,
    verifyBookingAppointment,
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
    handleForgotPasswordApi,
    getAllPatientForDoctor,
    postSendRemedy,
    handleChangePasswordApi,
    deleteSpecialty,
    deleteClinic,
    deleteBookingPatient,
    getInfoSpecialtyById,
    updateSpecialty,
    getInfoClinicById,
    updateClinic,
    createNewHandBook,
    getAllHandBook,
    getInfoHandBookById,
    updateHandBook,
    getDetailHandBookById,
    getBookingHistoryByEmail
}
