import api from "./api";

const BASE_URL = "/users";
const ADMIN_BASE_URL = "/admin/users";

export const userService = {

    getMe: async () => {
        const response = await api.get(`${BASE_URL}/me/`);
        return response.data;
    },

    updateMe: async (userData) => {
        const response = await api.patch(`${BASE_URL}/me/`, userData);
        return response.data;
    },

    getUserById: async (userId) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        const response = await api.get(`${BASE_URL}/${userId}/`);
        return response.data;
    },

    createUser: async (userData) => {
        console.log("Creating user with data:", userData);
        const response = await api.post(`/register/`, userData);
        return response.data;
    },

    getUserByIdAdmin: async (userId) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        const response = await api.get(`${ADMIN_BASE_URL}/${userId}/`);
        return response.data;
    },

    getAllUsersAdmin: async () => {
        const response = await api.get(`${ADMIN_BASE_URL}/`);
        return response.data;
    },

    createUserAdmin: async (userData) => {
        const payload = {
            name: userData.name,
            surname: userData.surname,
            second_surname: userData.second_surname,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            is_staff: !!userData.is_staff
        };
        const response = await api.post(`${ADMIN_BASE_URL}/`, payload);
        return response.data;
    },
    
    updateUserAdmin: async (userId, userData) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        const response = await api.patch(`${ADMIN_BASE_URL}/${userId}/`, userData);
        return response.data;
    }, 

    deleteUserAdmin: async (userId) => {
        if (typeof userId !== 'number' || isNaN(userId) || userId < 1) {
            return Promise.reject(new Error("user id not valid."));
        };
        await api.delete (`${ADMIN_BASE_URL}/${userId}/`);
        return true;
    },

    searchUsersByUsernameAdmin: async (username) => {
        if (typeof username !== 'string' || !username.trim()) {
            return Promise.reject(new Error("El nombre de usuario debe ser una cadena no vacía."));
        }
        const response = await api.get(`${ADMIN_BASE_URL}/`, { params: { search: username } });
        return response.data;
    }

};
