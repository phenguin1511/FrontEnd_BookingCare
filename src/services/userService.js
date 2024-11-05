import axios from "../axios";



const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const handleAddUser = (data) => {
    return axios.post(`/api/create-new-user`, data);
}

export { handleLoginApi, getAllUsers, handleAddUser }
