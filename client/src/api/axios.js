import axios from 'axios';

// Putem schimba URL-ul daca serverul ruleaza pe alt port
const instance = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Interceptor pentru a atasa token-ul la fiecare cerere
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
